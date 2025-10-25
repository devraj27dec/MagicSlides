import Header from "./components/Header";
import Mails from "./components/Mails";


export default function Home() {
  return (
    <div className=" px-10 py-6 min-h-screen">
      <Header />

      <Mails/>
    </div>
  );
}
