import { useEffect, useState } from "react";
import { getDatabase, ref, push, get, set, runTransaction } from "firebase/database";
import { toast } from "react-toastify";
import database from "../../../config/firebase";

export default function Modal({ onClose }: { onClose: () => void }) {
    const [show, setShow] = useState(false);
    const [tanggal, setTanggal] = useState("");
    const [nominal, setNominal] = useState(""); 
    const [rawNominal, setRawNominal] = useState(0);
    useEffect(() => {
        const timeout = setTimeout(() => setShow(true), 10);
        return () => clearTimeout(timeout);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        try {
            const db = database;
            const userId = localStorage.getItem("userId");
    
            if (!userId) {
                toast.error("User tidak ditemukan di session.");
                return;
            }
    
            const userSnap = await get(ref(db, `users/${userId}`));
            if (!userSnap.exists()) {
                toast.error("Data user tidak ditemukan.");
                return;
            }
    
            const userData = userSnap.val();
            const namaUser = userData.name || "Tanpa Nama";
    
            // Simpan pemasukan baru
            const pemasukanRef = ref(db, "pemasukan");
            await push(pemasukanRef, {
                tanggal,
                nominal: rawNominal, // disimpan sebagai angka
                userId,
                nama: namaUser,
            });
    
            // Update totalTabungan secara aman (tanpa race condition)
            const tabunganRef = ref(db, `totalTabungan`);
    
            await runTransaction(tabunganRef, (currentTotal) => {
                const updatedTotal = (currentTotal || 0) + rawNominal;
                console.log("Total Tabungan Diperbarui:", updatedTotal);
                return updatedTotal;
            });
    
            alert("Pemasukan berhasil disimpan!");
    
            // Reset form dan tutup modal
            setTanggal("");
            setNominal("");
            setRawNominal(0);
            onClose();
    
            window.location.reload();
        } catch (err) {
            console.error("Gagal menyimpan pemasukan:", err);
            toast.error("Terjadi kesalahan saat menyimpan data.");
        }
    };
    

    return (
        <div className="fixed inset-0 flex items-start justify-center bg-black bg-opacity-50 z-50 p-4 pt-20">
            <div
                className={`bg-yellow-50 p-6 rounded-lg shadow-lg max-w-md w-full border border-yellow-200 transition-all duration-300 ease-out ${show ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-5 scale-95"}`}
            >
                <h2 className="text-xl font-bold mb-4 text-yellow-900">Tambah Data</h2>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="tanggal" className="block text-sm font-medium text-yellow-900 mb-1">
                            Tanggal
                        </label>
                        <input
                            type="date"
                            id="tanggal"
                            name="tanggal"
                            value={tanggal}
                            onChange={(e) => setTanggal(e.target.value)}
                            className="w-full border border-yellow-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-gray-800"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="nominal" className="block text-sm font-medium text-yellow-900 mb-1">
                            Nominal
                        </label>
                        <input
                            type="text"
                            id="nominal"
                            name="nominal"
                            value={nominal}
                            placeholder="Masukkan nominal"
                            onChange={(e) => {
                                const raw = e.target.value.replace(/[^0-9]/g, ""); // hapus semua selain angka
                                const formatted = new Intl.NumberFormat("id-ID").format(Number(raw));
                                setNominal(formatted);
                                setRawNominal(Number(raw));
                            }}
                            className="w-full border border-yellow-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-gray-800"
                            required
                        />
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                        <button
                            type="button"
                            className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                            onClick={onClose}
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-600 font-bold"
                        >
                            Simpan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
