import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function DashboardSuperAdmin() {
  const [showFormAdmin, setShowFormAdmin] = useState(false);
  const navigate = useNavigate();
  const [page, setPage] = useState("home");
  const [perusahaan, setPerusahaan] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ nama_perusahaan: "", alamat: "" });
  const [formAdmin, setFormAdmin] = useState({
    username: "",
    email: "",
    id_perusahaan: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  // Fetch data dari backend
  useEffect(() => {
    if (page === "perusahaan") fetchPerusahaan();
    if (page === "admin") fetchAdmins();
  }, [page]);

  const fetchPerusahaan = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/superadmin/perusahaan");
      setPerusahaan(res.data);
    } catch {
      alert("Gagal memuat data perusahaan");
    } finally {
      setLoading(false);
    }
  };

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/superadmin/admins");
      setAdmins(res.data);
    } catch {
      alert("Gagal memuat data admin");
    } finally {
      setLoading(false);
    }
  };

  const handleSuspend = async (id, status) => {
    try {
      await axios.put(`/api/superadmin/suspend/${id}`, { status });
      fetchPerusahaan();
    } catch {
      alert("Gagal mengubah status perusahaan");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };
  // ----------------------------
  // 💡 CRUD FUNCTION SECTION
  // ----------------------------
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleAddPerusahaan = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/superadmin/perusahaan", form);
      fetchPerusahaan(); // refresh data
      setShowForm(false);
    } catch (err) {
      alert("Gagal menambah perusahaan");
    }
  };

  const handleEdit = (item) => {
    setForm(item);
    setEditMode(true);
    setShowForm(true);
  };

  const handleUpdatePerusahaan = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/superadmin/perusahaan/${form.id_perusahaan}`, form);
      fetchPerusahaan();
      setShowForm(false);
      setEditMode(false);
    } catch (err) {
      alert("Gagal mengedit perusahaan");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus?")) return;
    try {
      await axios.delete(`/api/superadmin/perusahaan/${id}`);
      fetchPerusahaan();
    } catch {
      alert("Gagal menghapus perusahaan");
    }
  };
  const handleChangeAdmin = (e) =>
    setFormAdmin({ ...formAdmin, [e.target.name]: e.target.value });

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    setIsSaving(true); // aktifkan loading
    try {
      const res = await axios.post("/api/superadmin/create-admin", formAdmin);
      alert(res.data.message || "Admin berhasil dibuat");
      setShowFormAdmin(false);
      setFormAdmin({ username: "", email: "", id_perusahaan: "" });
      await fetchAdmins(); // refresh data admin
    } catch (err) {
      console.error("Gagal menambah admin:", err);
      alert(err.response?.data?.message || "Gagal menambah admin");
    } finally {
      setIsSaving(false); // matikan loading
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* HEADER */}
      <header className="bg-indigo-700 text-white shadow p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard Super Admin</h1>
        <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded">
          Logout
        </button>
      </header>

      {/* NAVIGATION */}
      <nav className="bg-white shadow p-4 flex gap-4">
        {["home", "perusahaan", "admin"].map((item) => (
          <button
            key={item}
            onClick={() => setPage(item)}
            className={`px-4 py-2 rounded ${page === item ? "bg-indigo-600 text-white" : "bg-gray-100"
              }`}
          >
            {item.toUpperCase()}
          </button>
        ))}
      </nav>

      {/* MAIN CONTENT */}
      <main className="p-6">
        {/* =======================
            HALAMAN UTAMA
        ======================= */}
        {page === "home" && (
          <section>
            <h2 className="text-xl font-bold mb-4">Ringkasan Sistem</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-6 shadow rounded-lg">
                <p className="text-gray-500">Total Perusahaan</p>
                <p className="text-3xl font-bold text-indigo-600">
                  {perusahaan.length}
                </p>
              </div>
              <div className="bg-white p-6 shadow rounded-lg">
                <p className="text-gray-500">Total Admin</p>
                <p className="text-3xl font-bold text-green-600">
                  {admins.length}
                </p>
              </div>
              <div className="bg-white p-6 shadow rounded-lg">
                <p className="text-gray-500">Akses Aktif</p>
                <p className="text-3xl font-bold text-blue-600">
                  {
                    perusahaan.filter((p) => p.status_aktif === true).length
                  }
                </p>
              </div>
            </div>
          </section>
        )}

        {/* =======================
            MANAJEMEN PERUSAHAAN
        ======================= */}
        {page === "perusahaan" && (
          <section>
            {/* Bagian Header dan Tombol Tambah */}
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-bold">Data Perusahaan</h2>
              <button
                onClick={() => {
                  setEditMode(false);
                  setForm({ nama_perusahaan: "", alamat: "" });
                  setShowForm(true);
                }}
                className="bg-indigo-600 text-white px-4 py-2 rounded"
              >
                + Tambah Perusahaan
              </button>
            </div>

            {/* 🔹 Modal Form Tambah/Edit */}
            {showForm && (
              <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
                  <h3 className="font-bold mb-3">
                    {editMode ? "Edit Perusahaan" : "Tambah Perusahaan"}
                  </h3>
                  <form
                    onSubmit={
                      editMode ? handleUpdatePerusahaan : handleAddPerusahaan
                    }
                    className="space-y-3"
                  >
                    <input
                      name="nama_perusahaan"
                      placeholder="Nama Perusahaan"
                      value={form.nama_perusahaan}
                      onChange={handleChange}
                      className="w-full border p-2 rounded"
                      required
                    />
                    <input
                      name="alamat"
                      placeholder="Alamat"
                      value={form.alamat}
                      onChange={handleChange}
                      className="w-full border p-2 rounded"
                    />

                    <div className="flex justify-end gap-2 mt-4">
                      <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="px-3 py-1 bg-gray-300 rounded"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="px-3 py-1 bg-indigo-600 text-white rounded"
                      >
                        {editMode ? "Update" : "Simpan"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* 🔹 Tabel Data Perusahaan  */}
            {loading ? (
              <p>Memuat data...</p>
            ) : (
              <table className="min-w-full bg-white border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 border">ID</th>
                    <th className="p-2 border">Nama</th>
                    <th className="p-2 border">Alamat</th>
                    <th className="p-2 border">Status</th>
                    <th className="p-2 border">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {perusahaan.filter(p => p.id_perusahaan !== "PRE010") // sembunyikan perusahaan inti
                    .map((p) => (
                      <tr key={p.id_perusahaan}>
                        <td className="border p-2">{p.id_perusahaan}</td>
                        <td className="border p-2">{p.nama_perusahaan}</td>
                        <td className="border p-2">{p.alamat}</td>
                        <td className="border p-2">
                          {p.status_aktif ? "Aktif" : "Nonaktif"}
                        </td>
                        <td className="border p-2 space-x-2">
                          {/* Tombol Edit */}
                          <button
                            onClick={() => handleEdit(p)}
                            className="bg-yellow-500 text-white px-3 py-1 rounded"
                          >
                            Edit
                          </button>

                          {/* Tombol Hapus */}
                          <button
                            onClick={() => handleDelete(p.id_perusahaan)}
                            className="bg-gray-500 text-white px-3 py-1 rounded"
                          >
                            Hapus
                          </button>

                          {/* Tombol Suspend Tetap */}
                          <button
                            onClick={() =>
                              handleSuspend(p.id_perusahaan, !p.status_aktif)
                            }
                            className={`px-3 py-1 rounded ${p.status_aktif
                              ? "bg-red-500 text-white"
                              : "bg-green-500 text-white"
                              }`}
                          >
                            {p.status_aktif ? "Suspend" : "Aktifkan"}
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}
          </section>
        )}


        {/* =======================
            MANAJEMEN ADMIN
        ======================= */}
        {page === "admin" && (
          <section>
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-bold">Data Admin</h2>
              <button
                onClick={() => setShowFormAdmin(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded"
              >
                + Tambah Admin
              </button>
            </div>

            {/* Modal Form Tambah Admin */}
            {showFormAdmin && (
              <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
                  <h3 className="font-bold mb-3">Tambah Admin</h3>
                  <form
                    onSubmit={handleAddAdmin}
                    className="space-y-3"
                  >
                    <input
                      name="username"
                      placeholder="Nama Admin"
                      value={formAdmin.username}
                      onChange={handleChangeAdmin}
                      className="w-full border p-2 rounded"
                      required
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Admin"
                      value={formAdmin.email}
                      onChange={handleChangeAdmin}
                      className="w-full border p-2 rounded"
                      required
                    />
                    <input
                      name="id_perusahaan"
                      placeholder="ID Perusahaan (contoh: PER001)"
                      value={formAdmin.id_perusahaan}
                      onChange={handleChangeAdmin}
                      className="w-full border p-2 rounded"
                      required
                    />

                    <div className="flex justify-end gap-2 mt-4">
                      <button
                        type="button"
                        onClick={() => setShowFormAdmin(false)}
                        disabled={isSaving} // tombol batal juga bisa ikut nonaktif
                        className={`px-3 py-1 rounded ${isSaving ? "bg-gray-300 cursor-not-allowed" : "bg-gray-300"
                          }`}
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        disabled={isSaving} // 🔒 Nonaktif saat loading
                        className={`px-3 py-1 rounded text-white ${isSaving
                          ? "bg-indigo-300 cursor-not-allowed"
                          : "bg-indigo-600 hover:bg-indigo-700"
                          }`}
                      >
                        {isSaving ? "Menyimpan..." : "Simpan"} {/* 🔄 Teks berubah */}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}


            {loading ? (
              <p>Memuat data...</p>
            ) : (
              <table className="min-w-full bg-white border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 border">Nama</th>
                    <th className="p-2 border">Email</th>
                    <th className="p-2 border">Perusahaan</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map((a) => (
                    <tr key={a.id_akun}>
                      <td className="border p-2">{a.username}</td>
                      <td className="border p-2">{a.email}</td>
                      <td className="border p-2">{a.id_perusahaan}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
