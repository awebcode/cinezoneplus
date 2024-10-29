"use client"

import { useEffect } from "react"

export default function ScrollUpClickLink() {
  useEffect(() => window.document.scrollingElement?.scrollTo(0, 0), [])

  return null
}
