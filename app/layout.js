import "./globals.css";
import Navbar from "@/components/Navbar";
import SystemTerminal from "@/components/SystemTerminal";

export const metadata = {
  title: "Toccata",
  description: "Toccata web SPA",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="pb-20">
        <Navbar />
        <main className="p-6">{children}</main>
        <SystemTerminal />
      </body>
    </html>
  );
}
