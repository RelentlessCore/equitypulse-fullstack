import { getUserWatchlist } from "@/lib/actions/watchlist.actions";
import WatchlistButton from "@/components/WatchlistButton";
import Link from "next/link";
import { TrendingUp, Star } from "lucide-react";

const WatchlistPage = async () => {
  const watchlist = await getUserWatchlist();

  return (
    <div className="min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-100">My Watchlist</h1>
          <p className="text-gray-500 text-sm mt-1">
            Track your favorite stocks and get personalized daily summaries
          </p>
        </div>
        <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-4 py-2">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          <span className="text-yellow-500 font-semibold text-sm">
            {watchlist.length} stock{watchlist.length !== 1 ? "s" : ""} tracked
          </span>
        </div>
      </div>

      {watchlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-6 border border-gray-800 rounded-2xl bg-gray-900/30">
          <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center">
            <TrendingUp className="w-10 h-10 text-gray-600" />
          </div>
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-300 mb-2">
              Your watchlist is empty
            </h2>
            <p className="text-gray-500 text-sm max-w-sm">
              Search for stocks and click "Add to Watchlist" to start tracking
              your favorite companies here.
            </p>
          </div>
          <Link
            href="/"
            className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-6 py-2.5 rounded-lg transition-colors"
          >
            Browse Dashboard
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {watchlist.map((item) => (
            <div
              key={item.symbol}
              className="flex items-center justify-between p-5 rounded-xl bg-gray-900/50 border border-gray-800 hover:border-gray-700 hover:bg-gray-900/80 transition-all duration-200"
            >
              <Link
                href={`/stocks/${item.symbol}`}
                className="flex items-center gap-4 flex-1 min-w-0"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 font-bold text-sm shrink-0">
                  {item.symbol.slice(0, 2)}
                </div>
                <div className="min-w-0">
                  <p className="text-gray-100 font-semibold text-base truncate">
                    {item.company !== item.symbol ? item.company : item.symbol}
                  </p>
                  <p className="text-yellow-500/80 text-sm font-medium">
                    {item.symbol}
                  </p>
                </div>
              </Link>

              <div className="flex items-center gap-6 shrink-0">
                {item.addedAt && (
                  <div className="hidden md:flex flex-col items-end">
                    <p className="text-gray-600 text-xs">Added</p>
                    <p className="text-gray-500 text-xs">
                      {new Date(item.addedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                )}
                <WatchlistButton
                  symbol={item.symbol}
                  company={item.company}
                  isInWatchlist={true}
                  showTrashIcon={true}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WatchlistPage;
