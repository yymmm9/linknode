import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
    server: {
        DUB_DOT_CO_TOKEN: z.string().optional(),
        DUB_DOT_CO_SLUG: z.string().optional(),
    },
    client: {
        NEXT_PUBLIC_BASE_SHORT_DOMAIN: z.string().optional(),
    },
    runtimeEnv: {
        NEXT_PUBLIC_BASE_SHORT_DOMAIN: process.env.NEXT_PUBLIC_BASE_SHORT_DOMAIN,
        HOV_SH_TOKEN: process.env.DUB_DOT_CO_TOKEN,
        HOV_SH_SLUG: process.env.DUB_DOT_CO_SLUG
    },
});