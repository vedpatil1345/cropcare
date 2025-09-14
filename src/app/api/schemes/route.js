import { NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";
import { createClient } from "@supabase/supabase-js";

// Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET() {
  try {
    const url = "https://www.myscheme.gov.in/schemes?categories=agriculture";
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    let schemes = [];

    $(".card").each((i, el) => {
      let title = $(el).find(".card-title").text().trim();
      let description = $(el).find(".card-text").text().trim();
      let link =
        "https://www.myscheme.gov.in" + $(el).find("a").attr("href");

      schemes.push({ title, description, link });
    });

    // Insert into Supabase
    for (let scheme of schemes) {
      await supabase
        .from("schemes_notifications")
        .upsert([scheme], { onConflict: "title" });
    }

    return NextResponse.json({ success: true, schemes });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ success: false, error: err.message });
  }
}