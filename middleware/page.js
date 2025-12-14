import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export const middleware = (req: NextRequest) => {
  const token = req.cookies.get("token")?.value;
  const user = req.cookies.get("user")?.value;
  const url = req.nextUrl.pathname;

  // PUBLIC ROUTES

  const publicRoutes = ["/","/product", "/login", "/register"];

  if (publicRoutes.includes(url)) {
    return NextResponse.next();
  }

  //NO TOKEN REDIRECT
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }


  let role;

  try {
    const userData =user?JSON.parse(user):null;
    role =userData?.role;

    if(!role){
        throw new Error("No Role Found")
    }

} catch (err) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // ADMIN ROUTES
  if (url.startsWith("/admin") && role !== "Admin") {
      return NextResponse.redirect(new URL("/not-authorized", req.url));

  }

  //USER ROUTES
  if (!url.startsWith("/admin")) {
    if (role !== "User" ) {
      return NextResponse.redirect(new URL("/admin/not-authorized", req.url));
    }
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/((?!_next|favicon.ico|api|static|assets).*)"],