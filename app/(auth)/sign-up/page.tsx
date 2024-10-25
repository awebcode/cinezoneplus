import Link from "next/link"
import { signIn } from "@/auth"
import { Github, Mail } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function SignUp() {
  const handleGoogleSignIn = async () => {
    "use server"
    await signIn("google", { redirectTo: "/profile" })
  }

  const handleGitHubSignIn = async () => {
    "use server"
    await signIn("github", { redirectTo: "/profile" })
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-semibold text-gray-800">
          Sign up
        </h1>
        <p className="mb-8 text-center text-sm text-gray-500">
          Create an account to save your data.
        </p>
        <form className="space-y-4">
          <Button
            className="flex w-full items-center justify-center gap-2 bg-blue-500 text-white hover:bg-blue-600"
            formAction={handleGoogleSignIn}
            type="submit"
          >
            <Mail className="size-5" />
            Sign in with Google
          </Button>
          <Button
            className="flex w-full items-center justify-center gap-2 bg-gray-800 text-white hover:bg-gray-900"
            formAction={handleGitHubSignIn}
            type="submit"
          >
            <Github className="size-5" />
            Sign in with GitHub
          </Button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?
            <Link href="/sign-in" className="text-blue-500 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
