import { db } from "@/lib/db";
import ClientContainer from "@/components/client-container";

// Making whole page dynamic by force(disable caching):
// export const dynamic = "force-dynamic";

// Making a time based caching after 3 sec refresh cache:
// export const revalidate = 3 (0 will disable cache)

const userId = 1; // Temperory no auth user_id

export default async function Home() {
  const folderData = await db.query(
    "SELECT * FROM folders WHERE user_id = $1 ORDER BY id ASC",
    [userId],
  );
  const fileData = await db.query(
    "SELECT * FROM files WHERE user_id = $1 ORDER BY id ASC",
    [userId],
  );

  const folders = folderData.rows;
  const files = fileData.rows;

  return <ClientContainer folders={folders} files={files} />;
}
