import { NextResponse } from 'next/server';
import supabase from "@/constants/supabase";


export async function GET(): Promise<NextResponse> {
    return NextResponse.json('GET request', { status: 200 });
}

export async function POST(request: Request): Promise<NextResponse> {
    const dataRequest = await request.json()
    console.log(dataRequest.data);
    const { data: signUpData, error } = await supabase.auth.signUp({
        email: dataRequest.data.email,
        password: dataRequest.data.password,
        options: {
            emailRedirectTo: 'https://example.com/welcome',
            data: {
                name: dataRequest.data.nombre,
            }
        },
    });
    // await supabase.from('usuarios').insert([
    //     {
    //         nombre: dataRequest.data.fit_info.nombre,
    //         apellido: dataRequest.data.fit_info.apellido,
    //         email: dataRequest.data.login_data.email,
    //     }
    // ]).select().then(async () => {
    //     const { data, error } = await supabase
    //         .from("usuario_fit_data")
    //         .insert([
    //             {
    //                 edad: 25,
    //                 genero: "masculino",
    //                 altura: 1.75,
    //                 peso: 78,
    //                 nivel_experiencia: "intermedio",
    //                 dias_disponibles: ["L", "M", "J", "V"],
    //                 lugar_entrenamiento: "gym",
    //                 objetivo: "ganar musculo",
    //                 id_usuario: 1
    //             }
    //         ])
    //         .select();
    console.log('DATA', signUpData);

    if (error) {
        console.error("Error insertando usuario_fit_data:", error);
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(signUpData, { status: 200 });
}

// export async function PUT(request: Request): Promise<NextResponse> {
//     return NextResponse.json({ message: 'PUT request' }, { status: 200 });
// }

export async function PATCH(request: Request): Promise<NextResponse> {
    const authHeader = request.headers.get('Authorization')
    console.log('AUTH HEADER', authHeader);
    await supabase.auth.signInWithPassword({
        email: "joboscarmontes@gmail.com",
        password: "05C4r@qwer",
    })
    const { data, error } = await supabase.auth.updateUser({
        data: { name: "prueba" }
    })
    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json(data, { status: 200 })
}

// export async function DELETE(request: Request): Promise<NextResponse> {
//     return NextResponse.json({ message: 'DELETE request' }, { status: 200 });
// }