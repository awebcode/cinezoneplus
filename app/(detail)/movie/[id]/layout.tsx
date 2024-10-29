import { unstable_cache } from "next/cache"
import Link from "next/link"
import { notFound } from "next/navigation"
import { tmdb } from "@/tmdb/api"
import { WithVideos } from "@/tmdb/api/types"
import { format } from "@/tmdb/utils"

import { Tabs, TabsLink, TabsList } from "@/components/ui/tabs"
import DetailRecommendations from "@/components/DetailsRecmmendations"
import { MediaBackdrop } from "@/components/media-backdrop"
import { MediaDetailView } from "@/components/media-detail-view"
import { MediaPoster } from "@/components/media-poster"
import { MediaRating } from "@/components/media-rating"
import { MediaTrailerDialog } from "@/components/media-trailer-dialog"
import AddWatchListBtn from "@/app/watchlist/AddWatchListBtn"

interface DetailLayoutProps {
  params: {
    id: string
  }

  children: React.ReactNode
}

export async function generateMetadata({ params }: DetailLayoutProps) {
  const { title, overview } = await tmdb.movie.detail({
    id: params.id,
  })

  return {
    title,
    description: overview,
  }
}
export const revalidate = 1
// Define a cacheable function for TMDB movie details
const getMovieDetails = unstable_cache(
  async (id: string) => {
    const {
      id: movieId,
      title,
      overview,
      genres,
      vote_average,
      vote_count,
      backdrop_path,
      poster_path,
      release_date,
      tagline,
      videos,
    } = await tmdb.movie.detail<WithVideos>({
      id,
      append: "videos",
    })

    return {
      movieId,
      title,
      overview,
      genres,
      vote_average,
      vote_count,
      backdrop_path,
      poster_path,
      release_date,
      tagline,
      videos,
    }
  },
  ["movie-detail"], //Unique cache key
  {
    revalidate: 60 * 60, //Cache revalidates every 1 hour (optional)
  }
)
export default async function DetailLayout({
  params,
  children,
}: DetailLayoutProps) {
  const {
    title,
    overview,
    genres,
    vote_average,
    vote_count,
    backdrop_path,
    poster_path,
    release_date,
    tagline,
    videos,
  } = await getMovieDetails(params.id)
  const id = params.id
  if (!id) return notFound()

  return (
    <MediaDetailView.Root>
      <MediaDetailView.Backdrop>
        <MediaBackdrop image={backdrop_path} alt={title} priority />
      </MediaDetailView.Backdrop>

      <MediaDetailView.Hero>
        <MediaDetailView.Poster>
          <MediaPoster image={poster_path} alt={title} size="w780" priority />
        </MediaDetailView.Poster>

        <div className="space-y-4">
          <MediaDetailView.Genres>
            <MediaRating average={vote_average} count={vote_count} />

            {genres?.map((genre) => (
              <Link
                key={genre.id}
                href={`/movie/discover?with_genres=${genre.id}`}
              >
                <MediaDetailView.Genre key={genre.id}>
                  {genre.name}
                </MediaDetailView.Genre>
              </Link>
            ))}
          </MediaDetailView.Genres>

          <MediaDetailView.Title>{title}</MediaDetailView.Title>

          {tagline && (
            <MediaDetailView.Overview>
              &quot;{tagline}&quot;
            </MediaDetailView.Overview>
          )}

          <MediaDetailView.Overview
            dangerouslySetInnerHTML={{ __html: format.content(overview) }}
          />

          <div className="flex gap-2">
            <MediaTrailerDialog videos={videos?.results} />
            <AddWatchListBtn params={{ id: Number(id), type: "movie" }} />
          </div>
        </div>
      </MediaDetailView.Hero>

      <MediaDetailView.Content>
        <Tabs className="mt-12 w-full">
          <div className="max-w-screen scrollbar-hidden -mx-8 overflow-x-scroll px-8 lg:m-0 lg:p-0">
            <TabsList>
              <TabsLink href={`/movie/${id}`}>Overview</TabsLink>
              <TabsLink href={`/movie/${id}/credits`}>Credits</TabsLink>
              <TabsLink href={`/movie/${id}/watch`}>Watch</TabsLink>
              <TabsLink href={`/movie/${id}/reviews`}>Reviews</TabsLink>
              <TabsLink href={`/movie/${id}/images`}>Images</TabsLink>
              <TabsLink href={`/movie/${id}/videos`}>Videos</TabsLink>
              <TabsLink href={`/movie/${id}/recommendations`}>
                Recommendations
              </TabsLink>
              <TabsLink href={`/movie/${id}/similar`}>Similar</TabsLink>
            </TabsList>
          </div>
        </Tabs>

        <div className="mt-4">{children}</div>
        <DetailRecommendations
          params={{ id: String(id) || params.id, type: "movie" }}
        />
      </MediaDetailView.Content>
    </MediaDetailView.Root>
  )
}

export async function generateStaticParams() {
  const posts = await tmdb.movie
    .list({ list: "popular" })
    .then((res) => res.results)

  return posts.map((post) => ({
    id: post.id.toString(),
  }))
}
