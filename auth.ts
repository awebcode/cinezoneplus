import { prisma } from "@/prisma/prisma"
import { PrismaAdapter } from "@auth/prisma-adapter"
import NextAuth from "next-auth"
import Github from "next-auth/providers/github"
import Google from "next-auth/providers/google"

import { getWatchlistCount } from "./app/watchlist/actions"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      allowDangerousEmailAccountLinking: true,
    }),
    Github({
      allowDangerousEmailAccountLinking: true,
    }),
  ],

  callbacks: {
    async session({ session, user }) {
      if (session.user && user?.id) {
        const watchListCount = await getWatchlistCount(user.id)
        session.user.watchListCount = watchListCount
        session.user.id = user.id
      }
      return session
    },
    authorized: async ({ auth }) => {
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth
    },
  },
  // session: { strategy: "jwt" }, // Add this line if you want to use middleware auth - JWT sessions
})
