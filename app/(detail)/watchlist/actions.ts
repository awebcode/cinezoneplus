"use server"

import { revalidateTag, unstable_cache } from "next/cache"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { prisma } from "@/prisma/prisma"
import { tmdb } from "@/tmdb/api"

import type { WatchListMovie } from "@/types/movie"

/**
 * Add a movie to the user's watchlist.
 *  @param movieId The ID of the movie to add.
 *  @returns A promise that resolves to the added movie.
 */
interface WishListReturnType {
  success?: boolean
  message?: string
}
export async function saveWatchlist(
  prev: any,
  { movieId, type }: { movieId: number; type: "movie" | "tv" }
): Promise<WishListReturnType> {
  try {
    const user = await auth()
    if (!user) {
      redirect("/sign-in")
    }
    // await new Promise((resolve) => setTimeout(resolve, 1000))
    const isExist = await prisma.watchList.findFirst({
      where: {
        userId: user?.user?.id as string,
        movieId,
      },
    })

    if (isExist) {
      return { success: false, message: "Already added" }
    }
    // Fetch details based on type
    const itemId = movieId
    let itemDetails
    if (type === "movie") {
      itemDetails = await tmdb.movie.detail<WatchListMovie>({ id: itemId })
    } else if (type === "tv") {
      itemDetails = await tmdb.tv.detail<WatchListMovie>({ id: String(itemId) })
    } else {
      return { success: false, message: "Invalid type" }
    }

    // Destructure with fallback for title/name
    const { id, overview, vote_average, vote_count, poster_path } = itemDetails

    const titleOrName =
      itemDetails.title ||
      (itemDetails as any)?.name ||
      (itemDetails as any)?.original_name
    const ReleaseDate =
      itemDetails.release_date || (itemDetails as any)?.first_air_date

    await prisma.watchList.create({
      data: {
        movieId,
        title: titleOrName as string,
        userId: user?.user?.id as string,
        overview,
        vote_average,
        vote_count,
        poster_path,
        release_date: ReleaseDate,
      },
    })

    revalidateTag("watchlist")

    return { success: true, message: "Added to watchlist" }
  } catch (error: any) {
    return { success: false, message: error.message || "Something went wrong" }
  }
}

/**
 * Remove a movie from the user's watchlist.
 * @param movieId The ID of the movie to remove.
 */
export const removeWatchlist = async (movieId: number) => {
  try {
    const user = await auth()
    if (!user) {
      redirect("/sign-in")
    }

    await prisma.watchList.deleteMany({
      where: {
        movieId,
        userId: user?.user?.id as string,
      },
    })
    revalidateTag("watchlist")
  } catch (error) {
    console.error("Failed to remove movie from watchlist:", error)
    throw new Error("Something went wrong")
  }
}

/**
 * Get the user's watchlist.
 * @returns A promise that resolves to the user's watchlist.
 */
export const getWatchlist = unstable_cache(
  async (userId: string) => {
    try {
      // if (!user) {
      //   redirect("/sign-in")
      // }
      const watchlist = await prisma.watchList.findMany({
        where: {
          userId: userId,
        },
      })
      // Convert any BigInt fields to strings
      const serializedWatchlist = watchlist.map((item) => ({
        ...item,
        id: item.id.toString(), // Assuming id is BigInt
        movieId: item.movieId.toString(),
      }))

      return serializedWatchlist
    } catch (error) {
      console.error("Failed to get watchlist:", error)
      throw new Error("Something went wrong")
    }
  },
  ["watchlist"],
  { revalidate: 3600, tags: ["watchlist"] } // 1 hour
)
