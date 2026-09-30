import { createClient } from "@supabase/supabase-js";
import type { Database } from "../../database.types";

const supabaseUrl = "https://rebozvvokuyvdshxqsuq.supabase.co";
const supabaseAnonKey = "sb_publishable_B9YQilnvLmt53SjkTJSWYw_APWXCCzj";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
