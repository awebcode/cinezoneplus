// components/Watchlist.tsx

import React from "react"
import { auth } from "@/auth"
import { tmdbImage } from "@/tmdb/utils"

import WatchListButton from "./RemoveWatchlistBtn"
import { getWatchlist, removeWatchlist } from "./actions"

const Watchlist: React.FC = async () => {
  const user = await auth()
  const watchlist = await getWatchlist(user?.user?.id as string)

  const handleRemove = async (movieId: number) => {
    "use server"
    await removeWatchlist(movieId)
    // Optionally trigger a re-fetch or update UI here.
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="mb-6 text-2xl font-bold md:text-4xl ">
        Your Watchlist <span>({watchlist.length})</span>
      </h2>
      {watchlist.length > 0 ? (
        <ul className="space-y-6">
          {watchlist.map((movie) => (
            <li
              key={movie.id}
              className="flex items-start gap-2 rounded-lg border border-gray-300 bg-white p-4 shadow-sm transition-shadow hover:shadow-lg"
            >
              <img
                src={
                  movie.poster_path
                    ? tmdbImage.poster(movie.poster_path, "w500")
                    : ""
                }
                alt={movie.title}
                className="mr-6 h-36 w-32 rounded-md object-cover"
              />
              <div className="grow gap-2">
                <h3 className="text-xl font-semibold text-gray-800">
                  {movie.title}
                </h3>
                <p className="mt-1 text-sm text-gray-600">{movie.overview}</p>
                <div className="mt-2 text-sm text-gray-500">
                  <span>
                    Rating: {movie.vote_average} ({movie.vote_count} votes)
                  </span>
                  <span className="block">
                    Release Date:{" "}
                    {new Date(movie.release_date).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <WatchListButton onClick={handleRemove} params={movie.movieId}>
                Remove
              </WatchListButton>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-300">Your watchlist is empty.</p>
      )}
    </div>
  )
}

export default Watchlist