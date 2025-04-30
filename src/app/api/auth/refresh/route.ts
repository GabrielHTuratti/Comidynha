import { jwtVerify } from 'jose';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import User from '@/model/users';

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try{
        const refreshToken = (await cookies()).get('rfs_token')?.value;
        const redirectURL = request.cookies.get("redirect_url")?.value || "/main";

        if(!refreshToken) {
            return NextResponse.json({error: "Não autorizado"}, {status: 401});
        }
        const secret = new TextEncoder().encode(process.env.REFRESH_TOKEN);        
        let {payload} = await jwtVerify(refreshToken, secret);
        
        const user = await User.findOne({ where: { _id: payload.userId } });
        if(!user || payload.tokenVersion !== user.tokenVersion){
            (await cookies()).delete('rfs_token');
            return NextResponse.json({ error: 'Token revogado' }, { status: 401 });
        }

        const newTokenVersion = user.tokenVersion + 1
        const newRefreshToken = jwt.sign({
            userId: user._id,
            tokenVersion: newTokenVersion}, process.env.REFRESH_TOKEN!,{expiresIn: '1d'})

        

        const newAccesToken = jwt.sign({email: user.email,
              userId: user._id}, process.env.JWT_SECRET!,{expiresIn: '30m'})



        await User.updateOne({ _id: user._id },
                             { $set: { tokenVersion: user.tokenVersion } });

        const activeSessions = new Set<string>();

        const response = NextResponse.redirect(new URL(redirectURL, request.url));

        activeSessions.add(newAccesToken);
        response.cookies.set('auth_token', newAccesToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 0.5, // 30m
            path: '/',
        });

        activeSessions.add(newRefreshToken);
        response.cookies.set('rfs_token', newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24, // 1 day
            path: '/',
        });

        return response;

    }catch(error){
        console.error('Erro no refresh:', error);
        const response = NextResponse.redirect(new URL('/auth', request.url));
        response.cookies.delete('auth_token');
        response.cookies.delete('rfs_token');
        return response;
    }

}