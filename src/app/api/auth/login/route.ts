import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import User from '@/model/users';
import dbConnect from '@/lib/db';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const loginScheme = z.object({
  email: z.string()
    .email({ message: "Isso não é um e-mail" }),
  password: z.string()
    .min(6, { message: "Senha deve ter pelo menos 6 caracteres" })
});


export async function POST(request: Request) {
  const { email, password } = await request.json();
  console.log(email, password);
  try{
    await dbConnect();
    const validatedData = loginScheme.safeParse({email, password});
        if (!validatedData.success) {
          return NextResponse.json(
            { 
              error: "Dados inválidos",
              details: validatedData.error.errors[0].message
            },
            { status: 400 }
          );
        }
    const user = await User.findOne({email: email}).select('+password')
    if(!user) return NextResponse.json(
      { error: 'Credenciais inválidas' },
      { status: 401 }
    );
    console.log(user);
    const storedHash = String(user.password)
    const passMatch = await bcrypt.compare(password, storedHash);
    console.log(passMatch + "\npassword: " + password + "\npassword hashed: " + storedHash)
    if(!passMatch) return NextResponse.json(
      { error: 'Credenciais inválidas' },
      { status: 401 }
    );
    const sessionToken = jwt.sign({email: user.email,
      userId: user._id}, process.env.JWT_SECRET!,{expiresIn: '1d'})
    
    const activeSessions = new Set<string>();
    activeSessions.add(sessionToken);


    (await cookies()).set('auth_token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });

    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  }catch(err){
    console.error('Erro no login:', err);
    return NextResponse.json(
      { error: 'Erro interno no servidor' },
      { status: 500 }
    );
  }


}