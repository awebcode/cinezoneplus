import { Skeleton } from "../ui/skeleton"

export default function SettingsLoadingSkeleton() {
  return (
    <div className="flex w-72 animate-pulse flex-col gap-4 rounded-lg bg-white p-4 shadow-md">
      {/* User Profile Section */}
      <div className="flex items-center gap-3">
        <Skeleton className="size-12 rounded-full" />
        <div className="flex flex-col gap-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>

      {/* Links Section */}
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>

      {/* Divider */}
      <div className="border-t border-gray-300" />

      {/* Buttons Section */}
      <div className="flex flex-col gap-2">
        <Skeleton className="h-10 w-full rounded-md" />
        <Skeleton className="h-10 w-full rounded-md" />
      </div>

      {/* Logout Button */}
      <div className="mt-4">
        <Skeleton className="h-10 w-full rounded-md bg-red-300" />
      </div>
    </div>
  )
}
