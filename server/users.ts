"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const signIn = async (email: string, password: string) => {
  return await auth.api.signInEmail({
    body: {
      email,
      password,
    },
  });
};

export const signUp = async (name: string, email: string, password: string) => {
  const result = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password,
    },
  });

  // If signup was successful, create a default workspace for the user
  if (result?.user?.id) {
    const { db } = await import("@/db");
    const { workspace } = await import("@/db/schema");

    try {
      await db.insert(workspace).values({
        id: crypto.randomUUID(),
        name: "My Workspace",
        icon: "folder",
        type: "personal",
        userId: result.user.id,
      });
    } catch (error) {
      console.error("Failed to create default workspace:", error);
      // Don't fail the signup if workspace creation fails
    }
  }

  return result;
};

export const signOut = async () => {
  return await auth.api.signOut({
    headers: await headers(),
  });
};
