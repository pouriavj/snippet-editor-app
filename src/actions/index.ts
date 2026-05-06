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

//////////////////////////////////////////////////////////////////////////////////

// Create Folder

export async function createFolder(
  prevState: { message: string },
  formData: FormData,
) {
  try {
    const name = formData.get("name") as string;
    const folderId = formData.get("folder_id") as string; // Handle subfolders
    const userId = formData.get("user_id") as string; // From hidden input

    // Validation
    if (typeof name !== "string" || name.length < 1) {
      return { message: "error: name is required" };
    }

    // Parse IDs (null if empty/undefined)
    const parsedFolderId = folderId ? parseInt(folderId) : null;
    const parsedUserId = userId ? parseInt(userId) : null;

    // Insert query
    const newFolder = await db.query(
      "INSERT INTO folders (name, folder_id, user_id) VALUES ($1, $2, $3) RETURNING *",
      [name, parsedFolderId, parsedUserId],
    );

    console.log("Created folder:", newFolder.rows[0]);

    revalidatePath("/"); // Revalidate after success

    // return a state object for useActionState
    return { message: "success" };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Something went wrong...";
    console.error("Create folder error:", message);
    return { message: `error: ${message}` };
  }
}

// Create File

export async function createFile(
  prevState: { message: string },
  formData: FormData,
) {
  try {
    const name = formData.get("name") as string;
    const folderId = formData.get("folder_id") as string; // Parent Folder
    const userId = formData.get("user_id") as string; // User Id

    // Validation
    if (typeof name !== "string" || name.length < 1) {
      return { message: "error: name is required" };
    }

    // Parse IDs (null if empty/undefined)
    const parsedFolderId = folderId ? parseInt(folderId) : null;
    const parsedUserId = userId ? parseInt(userId) : null;

    // Insert query
    const newFile = await db.query(
      "INSERT INTO files (name, folder_id, user_id, content) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, parsedFolderId, parsedUserId, ""],
    );

    console.log("Created file:", newFile.rows[0]);

    revalidatePath("/"); // Revalidate after success

    // return a state object for useActionState
    return { message: "success" };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Something went wrong...";
    console.error("Create file error:", message);
    return { message: `error: ${message}` };
  }
}

// Edit Folder

export async function editFolder(
  prevState: { message: string },
  formData: FormData,
) {
  try {
    const name = formData.get("name") as string;
    const id = formData.get("id") as string; // get id for rename reuse

    // Validation
    if (typeof name !== "string" || name.length < 1) {
      return { message: "error: name is required" };
    }

    // Parse IDs (null if empty/undefined)
    const parsedId = id ? parseInt(id) : null;

    // Update query
    await db.query("UPDATE folders SET name = $1 WHERE id = $2", [
      name,
      parsedId,
    ]);

    revalidatePath("/"); // Revalidate after success

    // return a state object for useActionState
    return { message: "success" };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Something went wrong...";
    console.error("Rename folder error:", message);
    return { message: `error: ${message}` };
  }
}

// Edit File

export async function editFile(
  prevState: { message: string },
  formData: FormData,
) {
  try {
    const name = formData.get("name");
    const id = formData.get("id") as string; // get id for rename reuse
    const content = formData.get("content");
    if (typeof content === "string") {
      const parsedId = id ? parseInt(id) : null;
      // Update query
      await db.query("UPDATE files SET content = $1 WHERE id = $2", [
        content,
        parsedId,
      ]);

      revalidatePath("/"); // Revalidate after success

      // return a state object for useActionState
      return { message: "success" };
    } else {
      // Validation
      if (typeof name !== "string" || name.length < 1) {
        return { message: "error: name is required" };
      }

      // Parse IDs (null if empty/undefined)
      const parsedId = id ? parseInt(id) : null;

      // Update query
      await db.query("UPDATE files SET name = $1 WHERE id = $2", [
        name,
        parsedId,
      ]);

      revalidatePath("/"); // Revalidate after success

      // return a state object for useActionState
      return { message: "success" };
    }
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Something went wrong...";
    console.error("Rename file error:", message);
    return { message: `error: ${message}` };
  }
}

// Delete Folder

export async function deleteFolder(
  prevState: { message: string },
  formData: FormData,
) {
  try {
    const folderId = formData.get("folder_id");

    if (typeof folderId !== "string" || folderId.length < 1) {
      return { message: "error: folder_id is required" };
    }

    const parsedFolderId = parseInt(folderId);
    if (Number.isNaN(parsedFolderId)) {
      return { message: "error: folder_id is invalid" };
    }

    await db.query("DELETE FROM folders WHERE id = $1", [parsedFolderId]);

    revalidatePath("/");
    return { message: "success" };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Something went wrong...";
    console.error("Delete folder error:", message);
    return { message: `error: ${message}` };
  }
}

// Delete File
export async function deleteFile(
  prevState: { message: string },
  formData: FormData,
) {
  try {
    const fileId = formData.get("file_id");

    if (typeof fileId !== "string" || fileId.length < 1) {
      return { message: "error: file_id is required" };
    }

    const parsedFileId = parseInt(fileId);
    if (Number.isNaN(parsedFileId)) {
      return { message: "error: file_id is invalid" };
    }

    await db.query("DELETE FROM files WHERE id = $1", [parsedFileId]);

    revalidatePath("/");
    return { message: "success" };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Something went wrong...";
    console.error("Delete file error:", message);
    return { message: `error: ${message}` };
  }
}
