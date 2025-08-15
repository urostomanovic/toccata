import "./globals.css";

export const metadata = {
  title: "Toccata",
  description: "Toccata web SPA",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
