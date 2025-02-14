import { component$, Slot } from "@qwik.dev/core";
import type { RequestHandler } from "@qwik.dev/router";
import { Link, useDocumentHead } from "@qwik.dev/router";

export const onGet: RequestHandler = async ({ cacheControl }) => {
  cacheControl({
    staleWhileRevalidate: 0,
    maxAge: 0,
  });
};

export default component$(() => {
  const head = useDocumentHead();

  return (
    <>
      {head.frontmatter.home && <Slot />}

      {!head.frontmatter.home && (
        <>
          <Slot />

          <ul>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/my-first-post/">My first post</Link>
            </li>
            <li>
              <Link href="/my-second-post/">My second post</Link>
            </li>
          </ul>
        </>
      )}
    </>
  );
});
