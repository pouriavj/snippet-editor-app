"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

export async function editSnippet(id: number, code: string | null | undefined) {
  await db.query("UPDATE snippet SET code = $1 WHERE id = $2", [code, id]);
  // Rebuilding snippet page becuse we use SSG caching on it
  revalidatePath(`/snippets/${id}`);
  redirect(`/snippets/${id}`);
}

export async function deleteSnippet(id: number) {
  await db.query("DELETE FROM snippet WHERE id = $1", [id]);
  // Rerendering home page (disable cahing once) after delete, on home page
  revalidatePath("/");
  redirect("/");
}

export async function createSnippet(
  formState: { message: string },
  formData: FormData,
) {
  // Put try at first to include all errors that possibly can happen
  try {
    const title = formData.get("title");
    const code = formData.get("code");
    // Some form validation
    if (typeof title !== "string" || title.length < 3) {
      return {
        message: "Title must be longer",
      };
    }

    if (typeof code !== "string" || code.length < 10) {
      return {
        message: "Code must be longer",
      };
    }

    const snippet = await db.query(
      "INSERT INTO snippet (title, code) VALUES ($1, $2) RETURNING *",
      [title, code],
    );
    console.log(snippet.rows[0]);
  } catch (error: unknown) {
    // Becuse error type is unknown , its not sure that has a message property , so we have to put a type guard
    if (error instanceof Error) {
      console.log(error.message);
      // Just return an object with message property from server action to show inside client component
      return {
        message: error.message,
      };
    } else {
      // Some unknown error happened without message property
      return {
        message: "Something went wrong...",
      };
    }
  }
  // Rebuild the home page (ignore cache)
  revalidatePath("/");
  // redirect throws an error so should always be at the end
  redirect("/");
}
