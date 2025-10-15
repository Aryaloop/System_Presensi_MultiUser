// cek_hash_supabase.js
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

// Konfigurasi Supabase dari .env
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// === Konfigurasi akun yang mau dicek ===
const email = "admin@gmail.com";  // email target
const plainPassword = "admin123";   // password input user

(async () => {
  try {
    console.log("🔍 Mengecek hash password untuk:", email);

    // Ambil data user dari tabel akun
    const { data: akun, error } = await supabase
      .from("akun")
      .select("email, password")
      .eq("email", email)
      .single();

    if (error || !akun) {
      console.error("❌ Akun tidak ditemukan atau query error:", error?.message);
      return;
    }

    console.log("📦 Data dari DB:");
    console.log("Email:", akun.email);
    console.log("Hash:", akun.password);

    // Bandingkan password plaintext dengan hash dari DB
    const cocok = await bcrypt.compare(plainPassword, akun.password);
    console.log("\n✅ Password cocok?", cocok);

    if (!cocok) {
      console.log("❌ Password salah atau hash tidak sesuai.");
    }
  } catch (err) {
    console.error("⚠️ Terjadi error:", err.message);
  }
})();
