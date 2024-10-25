import { Skeleton } from "../ui/skeleton"

export default function UserLoadingSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-5 w-3/5" />
      <Skeleton className="h-3 w-2/5" />
    </div>
  )
}
