"use server"

import { revalidateTag, unstable_cache } from "next/cache"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { prisma } from "@/prisma/prisma"
import { tmdb } from "@/tmdb/api"

import type { WatchListMovie, WatchListReturnType } from "@/types/movie"

// Utility to serialize BigInt to string
const serializeWatchlist = (items: any[]) =>
  items.map((item) => ({
    ...item,
    id: item.id.toString(),
    movieId: item.movieId.toString(),
  }))

// Helper function to fetch details based on type
async function fetchItemDetails(type: "movie" | "tv", id: number) {
  return type === "movie"
    ? tmdb.movie.detail<WatchListMovie>({ id })
    : tmdb.tv.detail<WatchListMovie>({ id: String(id) })
}

/**
 * Add an item to the user's watchlist.
 */
export async function saveWatchlist(
  _: any,
  { movieId, type }: { movieId: number; type: "movie" | "tv" }
): Promise<WatchListReturnType> {
  try {
    const user = await auth()
    if (!user) redirect("/sign-in")

    const userId = user.user && user.user.id
    const existingItem = await prisma.watchList.findFirst({
      where: { userId, movieId },
    })

    if (existingItem) return { success: false, message: "Already added" }

    const itemDetails = await fetchItemDetails(type, movieId)
    const { id, overview, vote_average, vote_count, poster_path } = itemDetails

    const title =
      itemDetails.title ||
      (itemDetails as any).name ||
      (itemDetails as any).original_name
    const releaseDate =
      itemDetails.release_date || (itemDetails as any).first_air_date

    await prisma.watchList.create({
      data: {
        movieId,
        title: title as string,
        userId: userId as string,
        overview,
        vote_average,
        vote_count,
        poster_path,
        release_date: releaseDate,
      },
    })

    revalidateTag("watchlist")
    return { success: true, message: "Added to watchlist" }
  } catch (error: any) {
    console.error("Failed to save watchlist:", error)
    return { success: false, message: error.message || "Something went wrong" }
  }
}

/**
 * Remove an item from the user's watchlist.
 */
export const removeWatchlist = async (movieId: number) => {
  try {
    const user = await auth()
    if (!user) redirect("/sign-in")

    await prisma.watchList.deleteMany({
      where: { movieId, userId: user?.user && (user?.user.id as string) },
    })

    revalidateTag("watchlist")
  } catch (error: any) {
    console.error("Failed to remove from watchlist:", error)
    throw new Error("Something went wrong")
  }
}

/**
 * Get the user's watchlist.
 */
export const getWatchlist = unstable_cache(
  async (userId: string) => {
    try {
      const watchlist = await prisma.watchList.findMany({ where: { userId } })
      return serializeWatchlist(watchlist)
    } catch (error: any) {
      console.error("Failed to get watchlist:", error)
      throw new Error("Something went wrong")
    }
  },
  ["watchlist"],
  { revalidate: 3600, tags: ["watchlist"] }
)
