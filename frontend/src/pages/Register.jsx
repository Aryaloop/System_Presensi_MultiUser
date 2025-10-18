// src/pages/Register.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    id_jabatan: "USER",
    id_perusahaan: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword)
      return setError("Password dan konfirmasi password tidak cocok");
    if (form.password.length < 6)
      return setError("Password minimal 6 karakter");

    setLoading(true);
    try {
      const { confirmPassword, ...submitData } = form;
      const res = await axios.post("/api/register", submitData);
      console.log("✅ Registrasi sukses:", res.data);

      // ✅ tampilkan UI sukses (tanpa alert)
      setSuccess(true);
      setTimeout(() => navigate("/login"), 3000); // auto redirect ke login
    } catch (err) {
      console.error("❌ Error registrasi:", err.response?.data);
      setError(err.response?.data?.message || "Registrasi gagal backend belum jalan");
    } finally {
      setLoading(false);
    }
  };

  // ✅ tampilkan halaman sukses 
  if (success) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-500 to-blue-600">
        <div className="bg-white shadow-xl rounded-xl p-8 w-96 text-center">
          <h2 className="text-2xl font-bold text-indigo-600 mb-4">Registrasi Berhasil</h2>
          <p className="text-gray-700">
            ✅ Akun kamu berhasil dibuat. Kamu akan diarahkan ke halaman login dalam beberapa detik...
          </p>
        </div>
      </div>
    );
  }

  // ⬇️ tampilan form register biasa
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-500 to-blue-600">
      <div className="bg-white shadow-lg rounded-xl p-8 w-96">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-indigo-600">Daftar Akun Baru</h2>
          <p className="text-gray-600 mt-2">Isi form berikut untuk mendaftar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="username" placeholder="Nama Lengkap" className="input-field" value={form.username} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" className="input-field" value={form.email} onChange={handleChange} required />
          <input type="text" name="id_perusahaan" placeholder="ID Perusahaan (misal: PER001)" className="input-field" value={form.id_perusahaan} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" className="input-field" value={form.password} onChange={handleChange} required />
          <input type="password" name="confirmPassword" placeholder="Konfirmasi Password" className="input-field" value={form.confirmPassword} onChange={handleChange} required />
          <button type="submit" disabled={loading} className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? "Mendaftarkan..." : "Daftar"}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm text-center">{error}</p>
          </div>
        )}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Sudah punya akun?{" "}
            <a href="/login" className="text-indigo-600 hover:underline font-medium">
              Login di sini
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
