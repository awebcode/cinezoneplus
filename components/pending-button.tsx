"use client"

import React from "react"
import { useFormStatus } from "react-dom"

import { cn } from "@/lib/utils"

import { Button, buttonVariants, type ButtonProps } from "./ui/button"

interface PendingButtonProps extends ButtonProps {
  btnText: string
  pendingText: string
}

const PendingButton = ({
  className,
  btnText,
  pendingText,
  ...props
}: PendingButtonProps) => {
  const { pending } = useFormStatus()

  return (
    <Button
      className={cn(buttonVariants(), className)}
      type="submit"
      disabled={pending}
      aria-disabled={pending}
      {...props}
    >
      {pending ? pendingText : btnText}
    </Button>
  )
}

export default PendingButton
