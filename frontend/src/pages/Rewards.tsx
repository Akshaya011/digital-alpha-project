function Rewards() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Rewards
        </h1>
        <p className="text-slate-500">
          Earn coins when you pay your bills
        </p>
      </div>

      {/* Balance */}
      <div className="rounded-xl bg-slate-900 p-8 text-white">
        <p className="text-sm text-slate-400">
          Available Reward Coins
        </p>

        <h2 className="mt-2 text-4xl font-bold">
          2,450 🪙
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          Keep paying your bills to earn more coins.
        </p>
      </div>

      {/* Reward Activity */}
      <div className="rounded-xl bg-white shadow-sm">
        <div className="border-b p-5">
          <h2 className="font-semibold text-slate-900">
            Reward Activity
          </h2>
        </div>

        <div className="divide-y">
          <Reward
            title="Credit Card Bill Payment"
            coins="+120"
          />

          <Reward
            title="Shopping Payment"
            coins="+45"
          />

          <Reward
            title="Food & Dining"
            coins="+14"
          />

          <Reward
            title="Travel Payment"
            coins="+80"
          />
        </div>
      </div>
    </div>
  );
}

function Reward({
  title,
  coins,
}: {
  title: string;
  coins: string;
}) {
  return (
    <div className="flex items-center justify-between p-5">
      <div>
        <p className="font-medium text-slate-900">
          {title}
        </p>

        <p className="text-sm text-slate-500">
          Reward earned
        </p>
      </div>

      <p className="font-semibold text-green-600">
        {coins} 🪙
      </p>
    </div>
  );
}

export default Rewards;