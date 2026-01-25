import Image from "next/image";
import Link from "next/link";
import SlopEmojiMeter from "./components/SlopEmojiMeter";

export default function Home() {
  return (
    <div className="space-y-10">
      {/* Slop of the Week */}
      <section className="border border-green-600 p-6 rounded-xl">
        <h2 className="text-3xl text-green-400 mb-4">Slop of the Week</h2>
        <div className="bg-[#123b25] p-6 rounded-lg">
          <div className="w-full h-60 relative mb-4 rounded overflow-hidden">
            <Image
              src="https://static.wikia.nocookie.net/akibamaidwar/images/9/90/Kv.png/revision/latest/scale-to-width-down/1200?cb=20220818044746"
              alt="Akiba Maid War Key Visual"
              fill
              className="object-cover"
            />
          </div>

          <h3 className="text-2xl font-bold text-green-100 mb-2">Akiba Maid War</h3>

          {/* Emoji Meter */}
          <SlopEmojiMeter
            description="The chaos of Akihabara maids in action!"
            episodes={12}
            studio="P.A. Works"
            malRating={7.3}
          />
        </div>
      </section>

      {/* Featured Slop (Optional: add emoji meters here too) */}
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
