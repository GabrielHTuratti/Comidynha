import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import IUser from '@/model/users'; 
import { dbConnect } from '@/lib/db';
import { jwtVerify } from 'jose';



export async function GET() {
  try {

    const cookieStore = cookies();
    const token = (await cookieStore).get('auth_token')?.value;


    if (!token) {
      return NextResponse.json(
        { error: 'Não autorizado - Token não encontrado' },
        { status: 401 }
      );
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const {payload} = await jwtVerify(token, secret)


    if (!payload.email) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      );
    }

    await dbConnect();

    const user = await IUser.findOne({ email: payload.email })
      .select('-password -__v');
    

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      }
    });

  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json(
        { error: 'Token inválido ou expirado' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}