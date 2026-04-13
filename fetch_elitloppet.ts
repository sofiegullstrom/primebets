
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";

const supabase = createClient(supabaseUrl, supabaseKey);

async function getElitloppet() {
    const { data, error } = await supabase
        .from("calendar_events")
        .select("*")
        .ilike("title", "%Elitloppet%")
        .maybeSingle();

    if (error) {
        console.error("Error fetching event:", error);
        return;
    }

    if (data) {
        console.log("Title:", data.title);
        console.log("Description:", data.description);
        console.log("Detailed Desc:", data.detailed_description);
        console.log("Comment:", data.comment);
    } else {
        console.log("No Elitloppet event found.");
    }
}

getElitloppet();
