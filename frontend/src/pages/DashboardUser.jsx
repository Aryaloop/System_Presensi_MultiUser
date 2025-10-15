import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DashboardUser() {
  const navigate = useNavigate();
  const [attendanceStatus, setAttendanceStatus] = useState("belum");

  const handleLogout = () => {
    navigate("/login");
  };

  const handleAttendance = () => {
    setAttendanceStatus("sudah");
    alert("Presensi berhasil dicatat!");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard Karyawan</h1>
              <p className="text-gray-600">Selamat datang di sistem presensi</p>
            </div>
            <button
              onClick={handleLogout}
              className="btn-secondary"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Attendance Card */}
          <div className="card mb-6">
            <h3 className="text-xl font-semibold mb-4">Presensi Hari Ini</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Status: 
                  <span className={`ml-2 font-semibold ${
                    attendanceStatus === "sudah" ? "text-green-600" : "text-red-600"
                  }`}>
                    {attendanceStatus === "sudah" ? "✅ Sudah Presensi" : "❌ Belum Presensi"}
                  </span>
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date().toLocaleDateString('id-ID', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
              
              <button
                onClick={handleAttendance}
                disabled={attendanceStatus === "sudah"}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {attendanceStatus === "sudah" ? "✓ Sudah Presensi" : "📝 Presensi Sekarang"}
              </button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="card text-center">
              <div className="text-3xl mb-3">📅</div>
              <h4 className="font-semibold">Riwayat Presensi</h4>
              <p className="text-sm text-gray-600 mt-2">Lihat history kehadiran bulan ini</p>
            </div>
            
            <div className="card text-center">
              <div className="text-3xl mb-3">📋</div>
              <h4 className="font-semibold">Ajukan Izin</h4>
              <p className="text-sm text-gray-600 mt-2">Form pengajuan cuti atau izin</p>
            </div>
            
            <div className="card text-center">
              <div className="text-3xl mb-3">👤</div>
              <h4 className="font-semibold">Profil Saya</h4>
              <p className="text-sm text-gray-600 mt-2">Kelola data pribadi</p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card mt-6">
            <h3 className="text-xl font-semibold mb-4">Aktivitas Terakhir</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Presensi Masuk</p>
                  <p className="text-sm text-gray-600">07:30 - Senin, 15 Jan 2024</p>
                </div>
                <span className="text-green-600 font-semibold">Tepat Waktu</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Presensi Pulang</p>
                  <p className="text-sm text-gray-600">16:15 - Senin, 15 Jan 2024</p>
                </div>
                <span className="text-green-600 font-semibold">Normal</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}