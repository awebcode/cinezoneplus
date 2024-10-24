"use client"

import React, { useEffect } from "react"
import { useRouter } from "next/navigation"
import { ShoppingBasket } from "lucide-react"
import { useSession } from "next-auth/react"
import { useFormState, useFormStatus } from "react-dom"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"

import { saveWatchlist } from "./actions"

interface WatchListParams {
  params: { id: number; type: "tv" | "movie" }
}
const AddWatchListBtn = ({
  params: { id, type = "movie" },
}: WatchListParams) => {
  const [state, action] = useFormState(saveWatchlist, {})
  const router = useRouter()

  const { data: session } = useSession()
  // console.log({ data: session })

  const user = session?.user
  const saveData = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "Plese sign in to add movie to watchlist",
      })
      router.push("/sign-in")
    }

    try {
      await action({ movieId: id, type })
    } catch (error) {
      console.error("Failed to add movie to watchlist:", error)
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    if (state.success) {
      toast({
        title: "Success",
        description: "Movie added to watchlist",
        variant: "default",
      })
    } else if (state.message) {
      toast({ title: state.message, variant: "destructive" })
    }
  }, [state?.message])

  return (
    <form action={saveData}>
      <PendingButton />
    </form>
  )
}

export default AddWatchListBtn

const PendingButton = () => {
  const { pending } = useFormStatus()
  return (
    <Button
      type="submit"
      className={cn(buttonVariants())}
      aria-disabled={pending}
      disabled={pending}
    >
      {" "}
      <ShoppingBasket className="mr-2 size-4" />{" "}
      {pending ? "Adding..." : "Add to watchlist"}
    </Button>
  )
}
