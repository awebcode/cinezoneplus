import Image from "next/image"
import Link from "next/link"
import { auth } from "@/auth"
import { ShoppingBasket } from "lucide-react"

import { Label } from "@/components/ui/label"
import LogoutButton from "@/components/logout-button"

// import { pleseWait } from "@/lib/utils"

export const UserSettings = async () => {
  // await pleseWait(5000)

  const session = await auth()

  return (
    <>
      {session ? (
        <div className="mt-4 space-y-2">
          <Label className="text-xs text-muted-foreground">User</Label>
          <div className="flex items-center gap-2">
            <div>
              <Image
                src={session.user?.image || "/default-avatar.png"}
                alt={session.user?.name || "User"}
                width={96}
                height={96}
                className=" size-10 rounded-full object-cover"
                priority
                unoptimized
              />
            </div>
            <div className="flex flex-col">
              <span className="text-base">{session.user?.name}</span>
              <span className="text-xs text-muted-foreground">
                {session.user?.email}
              </span>
            </div>
          </div>
          <Link href="/watchlist" className="flex  items-center gap-2">
            <ShoppingBasket className="mr-2 size-5" /> Watchlist{" "}
            {session.user?.watchListCount > 0 ? (
              <span>({session.user?.watchListCount})</span>
            ) : null}
          </Link>
          <div className="mt-6 w-full">
            <LogoutButton />
          </div>
        </div>
      ) : (
        <Link href="/sign-in" className="text-xs text-muted-foreground">
          Not signed in
        </Link>
      )}
    </>
  )
}
