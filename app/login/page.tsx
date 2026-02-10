import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { login } from "./actions";

type LoginPageProps = {
  searchParams: Promise<{
    message?: string;
    next?: string;
  }>;
};

const getSafeNext = (value: string | undefined) => {
  if (!value) {
    return "/inbox";
  }

  return value.startsWith("/") ? value : "/inbox";
};

export default async function Page({ searchParams }: LoginPageProps) {
  const resolvedSearchParams = await searchParams;
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const nextPath = getSafeNext(resolvedSearchParams.next);

  if (user) {
    redirect(nextPath);
  }

  return (
    <div className="mx-auto w-full max-w-sm space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Login</h1>
        <p className="text-sm text-black/60">
          Use your Sando account credentials.
        </p>
      </header>

      {resolvedSearchParams.message ? (
        <div
          role="alert"
          className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {resolvedSearchParams.message}
        </div>
      ) : null}

      <form className="space-y-4" action={login}>
        <input type="hidden" name="next" value={nextPath} />

        <label className="space-y-1 text-sm font-medium">
          <span>Email</span>
          <input
            className="w-full rounded border border-black/10 px-3 py-2 text-sm"
            name="email"
            type="email"
            autoComplete="email"
            required
          />
        </label>

        <label className="space-y-1 text-sm font-medium">
          <span>Password</span>
          <input
            className="w-full rounded border border-black/10 px-3 py-2 text-sm"
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
        </label>

        <button
          type="submit"
          className="w-full rounded bg-black px-3 py-2 text-sm font-semibold text-white"
        >
          Sign in
        </button>
      </form>
    </div>
  );
}
