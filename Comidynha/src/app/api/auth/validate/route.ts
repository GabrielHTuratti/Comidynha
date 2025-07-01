import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const sessionToken = (await cookies()).get('auth_token')?.value;
  console.log((await cookies()).getAll());
  console.log(sessionToken);
  let isValid = false;
  if (!sessionToken) {
    return NextResponse.json(
      { valid: false },
      { status: 401 }
    );
  }else{
    isValid = true;
  }



  return NextResponse.json(
    { valid: isValid },
    { status: isValid ? 200 : 401 }
  );
}