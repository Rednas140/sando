import Link from "next/link";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { signOut } from "./actions";
import { NavLink } from "@/components/NavLink";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:shadow"
      >
        Skip to content
      </a>

      <header className="border-b">
        <div className="mx-auto flex max-w-5xl items-center justify-between p-4">
          <Link href="/inbox" className="font-semibold">
            Sando
          </Link>

          <nav aria-label="Primary">
            <ul className="flex gap-3 text-sm">
              <li>
                <NavLink href="/inbox">Inbox</NavLink>
              </li>
              <li>
                <NavLink href="/today">Today</NavLink>
              </li>
              <li>
                <NavLink href="/week">Week</NavLink>
              </li>
              <li>
                <NavLink href="/done">Done</NavLink>
              </li>
              <li>
                {user ? (
                  <form action={signOut}>
                    <button type="submit">Logout</button>
                  </form>
                ) : (
                  <NavLink href="/login">Login</NavLink>
                )}
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main id="content" className="mx-auto max-w-5xl p-4">
        {children}
      </main>
    </div>
  );
}
