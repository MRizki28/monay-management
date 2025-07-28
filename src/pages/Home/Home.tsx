import Header from "../../components/Shared/Header";
import Button from "./Sections/Button";
import History from "./Sections/History";
import Modal from "./Sections/Modal";
import TotalMonay from "./Sections/TotalMonay";

export default function Home() {
    return (
        <div className="bg-slate-800 p-6 rounded-lg shadow-md max-w-xl mx-auto min-h-screen relative">
            <Header></Header>
            <TotalMonay></TotalMonay>
            <Button></Button>
            <History></History>
        </div>
    )
}