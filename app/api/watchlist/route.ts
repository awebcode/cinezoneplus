import fs from "fs"
import path from "path"
import { NextResponse, type NextRequest } from "next/server"

import type { WatchListMovie } from "@/types/movie"

// Define the path to the watchlist JSON file
const watchlistFilePath = path.join(process.cwd(), "public/data/watchlist.json")

// Handle GET requests to retrieve the watchlist
export async function GET() {
  try {
    // Read the watchlist from the JSON file
    const data = fs.readFileSync(watchlistFilePath, "utf8")
    const watchlists: WatchListMovie[] = JSON.parse(data)
    return NextResponse.json({ watchlists }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: "Error reading watchlist" },
      { status: 500 }
    )
  }
}

// Handle POST requests to add a movie to the watchlist
export async function POST(request: NextRequest) {
  try {
    const movie: WatchListMovie = await request.json()
    const data = fs.readFileSync(watchlistFilePath, "utf8")
    const watchlist: WatchListMovie[] = JSON.parse(data)

    // Check if the movie is already in the watchlist
    if (!watchlist.some((item) => item.id === movie.id)) {
      watchlist.push(movie)
    }

    // Write updated watchlist back to JSON file
    fs.writeFileSync(watchlistFilePath, JSON.stringify(watchlist, null, 2))

    return NextResponse.json(watchlist, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: "Error adding movie to watchlist" },
      { status: 500 }
    )
  }
}

// Handle DELETE requests to remove a movie from the watchlist
export async function DELETE(request: NextRequest) {
  try {
    const movie: WatchListMovie = await request.json()
    const data = fs.readFileSync(watchlistFilePath, "utf8")
    const watchlist: WatchListMovie[] = JSON.parse(data)

    // Filter out the movie to be removed
    const updatedWatchlist = watchlist.filter((item) => item.id !== movie.id)

    // Write updated watchlist back to JSON file
    fs.writeFileSync(
      watchlistFilePath,
      JSON.stringify(updatedWatchlist, null, 2)
    )

    return NextResponse.json(updatedWatchlist, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: "Error removing movie from watchlist" },
      { status: 500 }
    )
  }
}
