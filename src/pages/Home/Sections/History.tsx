import { useEffect, useState } from "react";
import { ref, get } from "firebase/database";
import database from "../../../config/firebase";

type Pemasukan = {
    tanggal: string;
    nominal: number;
    nama: string;
};

export default function History() {
    const [history, setHistory] = useState<Pemasukan[]>([]);
    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(true); // untuk cek login

    useEffect(() => {
        const fetchHistory = async () => {
            const userId = localStorage.getItem("userId");

            if (!userId) {
                setIsLoggedIn(false);
                setLoading(false);
                return;
            }

            try {
                const pemasukanRef = ref(database, "pemasukan");
                const snapshot = await get(pemasukanRef);

                if (snapshot.exists()) {
                    const data: Pemasukan[] = [];

                    snapshot.forEach((child) => {
                        const val = child.val();
                        data.push({
                            tanggal: val.tanggal,
                            nominal: val.nominal,
                            nama: val.nama,
                        });
                    });

                    setHistory(data.reverse());
                }
            } catch (err) {
                console.error("Gagal mengambil data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    return (
        <div className="bg-yellow-500 p-6 rounded-lg shadow-md max-w-xl mx-auto mt-6">
            <h2 className="text-xl font-bold text-white mb-4">Riwayat Pemasukan</h2>

            {loading ? (
                <p className="text-gray-800">Memuat data...</p>
            ) : !isLoggedIn || history.length === 0 ? (
                <p className="text-gray-800">Belum ada data pemasukan.</p>
            ) : (
                <div className="max-h-[400px] overflow-y-auto pr-2 space-y-3">
                    {history.map((item, index) => (
                        <div
                            key={index}
                            className="bg-slate-700 hover:bg-slate-600 transition p-3 rounded-md flex justify-between items-center text-sm text-white"
                        >
                            <div>
                                <p className="font-semibold">{item.nama}</p>
                                <p className="text-gray-300 text-xs">{item.tanggal}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-yellow-400 font-bold">
                                    Rp {item.nominal.toLocaleString("id-ID")}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
