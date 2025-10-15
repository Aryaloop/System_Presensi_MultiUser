import React from "react";
import { useNavigate } from "react-router-dom";

export default function DashboardSuperAdmin() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear session/token here
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard Super Admin</h1>
              <p className="text-gray-600">Manajemen sistem lengkap</p>
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Stats Cards */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900">Total Pengguna</h3>
              <p className="text-3xl font-bold text-indigo-600 mt-2">150</p>
            </div>
            
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900">Total Perusahaan</h3>
              <p className="text-3xl font-bold text-green-600 mt-2">12</p>
            </div>
            
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900">Presensi Hari Ini</h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">89</p>
            </div>
          </div>

          {/* Management Section */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="text-xl font-semibold mb-4">Manajemen Pengguna</h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                  📊 Lihat Semua Pengguna
                </button>
                <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                  ➕ Tambah Pengguna Manual
                </button>
                <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                  ⚙️ Pengaturan Sistem
                </button>
              </div>
            </div>

            <div className="card">
              <h3 className="text-xl font-semibold mb-4">Laporan & Analytics</h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                  📈 Laporan Presensi
                </button>
                <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                  🔍 Audit Sistem
                </button>
                <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                  📋 Backup Data
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}