// import React, { useState } from "react";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
export default function DashboardUser() {
  const navigate = useNavigate();
  const [page, setPage] = useState("home"); // 🔹 halaman aktif
  const [attendanceStatus, setAttendanceStatus] = useState("belum");
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState({ lat: null, long: null });
  const [kehadiran, setKehadiran] = useState([]);

  // Komponen halaman izin
  const [jenis_izin, setJenisIzin] = useState("");
  const [tanggal_mulai, setTanggalMulai] = useState("");
  const [tanggal_selesai, setTanggalSelesai] = useState("");
  const [alasan, setAlasan] = useState("");
  const [keterangan, setKeterangan] = useState("");


  // ✅ Ambil lokasi GPS
  const handleGetLocation = async () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) reject("Browser tidak mendukung GPS");
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setCoords({ lat: latitude, long: longitude });
          resolve({ latitude, longitude });
        },
        (err) => reject("Gagal mendapatkan lokasi: " + err.message),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  };

  // ✅ Kirim absen ke backend
  const handleAttendance = async () => {
    try {
      setLoading(true);
      const position = await handleGetLocation();
      const res = await axios.post("http://localhost:5000/api/user/absen", {
        id_akun: localStorage.getItem("id_akun"),
        latitude: position.latitude,
        longitude: position.longitude,
      });

      if (res.data.success) {
        setAttendanceStatus("sudah");
        alert("✅ Presensi berhasil dicatat!");
      } else {
        alert("❌ " + res.data.message);
      }
    } catch (err) {
      alert("Gagal absen: " + err.message);
    } finally {
      setLoading(false);
    }
  };
  // Func absen 1 kali
  useEffect(() => {
    const checkToday = async () => {
      const idAkun = localStorage.getItem("id_akun");
      const today = new Date();
      const bulan = today.getMonth() + 1;
      const tahun = today.getFullYear();

      const res = await axios.get(
        `http://localhost:5000/api/user/kehadiran/${idAkun}?bulan=${bulan}&tahun=${tahun}`
      );

      const sudah = res.data.data.some(
        (d) => new Date(d.created_at).toDateString() === today.toDateString()
      );

      if (sudah) setAttendanceStatus("sudah");
    };

    checkToday();
  }, []);

  // Logout
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Muat data kehadiran perakun
  const fetchKehadiran = async (bulan, tahun) => {
    try {
      const idAkun = localStorage.getItem("id_akun");
      const res = await axios.get(
        `http://localhost:5000/api/user/kehadiran/${idAkun}?bulan=${bulan}&tahun=${tahun}`
      );
      if (res.data.success) setKehadiran(res.data.data);
    } catch (err) {
      console.error("❌ Gagal memuat data kalender:", err);
    }
  };

  // Ambil data awal (bulan & tahun sekarang)
  useEffect(() => {
    const now = new Date();
    fetchKehadiran(now.getMonth() + 1, now.getFullYear());
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Karyawan</h1>
          <button onClick={handleLogout} className="text-indigo-600 font-medium hover:text-indigo-800">
            Logout
          </button>
        </div>
      </header>

      {/* 🔹 NAVBAR TAB */}
      <nav className="bg-white shadow-md flex justify-center gap-4 py-3">
        {["home", "kalender", "izin", "profil"].map((item) => (
          <button
            key={item}
            onClick={() => setPage(item)}
            className={`px-4 py-2 rounded-lg font-semibold transition ${page === item
              ? "bg-indigo-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-indigo-100"
              }`}
          >
            {item.toUpperCase()}
          </button>
        ))}
      </nav>

      <main className="max-w-5xl mx-auto p-6">
        {/* ================= HOME ================= */}
        {page === "home" && (
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-xl font-semibold mb-4">Presensi Hari Ini</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">
                  Status:
                  <span
                    className={`ml-2 font-semibold ${attendanceStatus === "sudah" ? "text-green-600" : "text-red-600"
                      }`}
                  >
                    {attendanceStatus === "sudah" ? "✅ Sudah Presensi" : "❌ Belum Presensi"}
                  </span>
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date().toLocaleDateString("id-ID", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                {coords.lat && (
                  <p className="text-xs text-gray-500 mt-1">
                    Lokasi: {coords.lat.toFixed(6)}, {coords.long.toFixed(6)}
                  </p>
                )}
              </div>
              <button
                onClick={handleAttendance}
                disabled={attendanceStatus === "sudah" || loading}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? "⏳ Memproses..."
                  : attendanceStatus === "sudah"
                    ? "✓ Sudah Presensi"
                    : "📝 Presensi Sekarang"}
              </button>
            </div>

            {/* Grid navigasi cepat */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 text-center">
              <div
                onClick={() => setPage("kalender")}
                className="cursor-pointer card hover:bg-indigo-50"
              >
                <div className="text-3xl mb-3">📅</div>
                <h4 className="font-semibold">Riwayat Presensi</h4>
                <p className="text-sm text-gray-600 mt-2">Lihat kehadiran bulan ini</p>
              </div>

              <div
                onClick={() => setPage("izin")}
                className="cursor-pointer card hover:bg-indigo-50"
              >
                <div className="text-3xl mb-3">📋</div>
                <h4 className="font-semibold">Ajukan Izin</h4>
                <p className="text-sm text-gray-600 mt-2">Form izin atau WFH</p>
              </div>

              <div
                onClick={() => setPage("profil")}
                className="cursor-pointer card hover:bg-indigo-50"
              >
                <div className="text-3xl mb-3">👤</div>
                <h4 className="font-semibold">Profil Saya</h4>
                <p className="text-sm text-gray-600 mt-2">Kelola data pribadi</p>
              </div>
            </div>
          </div>
        )}

        {/* ================= KALENDER ================= */}
        {page === "kalender" && (
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-4 text-center">📅 Kalender Kehadiran</h2>

            <Calendar
              onActiveStartDateChange={(e) => {
                const bulanBaru = e.activeStartDate.getMonth() + 1;
                const tahunBaru = e.activeStartDate.getFullYear();
                fetchKehadiran(bulanBaru, tahunBaru);
              }}
              tileClassName={({ date, view }) => {
                if (view !== "month") return "";
                const record = kehadiran.find(
                  (d) => new Date(d.created_at).toDateString() === date.toDateString()
                );

                if (!record) return "";

                switch (record.status) {
                  case "HADIR":
                    return "bg-green-200 text-green-700 font-semibold rounded-full";
                  case "TERLAMBAT":
                    return "bg-orange-200 text-orange-700 font-semibold rounded-full";
                  case "IZIN":
                    return "bg-yellow-200 text-yellow-700 font-semibold rounded-full";
                  case "WFH":
                    return "bg-blue-200 text-blue-700 font-semibold rounded-full";
                  case "ALFA":
                    return "bg-red-200 text-red-700 font-semibold rounded-full";
                  default:
                    return "";
                }
              }}
              tileContent={({ date }) => {
                const data = kehadiran.find(
                  (d) => new Date(d.created_at).toDateString() === date.toDateString()
                );

                return data ? (
                  <div className="absolute bottom-1 left-1 right-1 mx-auto flex justify-center">
                    <span
                      className={`w-2 h-2 rounded-full
            ${data.status === "HADIR" ? "bg-green-500" :
                          data.status === "TERLAMBAT" ? "bg-yellow-500" :
                            data.status === "IZIN" ? "bg-blue-500" :
                              data.status === "WFH" ? "bg-purple-500" :
                                "bg-red-500"}
          `}
                    ></span>
                  </div>
                ) : null;
              }}
            />


            <div className="flex justify-center gap-3 mt-4 text-sm">
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div> Hadir
              </span>
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 bg-orange-400 rounded-full"></div> Terlambat
              </span>
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div> Izin
              </span>
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-400 rounded-full"></div> WFH
              </span>
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div> Alfa
              </span>
            </div>
          </div>
        )}


        {/* ================= IZIN ================= */}

        {page === "izin" && (
          <div className="bg-white p-6 rounded-xl shadow max-w-lg mx-auto">
            <h2 className="text-xl font-semibold mb-4 text-center">📝 Ajukan Izin / WFH</h2>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  setLoading(true);
                  const res = await axios.post("http://localhost:5000/api/user/izin", {
                    id_akun: localStorage.getItem("id_akun"),
                    tanggal_mulai,
                    tanggal_selesai,
                    jenis_izin,
                    alasan,
                    keterangan,
                  });
                  alert(res.data.message);
                } catch (err) {
                  alert("❌ " + (err.response?.data?.message || "Gagal mengirim izin."));
                } finally {
                  setLoading(false);
                }
              }}
              className="space-y-4 text-left"
            >
              <div>
                <label className="block text-sm font-medium mb-1">Jenis Izin</label>
                <select
                  value={jenis_izin}
                  onChange={(e) => setJenisIzin(e.target.value)}
                  className="input w-full border p-2 rounded"
                >
                  <option value="">-- Pilih Jenis Izin --</option>
                  <option value="IZIN">Izin</option>
                  <option value="WFH">Work From Home</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Tanggal Mulai</label>
                <input
                  type="date"
                  value={tanggal_mulai}
                  onChange={(e) => setTanggalMulai(e.target.value)}
                  className="input w-full border p-2 rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Tanggal Selesai</label>
                <input
                  type="date"
                  value={tanggal_selesai}
                  onChange={(e) => setTanggalSelesai(e.target.value)}
                  className="input w-full border p-2 rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Alasan</label>
                <input
                  type="text"
                  value={alasan}
                  onChange={(e) => setAlasan(e.target.value)}
                  placeholder="Contoh: Sakit, Acara keluarga, dst..."
                  className="input w-full border p-2 rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Keterangan Tambahan</label>
                <textarea
                  value={keterangan}
                  onChange={(e) => setKeterangan(e.target.value)}
                  rows="3"
                  placeholder="Tambahkan detail tambahan jika perlu..."
                  className="input w-full border p-2 rounded"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
              >
                {loading ? "⏳ Mengirim..." : "Kirim Pengajuan"}
              </button>
            </form>
          </div>
        )}


        {/* ================= PROFIL ================= */}
        {page === "profil" && (
          <div className="bg-white p-6 rounded-xl shadow text-center">
            <h2 className="text-xl font-semibold mb-2">👤 Profil Saya</h2>
            <p className="text-gray-600">Menampilkan data akun karyawan.</p>
          </div>
        )}
      </main>
    </div>
  );
}
