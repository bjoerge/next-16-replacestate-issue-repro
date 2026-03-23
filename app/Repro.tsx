"use client"
import {useEffect, useState} from "react";

// Trailing '&' included so we can replace `#foo=foo&bar=baz` with `#bar=baz`
const paramPattern = /foo=([^&]+)&?/

function consumeHashParam(): string | null {
  // Are we in a browser-like environment?
  if (typeof window === 'undefined' || typeof window.location !== 'object') {
    return null
  }

  // Does the hash contain a valid session ID?
  const hash = window.location.hash

  // The first element will be the entire match, including `sid=` - we only care about
  // the first _group_, being the actual _value_ of the parameter, thus the leading comma
  const [, param] = hash.match(paramPattern) || []
  if (!param) {
    return null
  }
  // Remove the parameter from the URL
  const newHash = hash.replace(paramPattern, '')
  const newUrl = new URL(window.location.href)
  newUrl.hash = newHash.length > 1 ? newHash : ''
  history.replaceState(null, '', newUrl)
  return param
}

const hashParam = consumeHashParam()

if (hashParam) {
  alert("Called history.replaceState to update hash.\nNotice it reappear after you hit OK")
}

export default function Repro() {
  const [hash, setHash] = useState<string | null>(null)

  useEffect(() => {
    const getHash = async () => hashParam
    getHash().then((hash) => setHash(hash))
  }, [])

  const repro = async () => {
    await new Promise(resolve => setTimeout(resolve, 0))
    window.location.reload()
  }

  return (
    <div className="p-20 flex flex-col gap-2">
      <div>
        <a
          href="#foo=test"
          className="bg-blue-600 p-2"
          onClick={repro}>
          Click here to navigate to #foo=test
        </a>
      </div>
      <div>Current param: {hash}</div>
    </div>
  )
}

