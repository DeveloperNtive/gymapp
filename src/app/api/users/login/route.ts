import { NextResponse } from "next/server";
import supabase from "@/constants/supabase";
import { signinResponse } from "@/types/signin";


export async function GET() {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json(data, { status: 200 });
}

export async function POST(request: Request): Promise<NextResponse> {
    const data = await request.json()
    const { data: loginData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
    });
    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ data: loginData, message: 'Login successful' } as signinResponse, { status: 200 });
}

// export async function PUT(request: Request): Promise<NextResponse> {
//     return NextResponse.json({ message: 'PUT request' }, { status: 200 });
// }

// export async function PATCH(request: Request): Promise<NextResponse> {
//     return NextResponse.json({ message: 'PATCH request' }, { status: 200 });
// }

// export async function DELETE() {
//     return NextResponse.json({ message: 'DELETE request' }, { status: 200 });
// }