This is a [Next.js](https://nextjs.org/) template to use when reporting a [bug in the Next.js repository](https://github.com/vercel/next.js/issues) with the `app/` directory.

# Next.js App Router `history.replaceState()` Bug Reproduction

## Bug Summary

Next.js App Router (v16.2.0) reverts URL changes made via `history.replaceState()` calls during module evaluation (i.e. at the top level of a client module, before React hydration completes). Next.js appears to capture the URL before client modules execute and then re-synchronize it after hydration, overwriting any `replaceState` calls that occurred in between.

## Steps to Reproduce

1. Run the app (`npm run dev`)
2. Click the link "Click here to navigate to #foo=test" — this navigates to `/#foo=test` and reloads the page
3. On load, `consumeHashParam()` is called (top-level code in `Repro.tsx`, outside any component or effect). It:
    - Reads the `foo=test` parameter from the URL hash
    - Calls `history.replaceState()` to remove `#foo=test` from the URL
    - This runs before React hydration completes
4. An alert confirms that `replaceState` was called
5. **Bug:** After dismissing the alert, the `#foo=test` hash reappears in the URL — Next.js has reverted the `replaceState` call

## Expected Behavior

After `history.replaceState()` removes the hash parameter, the URL should stay clean (no `#foo=test`). The browser's native `replaceState` API should be respected.

## Actual Behavior

Next.js App Router restores the original URL (including `#foo=test`) after the `replaceState` call, effectively undoing it.

## Environment

- Next.js 16.2.0
- React 19.2.4
