import Link from "next/link";
import { db } from "@/lib/db";
// Making whole page dynamic by force(disable caching):
// export const dynamic = "force-dynamic";

// Making a time based caching after 3 sec refresh cache:
// export const revalidate = 3 (0 will disable cache)

export default async function Home() {
  const snippets = await db.query("SELECT * FROM snippet");

  const renderSnippet = snippets.rows.map((snippet) => {
    return (
      <Link
        href={`/snippets/${snippet.id}`}
        key={snippet.id}
        className="flex justify-between items-center p-2 border rounded"
      >
        <div>{snippet.title}</div>
        <div>View</div>
      </Link>
    );
  });

  return (
    <div>
      <div className="flex m-2 justify-between items-center">
        <h1 className="text-xl font-bold">Snippets</h1>
        <Link href="/snippets/new" className="border p-2 rounded">
          New
        </Link>
      </div>
      <div className="flex flex-col gap-2">{renderSnippet}</div>
    </div>
  );
}
