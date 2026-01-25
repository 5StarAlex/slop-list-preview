export default function Profile() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl text-green-400">Your Profile</h1>

      <div className="flex gap-4 items-center">
        <div className="w-20 h-20 bg-green-700 rounded-full" />
        <div>
          <p className="font-bold">Username</p>
          <p className="text-sm">Slop Streak: 🔥🔥🔥</p>
        </div>
      </div>

      <div className="border border-green-700 p-4 rounded-lg">
        <h2 className="text-xl">Badges</h2>
        <div className="flex gap-3 mt-2">🏅 🧠 🥵</div>
      </div>
    </div>
  );
}
