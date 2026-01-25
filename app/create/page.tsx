export default function Create() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl text-green-400">Create Slop</h1>

      <div className="border border-green-700 p-4 rounded-lg">
        <h2 className="text-xl mb-2">Weekly Tier List</h2>
        <div className="bg-[#102a1c] p-4 rounded">
          Drag slop here (demo)
        </div>
      </div>

      <div className="border border-green-700 p-4 rounded-lg">
        <h2 className="text-xl mb-2">Suggest Slop</h2>
        <input
          placeholder="Anime title..."
          className="w-full p-2 bg-[#0b1f14] border border-green-600 rounded"
        />
      </div>
    </div>
  );
}
