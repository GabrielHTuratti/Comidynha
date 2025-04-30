import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import User from '@/model/users';
import { dbConnect } from '@/lib/db';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const registerSchema = z.object({
  email: z.string()
    .email({ message: "E-mail inválido" })
    .max(100, { message: "E-mail não pode exceder 100 caracteres" }),
  name: z.string()
    .min(3, { message: "Nome deve ter pelo menos 3 caracteres" })
    .max(50, { message: "Nome não pode exceder 50 caracteres" }),
  password: z.string()
    .min(6, { message: "Senha deve ter pelo menos 6 caracteres" })
    .max(50, { message: "Senha não pode exceder 50 caracteres" })
    .regex(/[A-Z]/, { message: "Senha deve conter pelo menos 1 letra maiúscula" })
    .regex(/[0-9]/, { message: "Senha deve conter pelo menos 1 número" })
});

 

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    console.log(body);
    const validatedData = registerSchema.safeParse(body);
    console.log(validatedData.error?.errors[0].message)
    if (!validatedData.success) {
      return NextResponse.json(
        { 
          error: "Dados inválidos",
          details: validatedData.error.errors[0].message
        },
        { status: 400 }
      );
    }

    const { name, email, password } = validatedData.data;


    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Este e-mail já está cadastrado" },
        { status: 409 }
      );
    }


    const fixedSalt = '$2b$10$FixedSaltValue00000000000'; // Must be 29 chars, starting with $2b$10$
    const hashedPassword = await bcrypt.hash(password, fixedSalt);
    const teste = await bcrypt.compare(password, hashedPassword);
    console.log(teste + '\n' + hashedPassword);


    const newUser = await User.create({
      name: name,
      email,
      password: password
    });

    const refreshToken = jwt.sign({
      userId: newUser._id,
      tokenVersion: newUser.tokenVersion}, process.env.REFRESH_TOKEN!,{expiresIn: '1d'})

    const acessToken = jwt.sign({email: newUser.email, name: newUser.name,
      userId: newUser._id}, process.env.JWT_SECRET!,{expiresIn: '30m'})

    const activeSessions = new Set<string>();
    activeSessions.add(acessToken);
    activeSessions.add(refreshToken);

    (await cookies()).set('auth_token', acessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 0.5, // 30m
      path: '/',
      sameSite: 'strict'
    });

    (await cookies()).set('rfs_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });


    return NextResponse.json({
      success: true,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        createdAt: newUser.createdAt
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Erro no registro:', error);
    return NextResponse.json(
      { error: "Ocorreu um erro durante o registro" },
      { status: 500 }
    );
  }
}