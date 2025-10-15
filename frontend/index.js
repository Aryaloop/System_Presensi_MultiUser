// index.js
import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ======================================================
// CLASS: DatabaseService → koneksi & query ke Supabase
// ======================================================
class DatabaseService {
  constructor() {
    this.client = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
  }

  async insertAkun(payload) {
    return await this.client.from("akun").insert(payload).select();
  }

  async findAkunByEmail(email) {
    return await this.client.from("akun").select("*").eq("email", email).single();
  }

  async findAkunById(id) {
    return await this.client.from("akun").select("*").eq("id_akun", id).single();
  }

  async countAkun() {
    return await this.client.from("akun").select("*", { count: "exact", head: true });
  }
}

const db = new DatabaseService();
const PORT = process.env.PORT || 3001;
const saltRounds = 10;

// ======================================================
// CLASS: AuthController → handle route logic
// ======================================================
class AuthController {
  async register(req, res) {
    try {
      const { username, email, password, id_jabatan, id_perusahaan } = req.body;

      if (!username || !email || !password || !id_jabatan || !id_perusahaan)
        return res.status(400).json({ message: "Lengkapi semua field" });

      const { data: existing } = await db.findAkunByEmail(email);
      if (existing) return res.status(409).json({ message: "Email sudah terdaftar" });

      const hashed = await bcrypt.hash(password, saltRounds);
      const payload = {
        id_akun: uuidv4(),
        username,
        email,
        password: hashed,
        id_jabatan,
        id_perusahaan,
        created_at: new Date(),
      };

      const { data, error } = await db.insertAkun(payload);
      if (error) throw error;

      res.status(201).json({ message: "Registrasi berhasil", data });
    } catch (err) {
      console.error("Register Error:", err);
      res.status(500).json({ message: "Terjadi kesalahan server" });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const { data: akun, error } = await db.findAkunByEmail(email);

      if (error || !akun) return res.status(401).json({ message: "Email tidak terdaftar" });

      const valid = await bcrypt.compare(password, akun.password);
      if (!valid) return res.status(401).json({ message: "Password salah" });

      res.json({
        message: "Login berhasil",
        id_akun: akun.id_akun,
        id_jabatan: akun.id_jabatan,
        username: akun.username,
        role:
          akun.id_jabatan === "SPRADM"
            ? "SUPERADMIN"
            : akun.id_jabatan === "ADMIN"
            ? "ADMIN"
            : "USER",
      });
    } catch (err) {
      console.error("Login Error:", err);
      res.status(500).json({ message: "Terjadi kesalahan server" });
    }
  }

  async getUser(req, res) {
    try {
      const { id } = req.params;
      const { data: user, error } = await db.findAkunById(id);
      if (error || !user) return res.status(404).json({ message: "User tidak ditemukan" });
      res.json(user);
    } catch (err) {
      res.status(500).json({ message: "Terjadi kesalahan server" });
    }
  }

  async health(req, res) {
    try {
      const { count, error } = await db.countAkun();
      if (error) throw error;
      res.json({
        status: "OK",
        message: "Server berjalan normal",
        supabase_connected: true,
        total_users: count,
      });
    } catch (err) {
      res.status(500).json({
        status: "ERROR",
        message: "Koneksi database bermasalah",
        supabase_connected: false,
      });
    }
  }
}

const auth = new AuthController();

// ======================================================
//  ROUTING API
// ======================================================
app.post("/api/register", (req, res) => auth.register(req, res));
app.post("/api/login", (req, res) => auth.login(req, res));
app.get("/api/user/:id", (req, res) => auth.getUser(req, res));
app.get("/api/health", (req, res) => auth.health(req, res));

// ======================================================
// 🌐 START SERVER
// ======================================================
(async () => {
  try {
    const { count } = await db.countAkun();
    console.log(`✅ Supabase terkoneksi. Jumlah akun terdaftar: ${count}`);
  } catch {
    console.error("❌ Gagal konek ke Supabase");
  }
})();

app.listen(PORT, () => {
  console.log(`✅ Backend berjalan di http://localhost:${PORT}`);
});
