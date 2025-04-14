import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/db';
import Meal from '@/model/refeicao';
import { cookies } from 'next/headers';


process.env.JWT_SECRET = "G@BR!3LTUR4TT1D3V3L0P3RJUN10RF1N2NCY4PP";

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get('auth_token')?.value;
    console.log("token valor: " + token)
    if (!token) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      email: string;
      userId: string;
    };
    console.log("valor decoded email:" + decoded.email);
    if (!decoded.email) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      );
    }
    await dbConnect();
    const meals = await Meal.find({ useremail: decoded.email });
    console.log("teste aaaaaaaa " + meals)
    return NextResponse.json(meals);

  } catch (error) {
    console.error('Erro ao buscar refeições:', error);
    
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

export async function POST(request: Request) {
  try{
    await dbConnect();
    const body = await request.json();
    console.log(body)
    const meal = await Meal.create(body);
    console.log(meal);
    return NextResponse.json(meal, { status: 201 });
  }catch(err){
    console.log(err)
    return NextResponse.json(err, {status: 500});
  }

}

export async function DELETE(request: Request) {
  try{
    await dbConnect();
    const body = await request.json();
    const meal = await Meal.findByIdAndDelete(body._id);
    console.log(meal);
    return NextResponse.json(meal, { status: 201 });
  }catch(err){
    console.log(err)
    return NextResponse.json(err, { status: 500});
  }

}

export async function PUT(request: Request) {
  await dbConnect();
  const body = await request.json();
  console.log(body);
  const meal = await Meal.updateOne(body);
  console.log(meal);
  return NextResponse.json(meal, { status: 201 });
}