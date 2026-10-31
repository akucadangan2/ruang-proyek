import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Path asli yang butuh login. Route group "(dashboard)" tidak muncul di URL.
const PRIVATE_PATHS = ["/dashboard", "/products", "/orders", "/team", "/settings"];

function isPrivatePath(pathname: string) {
  return PRIVATE_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

export async function updateSession(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Halaman publik dan API tidak perlu cek login.
  // Landing page, katalog, dan checkout tetap jalan walau Supabase bermasalah.
  if (pathname.startsWith("/api") || !isPrivatePath(pathname)) {
    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  // Batasi 5 detik supaya tidak menggantung sampai function dimatikan Vercel
  let user: unknown = null;
  try {
    const result = await Promise.race([
      supabase.auth.getUser(),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 5000)),
    ]);
    user = result?.data.user ?? null;
  } catch {
    user = null;
  }

  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return response;
}