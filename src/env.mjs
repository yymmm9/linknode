import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
    server: {
        HOV_SH_TOKEN: z.string().optional(),
        HOV_SH_SLUG: z.string().optional(),
    },
    client: {
        NEXT_PUBLIC_BASE_SHORT_DOMAIN: z.string().optional(),
    },
    runtimeEnv: {
        NEXT_PUBLIC_BASE_SHORT_DOMAIN: process.env.NEXT_PUBLIC_BASE_SHORT_DOMAIN,
        HOV_SH_TOKEN: process.env.HOV_SH_TOKEN,
        HOV_SH_SLUG: process.env.HOV_SH_SLUG
    },
});