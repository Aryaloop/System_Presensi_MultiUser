// ForgotPassword.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";

// Ambil SITE KEY dari .env
const SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [captchaToken, setCaptchaToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!captchaToken) {
      setMessage("Harap verifikasi reCAPTCHA terlebih dahulu.");
      return;
    }

    setLoading(true);
    try {
      // Kirim email + token captcha ke backend
      const res = await axios.post("/api/forgot-password", {
        email,
        captcha: captchaToken,
      });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-indigo-600">
      <div className="bg-white shadow-xl rounded-xl p-8 w-96 text-center">
        <h2 className="text-2xl font-bold text-indigo-600 mb-4">Lupa Password</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Masukkan email terdaftar"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* ✅ Tambahkan reCAPTCHA di sini */}
          <div className="flex justify-center">
            <ReCAPTCHA
              sitekey={SITE_KEY}
              onChange={(token) => setCaptchaToken(token)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary disabled:opacity-50"
          >
            {loading ? "Mengirim..." : "Kirim Tautan Reset"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-gray-700 text-sm font-medium">{message}</p>
        )}
        <p className="text-sm text-gray-600">
          Sudah punya akun?{" "}
          <a href="/login" className="text-indigo-600 hover:underline font-medium">
            Login di sini
          </a>
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
  );
}
