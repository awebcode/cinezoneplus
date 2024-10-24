// import {  headers } from "next/headers";
// import { tmdb } from "@/tmdb/api";

// import { ListPagination } from "./list-pagination";
// import { MovieCard } from "./movie-card";

// type DetailRecommendationsProps = {
//   params: {
//     id: string
//   }
// }
// export default async function DetailRecommendations({
//   params,
// }: DetailRecommendationsProps) {
//   const headersList = headers()

//   const {
//     results: movies,
//     total_pages: totalPages,
//     page: currentPage,
//   } = await tmdb.movie.recommendations({
//     id: params.id,
//     page: headersList.get("page") || "",
//   })

//   if (headersList.get("currentUrl")?.includes("recommendations")) {
//     return null
//   }

//   if (!movies?.length) {
//     return <div className="empty-box">No recommendations</div>
//   }

//   return (
//     <div className="space-y-4">
//       <h1 className="text-2xl font-bold">Recommendations</h1>
//       <section className="grid-list">
//         {movies.map((movie) => (
//           <MovieCard key={movie.id} {...movie} />
//         ))}
//       </section>
//       <ListPagination totalPages={totalPages} currentPage={currentPage} />
//     </div>
//   )
// }

"use client"

// Marks the component as a client component
import { usePathname, useSearchParams } from "next/navigation"
import { tmdb } from "@/tmdb/api"
import { Movie, TvShow } from "@/tmdb/models"
import { useQuery } from "@tanstack/react-query"

import { ListPagination } from "./list-pagination"
import { MovieCard } from "./movie-card"

type DetailRecommendationsProps = {
  params: {
    id: string
    type: "movie" | "tv" // Accept type from params
  }
}

export default function DetailRecommendations({
  params,
}: DetailRecommendationsProps) {
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const pageParam = searchParams.get("page") || "1"

  const { data, isLoading, error } = useQuery({
    queryKey: ["recommendations", params.type, params.id, pageParam],
    queryFn: async () => {
      // Choose the right API method based on type
      const { results, total_pages, page } =
        params.type === "movie"
          ? await tmdb.movie.recommendations({ id: params.id, page: pageParam })
          : await tmdb.tv.recommendations({ id: params.id, page: pageParam })

      return { items: results, totalPages: total_pages, currentPage: page }
    },
    enabled: !pathname.includes("recommendations"), // Avoid fetching if pathname includes "recommendations"
  })

  if (isLoading) return <div>Loading recommendations...</div>
  if (error || !data?.items?.length)
    return <div className="empty-box">No recommendations</div>
  if (pathname.includes("recommendations")) return null

  const { items, totalPages, currentPage } = data

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">
        {params.type === "movie" ? "Movie" : "TV"} Recommendations
      </h1>
      <section className="grid-list">
        {items.map((item: Movie | TvShow) => (
          <MovieCard key={item.id} {...(item as any)} />
        ))}
      </section>
      <ListPagination totalPages={totalPages} currentPage={currentPage} />
    </div>
  )
}
