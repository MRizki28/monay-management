import { Banknote, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import ModalAuth from "../../pages/Home/Sections/ModalAuth";
import { ref, get, orderByChild, query, equalTo } from "firebase/database";
import database from "../../config/firebase";

export default function Header() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [name, setName] = useState<string>("Loading...");

    const session = localStorage.getItem("session");
    const isLogin = session !== null;

    useEffect(() => {
        if (session) {
            const db = database;
            const userQuery = query(ref(db, "users"), orderByChild("session"), equalTo(session));

            console.log("Fetching user with session:", session);
            get(userQuery)
                .then((snapshot) => {
                    if(snapshot.exists()){
                        const data = snapshot.val();
                        const userKey = Object.keys(data)[0]; 
                        const userData = data[userKey];
                        setName(userData.name );
                    }
                })
                .catch((error) => {
                    console.error("Error fetching user:", error);
                });
        }
    }, [session]);

    return (
        <header className="text-gray-800 p-4 flex items-center justify-between bg-yellow-500 rounded-md">
            <Banknote size={30} />

            {isLogin ? (
                <h1 className="text-xl font-bold">{name}</h1>
            ) : (
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="text-gray-800 font-bold px-4 py-2 rounded"
                >
                    Login
                </button>
            )}

            {isLogin && (
                <button
                    onClick={() => {
                        localStorage.clear();
                        window.location.reload();
                    }}
                    className="text-gray-800 px-4 py-2 rounded"
                    title="Logout"
                >
                    <LogOut size={20} />
                </button>
            )}

            {isModalOpen && <ModalAuth onClose={() => setIsModalOpen(false)} />}
        </header>
    );
}
