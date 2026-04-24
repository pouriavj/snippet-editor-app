import Link from "next/link";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import * as actions from "@/actions";

interface SnippetShowPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function SnippetShowPage(props: SnippetShowPageProps) {
  // Artificial delay to replicate loading ...
  // await new Promise((r) => {
  //   setTimeout(r, 1000);
  // });
  // ....
  const { id } = await props.params;
  // Even in server component , to call an external server action file , must use .bind method
  const deleteSnippetAction = actions.deleteSnippet.bind(null, parseInt(id));
  try {
    const result = await db.query("SELECT * FROM snippet WHERE id = $1", [
      parseInt(id),
    ]);
    const snippet = result.rows[0];
    if (!snippet) {
      return notFound();
    }
    console.log(snippet);
    return (
      <div>
        <div className="flex m-4 justify-between items-center">
          <h1 className="text-xl font-bold">{snippet.title}</h1>
          <div className="flex gap-4">
            <Link
              href={`/snippets/${snippet.id}/edit`}
              className="p-2 border rounded"
            >
              Edit
            </Link>
            <form action={deleteSnippetAction}>
              <button className="p-2 border rounded cursor-pointer">
                Delete
              </button>
            </form>
          </div>
        </div>
        <pre className="p-3 border rounded bg-gray-300 p-6 border-gray-200">
          <code>{snippet.code}</code>
        </pre>
      </div>
    );
  } catch (err: any) {
    console.log(err.message);
    return notFound();
  }
}

// Caching dynamic routes(SSG) , caching each [id] page and prerender each of them and cache all of them with this special function :
export async function generateStaticParams() {
  // First we fetch all snippets
  const result = await db.query("SELECT * FROM snippet");
  const snippets = result.rows;

  // Then we return an object with id of each , for each record
  return snippets.map((snippet) => {
    return {
      // id is number in db , change it to string with toString()
      id: snippet.id.toString(),
    };
  });
}
// Now all pages load instantly without loading spinner becuse they are cached
// But we now need cache control revalidatePath
