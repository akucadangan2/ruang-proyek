import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Path asli yang butuh login. Route group seperti "(dashboard)" TIDAK
// muncul di URL, jadi harus dicek pakai path aslinya, bukan "/dashboard".
const PRIVATE_PATHS = ["/dashboard", "/products", "/orders", "/team", "/settings"];

function isPrivatePath(pathname: string) {
  return PRIVATE_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
}

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  // API route punya auth check sendiri (return 401 JSON) — jangan diredirect,
  // nanti fetch() dari client malah nerima HTML halaman login, bukan JSON.
  if (request.nextUrl.pathname.startsWith("/api")) {
    return response;
  }

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
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && isPrivatePath(request.nextUrl.pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return response;
}
