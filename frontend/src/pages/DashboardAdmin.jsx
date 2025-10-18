import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DashboardAdmin() {
  const navigate = useNavigate();
  const [page, setPage] = useState("dashboard");

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ================= HEADER ================= */}
      <header className="bg-indigo-700 text-white shadow p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard Admin</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
        >
          Logout
        </button>
      </header>

      {/* ================= NAVIGATION ================= */}
      <nav className="bg-white shadow p-4 flex flex-wrap gap-3 justify-center">
        {[
          { key: "dashboard", label: "🏠 Dashboard" },
          { key: "karyawan", label: "👥 Kelola Karyawan" },
          { key: "jadwal", label: "🕒 Jadwal Kerja" },
          { key: "izin", label: "📝 Verifikasi Izin" },
          { key: "rekap", label: "🏅 Rekap & Reward" },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => setPage(item.key)}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              page === item.key
                ? "bg-indigo-600 text-white shadow"
                : "bg-gray-100 hover:bg-indigo-100"
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* ================= MAIN CONTENT ================= */}
      <main className="p-6">
        {/* ---------------- DASHBOARD ---------------- */}
        {page === "dashboard" && (
          <section>
            <h2 className="text-xl font-bold mb-4">🏠 Ringkasan Sistem</h2>
            <p className="text-gray-600 mb-4">
              Halaman utama admin menampilkan ringkasan aktivitas perusahaan
              dan statistik singkat sistem kehadiran.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-gray-500">Total Karyawan</p>
                <p className="text-3xl font-bold text-indigo-600">--</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-gray-500">Presensi Hari Ini</p>
                <p className="text-3xl font-bold text-green-600">--</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-gray-500">Izin / WFH Aktif</p>
                <p className="text-3xl font-bold text-yellow-600">--</p>
              </div>
            </div>
          </section>
        )}

        {/* ---------------- KELOLA KARYAWAN ---------------- */}
        {page === "karyawan" && (
          <section>
            <h2 className="text-xl font-bold mb-4">👥 Kelola Data Karyawan</h2>
            <p className="text-gray-600">
              Halaman ini digunakan untuk menambah, mengedit, dan menonaktifkan
              akun karyawan yang terdaftar di perusahaan.
            </p>
            <div className="bg-white p-8 mt-4 rounded-lg shadow text-center text-gray-400">
              <p>📋 Belum ada data karyawan ditampilkan.</p>
              <p className="text-sm mt-2">
                (Tabel data dan form CRUD akan ditambahkan nanti)
              </p>
            </div>
          </section>
        )}

        {/* ---------------- JADWAL KERJA ---------------- */}
        {page === "jadwal" && (
          <section>
            <h2 className="text-xl font-bold mb-4">🕒 Jadwal & Shift Kerja</h2>
            <p className="text-gray-600">
              Admin dapat membuat, mengubah, dan mengatur jadwal kerja untuk
              setiap karyawan agar sistem presensi sesuai jam kerja yang telah
              ditetapkan.
            </p>
            <div className="bg-white p-8 mt-4 rounded-lg shadow text-center text-gray-400">
              <p>📅 Belum ada jadwal ditampilkan.</p>
              <p className="text-sm mt-2">
                (Form pembuatan shift dan pengaturan waktu akan ditambahkan nanti)
              </p>
            </div>
          </section>
        )}

        {/* ---------------- VERIFIKASI IZIN ---------------- */}
        {page === "izin" && (
          <section>
            <h2 className="text-xl font-bold mb-4">📝 Verifikasi Izin / WFH</h2>
            <p className="text-gray-600">
              Halaman ini menampilkan daftar pengajuan izin atau WFH dari
              karyawan untuk diverifikasi oleh admin.
            </p>
            <div className="bg-white p-8 mt-4 rounded-lg shadow text-center text-gray-400">
              <p>📤 Belum ada pengajuan izin yang perlu diverifikasi.</p>
              <p className="text-sm mt-2">
                (Daftar izin dan tombol verifikasi akan ditambahkan nanti)
              </p>
            </div>
          </section>
        )}

        {/* ---------------- REKAP & REWARD ---------------- */}
        {page === "rekap" && (
          <section>
            <h2 className="text-xl font-bold mb-4">🏅 Rekap Kedisiplinan & Reward</h2>
            <p className="text-gray-600 mb-4">
              Halaman ini berfungsi untuk menampilkan data tingkat kedisiplinan
              berdasarkan waktu kehadiran, keterlambatan, dan absensi tanpa
              keterangan. Sistem akan menghitung poin kedisiplinan otomatis
              sebagai dasar pemberian reward atau teguran.
            </p>
            <div className="bg-white p-8 rounded-lg shadow text-center text-gray-400">
              <p>📊 Belum ada data rekap ditampilkan.</p>
              <p className="text-sm mt-2">
                (Fitur filter tanggal, laporan bulanan, dan ekspor ke Excel/PDF akan ditambahkan nanti)
              </p>
            </div>

            {/* 💬 Komentar khusus halaman ini */}
            <div className="mt-6 p-4 bg-yellow-100 border-l-4 border-yellow-500 rounded">
              <p className="text-sm text-gray-700">
                💡 <strong>Catatan Khusus:</strong> Halaman ini digunakan oleh admin
                untuk melakukan <em>analisis performa kehadiran</em> karyawan.
                Di tahap pengembangan berikutnya, sistem akan menghitung skor
                kedisiplinan dan menghasilkan laporan digital yang bisa
                diekspor ke format Excel atau PDF sebagai dokumen resmi perusahaan.
              </p>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
