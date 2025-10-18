import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";

const SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", captcha: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleCaptcha = (token) => {
    setForm((prev) => ({ ...prev, captcha: token }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("/api/login", form);
      const { role, id_jabatan } = res.data;
      // ✅ Simpan data user ke localStorage
      localStorage.setItem("id_akun", res.data.id_akun);
      localStorage.setItem("username", res.data.username);
      localStorage.setItem("role", res.data.role);


      if (id_jabatan === "SPRADM" || role === "SUPERADMIN") {
        navigate("/dashboard_super_admin");
      } else if (id_jabatan === "ADMIN") {
        navigate("/dashboard_admin");
      } else {
        navigate("/dashboard_user");
      }
    } catch (err) {
      console.error("Error dari server:", err.response?.data);
      setError(
        err.response?.data?.message ||
        "Login gagal atau backend belum berjalan"
      );
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
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="input-field"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="input-field"
            value={form.password}
            onChange={handleChange}
            required
          />

          {/* ✅ Tambahkan CAPTCHA langsung di dalam form */}
          <ReCAPTCHA sitekey={SITE_KEY} onChange={handleCaptcha} />

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
          <p className="text-sm text-gray-500 mt-3">
            Lupa password?{" "}
            <Link
              to="/forgot-password"
              className="text-indigo-600 hover:underline"
            >
              Klik di sini
            </Link>
          </p>
          <p className="text-sm text-gray-600">
            Belum punya akun?{" "}
            <a
              href="/register"
              className="text-indigo-600 hover:underline font-medium"
            >
              Daftar di sini
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
