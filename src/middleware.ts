import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export const middleware = (req: NextRequest) => {
  const token = req.cookies.get("auth_token")?.value;
  const url = req.nextUrl.pathname;

  // ✅ PUBLIC ROUTES
  const publicRoutes = ["/", "/products", "/contact", "/login", "/signup","/not-authorized", 
  "/admin/not-authorized"];

  if (publicRoutes.includes(url) || url.startsWith("/products/")) {
    return NextResponse.next();
  }

  // 🔐 NOT LOGGED IN
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  let role: string;

  try {
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString()
    );

    role = payload.user_role; // "admin" | "customer"
    if (!role) throw new Error("No role");
  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }


  if (url.startsWith("/admin")) {
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/admin/not-authorized", req.url));
    }
  }

  if (!url.startsWith("/admin")) {
    if (role === "admin") {
      return NextResponse.redirect(new URL("/not-authorized", req.url));
    }

    if (role !== "customer") {
      return NextResponse.redirect(new URL("/not-authorized", req.url));
    }
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/((?!api|_next|static|favicon.ico|assets|images).*)"],
};
