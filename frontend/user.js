// user.js
import express from "express";
import { createClient } from "@supabase/supabase-js";
import { getDistance } from "geolib";



const router = express.Router();

// 🔧 Koneksi Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// 📍 API: Absen GPS
// 📍 API: Absen GPS
router.post("/absen", async (req, res) => {
  try {
    const { id_akun, latitude, longitude } = req.body;
    if (!id_akun || !latitude || !longitude)
      return res.status(400).json({ success: false, message: "Data tidak lengkap." });

    // 1️⃣ Ambil data akun (termasuk id_shift & id_perusahaan)
    const { data: akun, error: akunError } = await supabase
      .from("akun")
      .select("id_perusahaan, id_shift")
      .eq("id_akun", id_akun)
      .single();

    if (akunError || !akun)
      return res.status(404).json({ success: false, message: "Akun tidak ditemukan." });

    // 2️⃣ Cek apakah sudah absen hari ini
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const { data: existing, error: checkError } = await supabase
      .from("kehadiran")
      .select("id_kehadiran")
      .eq("id_akun", id_akun)
      .gte("created_at", todayStart.toISOString())
      .lte("created_at", todayEnd.toISOString())
      .maybeSingle();

    if (checkError) throw checkError;
    if (existing)
      return res.status(400).json({
        success: false,
        message: "Kamu sudah melakukan presensi hari ini.",
      });

    // 3️⃣ Ambil lokasi perusahaan
    const { data: perusahaan, error: perusahaanError } = await supabase
      .from("perusahaan")
      .select("latitude, longitude, radius_m")
      .eq("id_perusahaan", akun.id_perusahaan)
      .single();

    if (perusahaanError || !perusahaan)
      return res.status(404).json({ success: false, message: "Perusahaan tidak ditemukan." });

    // 4️⃣ Hitung jarak antara user dan kantor
    const jarak = getDistance(
      { latitude: Number(latitude), longitude: Number(longitude) },
      { latitude: perusahaan.latitude, longitude: perusahaan.longitude }
    );

    if (jarak > perusahaan.radius_m) {
      return res.status(403).json({
        success: false,
        message: `Kamu berada di luar area kantor (${jarak} m dari titik kantor).`,
      });
    }

    // 5️⃣ Ambil jam shift untuk menentukan terlambat atau tidak
    let status = "HADIR";
    if (akun.id_shift) {
      const { data: shift } = await supabase
        .from("shift")
        .select("jam_masuk")
        .eq("id_shift", akun.id_shift)
        .maybeSingle();

      if (shift && shift.jam_masuk) {
        const now = new Date();
        const [h, m] = shift.jam_masuk.split(":");
        const jamShift = new Date(now);
        jamShift.setHours(h, m, 0);

        if (now > jamShift) status = "TERLAMBAT";
      }
    }

    // 6️⃣ Simpan ke tabel kehadiran
    const { error: insertError } = await supabase.from("kehadiran").insert([{
      id_akun,
      id_shift: akun.id_shift,
      jam_masuk: new Date(),
      status,
      latitude_absen: latitude,
      longitude_absen: longitude,
      id_perusahaan: akun.id_perusahaan,
    }]);

    if (insertError) throw insertError;

    res.json({
      success: true,
      message: `Presensi berhasil disimpan. Status: ${status}`,
    });

  } catch (error) {
    console.error("❌ Error absen:", error);
    res.status(500).json({ success: false, message: "Terjadi kesalahan server." });
  }
});


// 📅 GET: Data kehadiran berdasarkan bulan & tahun (versi RPC)
router.get("/kehadiran/:id_akun", async (req, res) => {
  try {
    const { id_akun } = req.params;
    const bulan = parseInt(req.query.bulan); // 1–12
    const tahun = parseInt(req.query.tahun); // contoh: 2025

    // 🔹 Validasi parameter
    if (!id_akun || !bulan || !tahun) {
      return res
        .status(400)
        .json({ success: false, message: "Parameter tidak lengkap." });
    }

    // 🔹 Panggil fungsi RPC Supabase (pastikan sudah dibuat di SQL Editor)
    const { data, error } = await supabase.rpc("get_kehadiran_bulan", {
      _user_id: id_akun,
      _bulan: bulan,
      _tahun: tahun,
    });

    if (error) {
      console.error("❌ RPC Error:", error);
      return res.status(500).json({
        success: false,
        message: "Gagal memuat data kalender dari database.",
        detail: error.message,
      });
    }

    // ✅ Berhasil ambil data
    return res.json({
      success: true,
      count: data?.length || 0,
      data,
    });
  } catch (err) {
    console.error("❌ Error ambil data kehadiran (RPC):", err);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan internal server.",
    });
  }
});


// 📝 POST: Ajukan izin atau WFH
// 📝 API: Ajukan Izin / WFH
router.post("/izin", async (req, res) => {
  try {
    const { id_akun, tanggal_mulai, tanggal_selesai, jenis_izin, alasan, keterangan } = req.body;

    if (!id_akun || !tanggal_mulai || !tanggal_selesai || !jenis_izin)
      return res.status(400).json({ success: false, message: "Data tidak lengkap." });

    // Pastikan user tidak mengajukan izin yang overlap dengan izin sebelumnya
    const { data: existing, error: overlapError } = await supabase
      .from("izin_wfh")
      .select("id_izin")
      .eq("id_akun", id_akun)
      .lte("tanggal_mulai", tanggal_selesai)
      .gte("tanggal_selesai", tanggal_mulai)
      .maybeSingle();

    if (overlapError) throw overlapError;
    if (existing)
      return res.status(400).json({
        success: false,
        message: "Kamu sudah memiliki izin/WFH di rentang tanggal ini.",
      });

    // Simpan ke tabel izin_wfh
    const { error: insertError } = await supabase.from("izin_wfh").insert([{
      id_akun,
      tanggal_mulai,
      tanggal_selesai,
      jenis_izin,
      alasan,
      keterangan,
      status_persetujuan: "PENDING"
    }]);

    if (insertError) throw insertError;

    res.json({
      success: true,
      message: "Pengajuan izin/WFH berhasil dikirim dan menunggu persetujuan admin.",
    });

  } catch (error) {
    console.error("❌ Error ajukan izin:", error);
    res.status(500).json({ success: false, message: "Gagal mengirim pengajuan izin." });
  }
});


// 👤 GET: Profil user berdasarkan id_akun
router.get("/:id_akun", async (req, res) => {
  const { id_akun } = req.params;
  try {
    const { data, error } = await supabase
      .from("akun")
      .select("username, email, no_tlp, alamat_karyawan, id_shift")
      .eq("id_akun", id_akun)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error("❌ Error ambil profil:", err);
    res.status(500).json({ message: "Gagal mengambil profil pengguna" });
  }
});


// 4️⃣ Ambil jam shift
// const { data: shift } = await supabase
//   .from("shift")
//   .select("jam_masuk")
//   .eq("id_shift", akun.id_shift)
//   .maybeSingle();

// let status = "HADIR";
// if (shift) {
//   const now = new Date();
//   const [h, m] = shift.jam_masuk.split(":");
//   const jamShift = new Date(now);
//   jamShift.setHours(h, m, 0);

//   if (now > jamShift) status = "TERLAMBAT";
// }

export default router;
