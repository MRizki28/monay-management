import { useEffect, useState } from "react";
import { getDatabase, ref, get, update } from "firebase/database";
import { v4 as uuidv4 } from "uuid";
import database from "../../../config/firebase";

export default function ModalAuth({ onClose }: { onClose: () => void }) {
    const [show, setShow] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const timeout = setTimeout(() => setShow(true), 10);
        return () => clearTimeout(timeout);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
    
        try {
            const db = database;
            const snapshot = await get(ref(db, "users"));
    
            if (snapshot.exists()) {
                const users = snapshot.val();
    
                // Log seluruh data dari database untuk verifikasi
                console.log("Data semua users:", users);
                console.log("Email input:", email);
                console.log("Password input:", password);
    
                // Cari user berdasarkan email
                const matchedUserEntry = Object.entries(users).find(
                    ([_, user]: any) => user.email.trim() === email.trim()
                );
    
                if (!matchedUserEntry) {
                    console.error("Email tidak ditemukan:", email);
                    setError("Email tidak ditemukan.");
                    return;
                }
    
                const [userId, userData]: [string, any] = matchedUserEntry;
    
                console.log("User ditemukan:", userData);
    
                // Cek password
                const dbPassword = String(userData.password).trim();
                const inputPassword = password.trim();
    
                console.log("Password dari DB:", dbPassword);
                console.log("Password input:", inputPassword);
    
                if (dbPassword !== inputPassword) {
                    console.error("Password salah.");
                    setError("Password salah.");
                    return;
                }
    
                // Jika email dan password cocok
                const sessionToken = uuidv4();
    
                // Simpan session ke database
                await update(ref(db, `users/${userId}`), {
                    session: sessionToken,
                });
    
                // Simpan ke localStorage
                localStorage.setItem("session", sessionToken);
                localStorage.setItem("userId", userId);
    
                alert("Login berhasil!");
                window.location.reload();
                onClose();

            } else {
                console.error("Database kosong.");
                setError("Tidak ada data user.");
            }
        } catch (err: any) {
            console.error("Login error:", err);
            setError("Terjadi kesalahan saat login.");
        } finally {
            setLoading(false);
        }
    };
    
    

    return (
        <div className="fixed inset-0 flex items-start justify-center bg-black bg-opacity-50 z-50 p-4 pt-20">
            <div
                className={`
                    bg-yellow-50 p-6 rounded-lg shadow-lg max-w-md w-full border border-yellow-200 
                    transition-all duration-300 ease-out 
                    ${show ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-5 scale-95"}
                `}
            >
                <h2 className="text-xl font-bold mb-4 text-yellow-900">Login</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-yellow-900 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border border-yellow-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-yellow-900 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border border-yellow-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            required
                        />
                    </div>

                    {error && <p className="text-red-600 text-sm">{error}</p>}

                    <div className="flex justify-end space-x-2 pt-4">
                        <button
                            type="button"
                            className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-600 font-bold"
                            disabled={loading}
                        >
                            {loading ? "Menyimpan..." : "Simpan"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
