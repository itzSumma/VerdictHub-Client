import { NextResponse } from "next/server";
import { auth } from "./lib/auth";
import { headers } from "next/headers";

export async function proxy(request) {
   const session = await auth.api.getSession({
    headers: await headers()
   }) 

   if(!session){
    const signInUrl = new URL('/signin', request.url);
    signInUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
   }

}

export const config = {
    matcher: ['/dashboard/:path*']
}
