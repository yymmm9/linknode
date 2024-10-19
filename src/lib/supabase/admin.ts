import { createClient } from "@supabase/supabase-js";

export default function supabaseAdmin() {
	return createClient(
		process.env.SUPABASE_URL!,
		process.env.SUPABAE_ADMIN!,
		{
			auth: {
				autoRefreshToken: false,
				persistSession: false,
			},
		}
	);
}
