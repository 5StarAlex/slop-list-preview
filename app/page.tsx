import Image from "next/image";
import Link from "next/link";

<section className="border border-green-600 p-6 rounded-xl">
  <h2 className="text-3xl text-green-400 mb-4">Slop of the Week</h2>
  <Link href="/slop/1">
    <div className="bg-[#123b25] p-6 rounded-lg hover:scale-[1.01] transition">
      {/* Image */}
      <div className="w-full h-60 relative mb-4 rounded overflow-hidden">
        <Image
          src="https://static.wikia.nocookie.net/akibamaidwar/images/9/90/Kv.png/revision/latest/scale-to-width-down/1200?cb=20220818044746"
          alt="Akiba Maid War Key Visual"
          fill
          className="object-cover"
        />
      </div>

      {/* Title and details */}
      <h3 className="text-2xl font-bold">Akiba Maid War</h3>
      <p className="text-green-200 mt-2">
        Studio P.A. Works • 12 Episodes • MAL 7.3
      </p>
      <span className="inline-block mt-4 text-sm bg-green-700 px-3 py-1 rounded">
        NEW
      </span>
    </div>
  </Link>
</section>
