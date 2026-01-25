import "./globals.css";
import Link from "next/link";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#0b1f14] text-green-100">
        <nav className="flex items-center justify-between px-6 py-4 border-b border-green-700">
          <div className="text-2xl font-bold text-green-400">THE SLOP LIST</div>
          <div className="flex gap-6 text-green-300">
            <Link href="/">Home</Link>
            <Link href="/catalog">Catalog</Link>
            <Link href="/create">Create</Link>
            <Link href="/rules">Slop Rules</Link>
            <Link href="/profile">Profile</Link>
          </div>
        </nav>
        <main className="p-6 max-w-6xl mx-auto">{children}</main>
      </body>
    </html>
  );
}
