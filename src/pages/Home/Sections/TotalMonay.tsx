import { Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { getDatabase, ref, get, query, orderByChild, equalTo } from "firebase/database";
import database from "../../../config/firebase";

export default function TotalMonay() {
    const session = localStorage.getItem("session");
    const isLogin = !!session;

    const [total, setTotal] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isLogin) {
            setLoading(true);
            const db = database;
            const dataRef = ref(db, "totalTabungan");
            get(dataRef).then((snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    const firstKey = Object.keys(data)[0];
                    const dataTotal = data[firstKey];
                    setTotal(dataTotal);
                } else {
                    setTotal(0);
                }
                setLoading(false);
            })
        }
    }, [session]);

    if (!isLogin) {
        return (
            <div className="text-gray-800 p-5 rounded-lg shadow-md max-w-xl mx-auto bg-yellow-500 mt-5">
                <h2 className="text-xl font-bold mb-4">Total Tabungan Bersama</h2>
                <p className="text-center text-gray-700">Silakan login untuk melihat total tabungan.</p>
            </div>
        );
    }

    return (
        <div className="text-gray-800 p-5 rounded-lg shadow-md max-w-xl mx-auto bg-yellow-500 mt-5">
            <h2 className="text-xl font-bold mb-4">Total Tabungan Bersama</h2>
            <div className="flex items-center justify-between">
                {loading ? (
                    <span className="text-yellow-900 text-lg">Loading...</span>
                ) : (
                    <span className="text-2xl font-bold text-yellow-900">
                        Rp {total?.toLocaleString("id-ID") || "0"}
                    </span>
                )}
                <Wallet size={24} className="text-yellow-900" />
            </div>
        </div>
    );
}
