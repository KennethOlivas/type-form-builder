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
  return await auth.api.signUpEmail({
    body: {
      name,
      email,
      password,
    },
  });
};

export const signOut = async () => {
  return await auth.api.signOut({
    headers: await headers(),
  });
}