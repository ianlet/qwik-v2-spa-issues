import { component$, Resource, Slot, useResource$ } from "@qwik.dev/core";
import type { RequestHandler } from "@qwik.dev/router";
import { Link, server$, useDocumentHead } from "@qwik.dev/router";

export const onGet: RequestHandler = async ({ cacheControl }) => {
  cacheControl({
    staleWhileRevalidate: 0,
    maxAge: 0,
  });
};

interface Author {
  id: string;
  name: string;
}

const authors: Author[] = [
  {
    id: "foo",
    name: "Bar",
  },
  {
    id: "johndoe",
    name: "John",
  },
  {
    id: "janedoe",
    name: "Jane",
  },
];

const getAuthor = server$(function (id: string): Promise<Author | undefined> {
  return Promise.resolve(authors.find((a) => a.id === id)!);
});

export default component$(() => {
  const head = useDocumentHead();

  // ideally this should be in a computed signal to make it reactive,
  // but 'head' is not serializable (same issue in V1)
  const authorId = head.meta.find((m) => m.name === "author")?.content;

  const author = useResource$(({ track, cleanup }) => {
    const id = track(() => authorId);
    if (!id) return;

    const abort = new AbortController();
    cleanup(() => abort.abort());

    return getAuthor(abort.signal, id);
  });

  return (
    <>
      {head.frontmatter.home && <Slot />}

      {!head.frontmatter.home && (
        <Resource
          value={author}
          onResolved={(a) => (
            <>
              {a && <p>Article by {a.name}</p>}

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
        />
      )}
    </>
  );
});
