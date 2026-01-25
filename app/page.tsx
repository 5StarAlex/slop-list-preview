import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-10">
      {/* Slop of the Week */}
      <section className="border border-green-600 p-6 rounded-xl">
        <h2 className="text-3xl text-green-400 mb-4">Slop of the Week</h2>
        <Link href="/slop/1">
          <div className="bg-[#123b25] p-6 rounded-lg hover:scale-[1.01] transition">
            <h3 className="text-2xl font-bold">Chainsaw Man</h3>
            <p className="text-green-200 mt-2">
              Studio MAPPA • 12 Episodes • MAL 8.7
            </p>
            <span className="inline-block mt-4 text-sm bg-green-700 px-3 py-1 rounded">
              NEW
            </span>
          </div>
        </Link>
      </section>

      {/* Featured Slop */}
      <section>
        <h2 className="text-2xl text-green-400 mb-4">Featured Slop</h2>
        <div className="grid grid-cols-2 gap-4">
          {["JJK", "Evangelion"].map((title) => (
            <div
              key={title}
              className="border border-green-700 p-4 rounded-lg bg-[#0f2d1d]"
            >
              {title}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
