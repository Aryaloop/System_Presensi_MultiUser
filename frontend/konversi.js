// reset_simple.js
// Jalankan: node reset_simple.js
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const SALT_ROUNDS = 10;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("ERROR: Pastikan SUPABASE_URL dan SUPABASE_KEY ada di file .env");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// --- Isi daftar email dan password baru di sini ---
const updates = [
//   { email: "kitapresensi@gmail.com", newPassword: "superadmin123" },
  { email: "admin@gmail.com", newPassword: "admin123" },
  { email: "user@gmail.com", newPassword: "user123" }
];
// ---------------------------------------------------

(async () => {
  try {
    for (const item of updates) {
      const email = (item.email || "").trim();
      const newPassword = item.newPassword?.toString() ?? "";

      if (!email || !newPassword) {
        console.warn("Skip entry karena format salah:", item);
        continue;
      }

      // buat hash
      const hash = await bcrypt.hash(newPassword, SALT_ROUNDS);

      // update langsung ke Supabase
      const { data, error } = await supabase
        .from("akun")
        .update({ password: hash })
        .eq("email", email)
        .select("id_akun, email");

      if (error) {
        console.error(`Gagal update ${email}:`, error.message || error);
      } else if (!data || data.length === 0) {
        console.warn(`Email tidak ditemukan: ${email}`);
      } else {
        console.log(`Berhasil update password untuk: ${email} (id: ${data[0].id_akun})`);
      }
    }

    console.log("\nSelesai.");
  } catch (err) {
    console.error("Terjadi error:", err.message || err);
    process.exit(1);
  }
})();
