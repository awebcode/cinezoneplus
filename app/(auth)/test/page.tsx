"use client"

import React from "react"
import { useSession } from "next-auth/react"

const Teset = () => {
  const session = useSession()
  return <div>Teset {JSON.stringify(session)}</div>
}

export default Teset
