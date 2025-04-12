import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Meal from '@/model/refeicao';

export async function GET() {
  await dbConnect();
  const meals = await Meal.find().sort({ date: -1 });
  return NextResponse.json(meals);
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
  await dbConnect();
  const body = await request.json();
  const meal = await Meal.deleteOne(body);
  return NextResponse.json(meal, { status: 201 });
}

export async function PUT(request: Request) {
  await dbConnect();
  const body = await request.json();
  console.log(body);
  const meal = await Meal.updateOne(body);
  console.log(meal);
  return NextResponse.json(meal, { status: 201 });
}