"use client"

import React from "react"
import { useFormStatus } from "react-dom"

import { cn } from "@/lib/utils"

interface RemoveWatchlistBtnProps
  extends React.HTMLAttributes<HTMLButtonElement> {}
const RemoveWatchlistBtn = ({
  className,
  ...props
}: RemoveWatchlistBtnProps) => {
  const { pending } = useFormStatus()

  return (
    <button
      className={cn("cursor-pointer text-sm text-red-400 underline", className)}
      type="button"
      disabled={pending}
      aria-disabled={pending}
      {...props}
    >
      {pending ? "Removing..." : "Remove"}
    </button>
  )
}

export default RemoveWatchlistBtn
