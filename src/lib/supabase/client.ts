import { createBrowserClient } from "@supabase/ssr";

export function createSupabaseBrowser() {
	return createBrowserClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.SUPABASE_ANON_KEY!
	);
}
