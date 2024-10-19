import { createBrowserClient } from "@supabase/ssr";

export function createSupabaseBrowser() {
	return createBrowserClient(
		process.env.SUPABASE_URL!,
		process.env.SUPABASE_ANON_KEY!
	);
}
