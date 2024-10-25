// components/Watchlist.tsx

import React from "react"
import Image from "next/image"
import Link from "next/link"
import { auth } from "@/auth"
import { tmdbImage } from "@/tmdb/utils"

import PendingButton from "../../components/pending-button"
import { getWatchlist, removeWatchlist } from "./actions"

const Watchlist: React.FC = async () => {
  const user = await auth()
  const watchlist = await getWatchlist(user?.user?.id as string)
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
              className="flex flex-wrap items-start gap-2 rounded-lg border border-gray-300 bg-white p-2 shadow-sm transition-shadow hover:shadow-lg md:flex-nowrap md:p-4"
            >
              <Link href={`/movie/${movie.movieId}`}>
                <Image
                  src={
                    movie.poster_path
                      ? tmdbImage.poster(movie.poster_path, "w500")
                      : ""
                  }
                  height={1000}
                  width={500}
                  alt={movie.title}
                  className="h-48 w-full  rounded-md object-cover md:mr-6 md:h-32 md:w-36"
                  priority
                  unoptimized
                  objectFit="cover"
                />
              </Link>

              <div className="grow gap-2">
                <Link href={`/movie/${movie.movieId}`}>
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
                </Link>
              </div>
              <form
                action={async () => {
                  "use server"
                  await removeWatchlist(Number(movie?.movieId))
                }}
              >
                {" "}
                <PendingButton
                  pendingText="Removing..."
                  btnText="Remove"
                  variant={"link"}
                  className="text-rose-500 underline"
                />
              </form>
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
