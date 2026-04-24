import Link from "next/link";
import { db } from "@/lib/db";

import ChevronIcon from "@/components/icons/chevron-icon";

// Making whole page dynamic by force(disable caching):
// export const dynamic = "force-dynamic";

// Making a time based caching after 3 sec refresh cache:
// export const revalidate = 3 (0 will disable cache)

export default async function Home() {
  const snippets = await db.query("SELECT * FROM snippet");

  const renderSnippet = snippets.rows.map((snippet, index) => {
    return (
      <div key={snippet.id}>
        <Link
          href={`/snippets/${snippet.id}`}
          className="flex justify-between items-center p-2"
        >
          <div>{snippet.title}</div>
          <div>
            <ChevronIcon size={16} />
          </div>
        </Link>
        {index < snippets.rows.length - 1 ? (
          <div className="divider"></div>
        ) : null}
      </div>
    );
  });

  return (
    <div className="home">
      <div className="flex mx-2 mb-8 justify-between items-center">
        <h1 className="text-xl font-bold">Snippets</h1>
        <Link href="/snippets/new" className="new p-2 rounded">
          New
        </Link>
      </div>
      <div className="flex flex-col gap-2">{renderSnippet}</div>
    </div>
  );
}
