// Profile.tsx

import React from "react"
import Image from "next/image"
import { redirect } from "next/navigation"
import { auth } from "@/auth"

import LogoutButton from "../../../components/logout-button"

const Profile = async () => {
  const session = await auth()

  // Redirect to sign-in if no user session
  if (!session?.user) redirect("/sign-in")

  const { user } = session

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-sm rounded-lg bg-white p-8 shadow-md">
        <div className="flex aspect-square flex-col items-center">
          <h3 className=" line-clamp-1 text-xl font-semibold text-gray-800">
            #Id_{user?.id}
          </h3>
          <Image
            src={user?.image || "/default-avatar.png"}
            alt={user?.name || "User"}
            width={96}
            height={96}
            className="mb-4 size-24 rounded-full object-cover"
          />
          <h2 className="text-xl font-semibold text-gray-800">
            {user?.name || "Anonymous"}
          </h2>
          <p className="text-gray-500">{user?.email}</p>
        </div>

        <div className="mt-6">
          <LogoutButton />
        </div>
      </div>
    </div>
  )
}

export default Profile
