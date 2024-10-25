"use client"

import React from "react"

import { cn } from "@/lib/utils"

interface RemoveWatchlistBtnProps
  extends React.HTMLAttributes<HTMLButtonElement> {
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
    <button
      className={cn("cursor-pointer text-sm text-red-400 underline", className)}
      onClick={() => onClick(params)}
      type="button"
      {...props}
    >
      {children}
    </button>
  )
}

export default RemoveWatchlistBtn
