import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("/api/login", form);

      console.log("=== [DEBUG FRONTEND LOGIN] ===");
      console.log("Email:", form.email);
      console.log("Response dari server:", res.data);
      console.log("===============================");

      const { role, id_jabatan } = res.data;

      if (id_jabatan === "SPRADM" || role === "SUPERADMIN") {
        navigate("/dashboard_super_admin");
      } else if (id_jabatan === "ADMIN") {
        navigate("/dashboard_admin");
      } else {
        navigate("/dashboard_user");
      }
    } catch (err) {
      console.error("Error dari server:", err.response?.data);
      setError(err.response?.data?.message || "Login gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-indigo-700">
      <div className="bg-white shadow-lg rounded-xl p-8 w-96">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-indigo-600">Sistem Presensi</h2>
          <p className="text-gray-600 mt-2">Masuk ke akun Anda</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="input-field"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="input-field"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Memproses..." : "Login"}
          </button>
        </form>
        
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm text-center">{error}</p>
          </div>
        )}
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Belum punya akun?{" "}
            <a href="/register" className="text-indigo-600 hover:underline font-medium">
              Daftar di sini
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}