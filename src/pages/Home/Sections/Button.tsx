import { ListFilterPlus } from "lucide-react";
import { useState } from "react";
import Modal from "./Modal";

export default function Button() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const session = localStorage.getItem("session");
    const isLogin = !!session;

    if (!isLogin) {
        return (
            <div className="mt-4 p-4 bg-yellow-100 border border-yellow-300 rounded-lg text-sm text-yellow-800 max-w-xl mx-auto text-center">
                Tidak ada aksi yang dapat dilakukan. Silakan login terlebih dahulu.
            </div>
        );
    }

    return (
        <div className="flex flex-wrap items-center justify-between mt-4 gap-2">
            {/* Kiri: tombol Pemasukan & Pengeluaran */}
            <div className="flex flex-wrap gap-2">
                <button
                    className="bg-yellow-500 text-black text-xs md:text-sm font-bold px-4 md:px-6 py-2 md:py-3 rounded-lg border border-black
                       shadow-[3px_3px_0_0_#ffffff]
                       hover:shadow-[1px_1px_0_0_#ffffff]
                       hover:translate-y-0.5
                       active:shadow-[2px_2px_0_0_#ffffff] active:scale-95
                       transform transition-all duration-100"
                    onClick={() => setIsModalOpen(true)}
                >
                    + Pemasukan
                </button>

                <button
                    className="bg-red-500 text-black text-xs md:text-sm font-bold px-4 md:px-6 py-2 md:py-3 rounded-lg border border-black
                       shadow-[3px_3px_0_0_#ffffff]
                       hover:shadow-[1px_1px_0_0_#ffffff]
                       hover:translate-y-0.5
                       active:shadow-[2px_2px_0_0_#ffffff] active:scale-95
                       transform transition-all duration-100"
                >
                    + Pengeluaran
                </button>
            </div>

            {/* Kanan: tombol Filter */}
            <button
                className="bg-red-500 text-black text-xs md:text-sm font-bold px-4 md:px-6 py-2 md:py-3 rounded-lg border border-black
                     shadow-[3px_3px_0_0_#ffffff]
                     hover:shadow-[1px_1px_0_0_#ffffff]
                     hover:translate-y-0.5
                     active:shadow-[2px_2px_0_0_#ffffff] active:scale-95
                     transform transition-all duration-100 flex items-center justify-center"
            >
                <ListFilterPlus size={18} className="md:size-5" />
            </button>

            {/* Modal */}
            {isModalOpen && <Modal onClose={() => setIsModalOpen(false)} />}
        </div>
    );
}
