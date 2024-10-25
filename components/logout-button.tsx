import React, { type HTMLAttributes } from "react"
import { signOut } from "@/auth"
import { LogOut } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface LogoutButtonProps extends HTMLAttributes<HTMLButtonElement> {}
const LogoutButton = ({ className, ...props }: LogoutButtonProps) => {
  const handleLogout = async () => {
    "use server"
    await signOut({ redirectTo: "/sign-in" })
  }
  return (
    <form action={handleLogout}>
      <Button
        variant={"secondary"}
        type="submit"
        className={cn("w-full", className)}
        {...props}
      >
        <LogOut className="mr-2 h-4" /> Sign Out
      </Button>
    </form>
  )
}

export default LogoutButton
