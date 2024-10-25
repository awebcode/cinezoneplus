"use client"

import { Suspense, type ComponentProps } from "react"

import { Skeleton } from "@/components/ui/skeleton"
import { SearchInput } from "@/components/search-input"
import { SiteMenu } from "@/components/site-menu"
import { SiteNav } from "@/components/site-nav"

import { SiteSettings } from "./site-settings"
import SettingsLoadingSkeleton from "./skeletons/settings-skeleton"

interface SiteHeaderProps extends ComponentProps<"div"> {
  children?: React.ReactNode
}

export const SiteHeader = ({}: SiteHeaderProps) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-14 items-center space-x-4 sm:justify-between sm:space-x-0">
        <SiteNav />

        <div className="flex flex-1 justify-end gap-2">
          <Suspense fallback={<Skeleton className="h-10 w-60" />}>
            <SearchInput />
          </Suspense>

          <Suspense fallback={<SettingsLoadingSkeleton />}>
            <SiteSettings />
          </Suspense>

          <div className="lg:hidden">
            <SiteMenu />
          </div>
        </div>
      </div>
    </header>
  )
}
