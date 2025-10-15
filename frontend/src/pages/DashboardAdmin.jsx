import React from "react";
import { useNavigate } from "react-router-dom";

export default function DashboardAdmin() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
              <p className="text-gray-600">Manajemen karyawan dan presensi</p>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900">Karyawan Aktif</h3>
              <p className="text-3xl font-bold text-indigo-600 mt-2">45</p>
            </div>
            
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900">Presensi Hari Ini</h3>
              <p className="text-3xl font-bold text-green-600 mt-2">42</p>
            </div>
            
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900">Izin/Cuti</h3>
              <p className="text-3xl font-bold text-yellow-600 mt-2">3</p>
            </div>
          </div>

          <div className="mt-8 card">
            <h3 className="text-xl font-semibold mb-4">Fitur Admin</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 text-left">
                <div className="text-blue-600 font-semibold">👥 Kelola Karyawan</div>
                <div className="text-sm text-gray-600 mt-1">Manajemen data karyawan</div>
              </button>
              
              <button className="p-4 bg-green-50 rounded-lg hover:bg-green-100 text-left">
                <div className="text-green-600 font-semibold">📊 Laporan Presensi</div>
                <div className="text-sm text-gray-600 mt-1">Lihat laporan kehadiran</div>
              </button>
              
              <button className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 text-left">
                <div className="text-purple-600 font-semibold">✅ Verifikasi Izin</div>
                <div className="text-sm text-gray-600 mt-1">Persetujuan cuti & izin</div>
              </button>
              
              <button className="p-4 bg-orange-50 rounded-lg hover:bg-orange-100 text-left">
                <div className="text-orange-600 font-semibold">⚙️ Pengaturan</div>
                <div className="text-sm text-gray-600 mt-1">Konfigurasi sistem</div>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}