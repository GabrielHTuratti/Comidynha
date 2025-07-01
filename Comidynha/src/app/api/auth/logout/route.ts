import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/db";
import { jwtVerify } from "jose";
import User from "@/model/users";

export async function POST(){
    try{
       await dbConnect();
       
       const refreshToken = (await cookies()).get('rfs_token')?.value;
        if(refreshToken){
            const {payload} = await jwtVerify(refreshToken, new TextEncoder().encode(process.env.REFRESH_TOKEN));
            
            await User.updateOne({_id: payload.userId}, {$inc: {tokenVersion: 1}})
        }
        const response = NextResponse.json(
            { message: 'Logout realizado com sucesso' },
            { status: 200 }
          );

          response.cookies.delete('auth_token');
          response.cookies.delete('rfs_token');
          
          return response;

    }catch(error){
        console.error('Erro no logout:', error);
        return NextResponse.json(
        { message: 'Erro durante o logout' },
        { status: 500 }
        );
    }

}