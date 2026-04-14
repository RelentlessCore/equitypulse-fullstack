import { getUserWatchlist } from "@/lib/actions/watchlist.actions";
import WatchlistButton from "@/components/WatchlistButton";
import Link from "next/link";
import { TrendingUp } from "lucide-react";

const WatchlistPage = async () => {
  const watchlist = await getUserWatchlist();

  return (
    <div className="min-h-screen home-wrapper">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-gray-100">My Watchlist</h1>
        <p className="text-gray-500 text-sm">
          {watchlist.length} stock{watchlist.length !== 1 ? "s" : ""}
        </p>
      </div>

      {watchlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <TrendingUp className="w-16 h-16 text-gray-600" />
          <h2 className="text-xl font-medium text-gray-400">
            Your watchlist is empty
          </h2>
          <p className="text-gray-500 text-sm text-center max-w-md">
            Search for stocks and click "Add to Watchlist" to track your
            favorite stocks here.
          </p>
          <Link href="/" className="yellow-btn mt-2">
            Browse Stocks
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {watchlist.map((item) => (
            <div
              key={item.symbol}
              className="flex items-center justify-between p-4 rounded-lg bg-gray-800/50 border border-gray-700 hover:border-gray-600 transition-colors"
            >
              <Link
                href={`/stocks/${item.symbol}`}
                className="flex items-center gap-4 flex-1"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-yellow-500/10 text-yellow-500 font-bold text-sm">
                  {item.symbol.slice(0, 2)}
                </div>
                <div>
                  <p className="text-gray-100 font-medium">{item.symbol}</p>
                  <p className="text-gray-500 text-sm">{item.company}</p>
                </div>
              </Link>
              <div className="flex items-center gap-4">
                {item.addedAt && (
                  <p className="text-gray-600 text-xs hidden md:block">
                    Added {new Date(item.addedAt).toLocaleDateString()}
                  </p>
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
