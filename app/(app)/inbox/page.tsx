import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export default async function Page() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="space-y-2">
      <h1 className="text-xl font-semibold">Inbox</h1>
      <p className="text-sm text-black/60">
        Signed in as {user?.email ?? "Unknown user"}
      </p>
    </div>
  );
}
