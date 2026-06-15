import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import supabase from "@/constants/supabase";

export async function GET() {
    await supabase.auth.getSession();
    await supabase.auth.signOut({ scope: 'global' });
    return NextResponse.json('Logout successful', { status: 200 });
}