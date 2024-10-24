"use client"

import React from "react"

import { cn } from "@/lib/utils"

interface RemoveWatchlistBtnProps
  extends React.HTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode
  onClick: (params: any) => void
  params?: any
}
const RemoveWatchlistBtn = ({
  children,
  onClick,
  className,
  params,
  ...props
}: RemoveWatchlistBtnProps) => {
  return (
    <a
      className={cn("cursor-pointer text-sm text-red-400 underline", className)}
      onClick={() => onClick(params)}
      {...props}
    >
      {children}
    </a>
  )
}

export default RemoveWatchlistBtn
