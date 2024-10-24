export type WatchListMovie = {
  id: number | string
  userId: string
  movieId: number | string
  title: string
  overview: string
  poster_path: string
  release_date: string
  vote_average: number
  vote_count: number
  createdAt: Date
  updatedAt: Date
}
