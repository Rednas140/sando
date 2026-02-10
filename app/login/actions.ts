"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

const getSafeNext = (value: FormDataEntryValue | null) => {
  if (typeof value !== "string") {
    return "/inbox";
  }

  return value.startsWith("/") ? value : "/inbox";
};

export async function login(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");
  const nextPath = getSafeNext(formData.get("next"));

  if (typeof email !== "string" || typeof password !== "string") {
    redirect("/login?message=Invalid%20credentials");
  }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect(`/login?message=${encodeURIComponent(error.message)}`);
  }

  redirect(nextPath);
}
