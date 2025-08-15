import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="p-6">
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">TOCCATA Dashboard</h1>
          <p>Welcome to the main screen of the Toccata system.</p>
        </div>
      </main>
    </>
  );
}
