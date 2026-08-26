import { useEffect, useState } from "react";
import {
  getRewards,
  redeemReward,
  type RewardOption,
} from "../services/api";

function Rewards() {
  const [balance, setBalance] = useState(0);
  const [rewards, setRewards] = useState<RewardOption[]>([]);
  const [selectedReward, setSelectedReward] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(false);

  useEffect(() => {
    getRewards()
      .then((response) => {
        setBalance(response.balance);
        setRewards(response.rewards);
      })
      .catch(() => setError("Could not load rewards."))
      .finally(() => setLoading(false));
  }, []);

  const selected = rewards.find((reward) => reward.name === selectedReward);

  const handleRedeem = async () => {
    if (!selected) return;
    setRedeeming(true);
    setMessage("");
    setError("");

    try {
      const response = await redeemReward(selected.name);
      setBalance(response.balance);
      setMessage(`${response.reward_name} redeemed successfully.`);
      setSelectedReward("");
    } catch {
      setError("Redemption failed. Check your coin balance and try again.");
    } finally {
      setRedeeming(false);
    }
  };

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
          {loading ? "..." : balance.toLocaleString()} 🪙
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          Keep paying your bills to earn more coins.
        </p>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-slate-900">Redeem your coins</h2>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <select
            value={selectedReward}
            onChange={(event) => setSelectedReward(event.target.value)}
            aria-label="Select a reward"
            className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm"
            disabled={loading || redeeming}
          >
            <option value="">Select a reward</option>
            {rewards.map((reward) => (
              <option key={reward.name} value={reward.name}>
                {reward.name} ({reward.coins} coins)
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleRedeem}
            disabled={!selected || redeeming || balance < (selected?.coins ?? 0)}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {redeeming ? "Redeeming..." : "Redeem"}
          </button>
        </div>
        {selected && balance < selected.coins && (
          <p className="mt-3 text-sm text-red-600">You do not have enough coins for this reward.</p>
        )}
        {message && <p className="mt-3 text-sm text-green-600">{message}</p>}
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
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