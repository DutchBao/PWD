import { createClient } from "@supabase/supabase-js";
import type { Database } from "../database.types"; // optional, for auto-completion

export const supabase = createClient<Database>(
	"https://rebozvvokuyvdshxqsuq.supabase.co",
	"sb_publishable_B9YQilnvLmt53SjkTJSWYw_APWXCCzj",
);
