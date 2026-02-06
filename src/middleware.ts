import { auth } from "@/auth";

export default auth((req) => {
  if (!req.auth) {
    const loginUrl = new URL("/login", req.url);
    return Response.redirect(loginUrl);
  }
});

export const config = {
  matcher: [
    "/projects/:path*",
    "/api/projects/:path*",
    "/api/upload/:path*",
    "/api/liveblocks-auth/:path*",
  ],
};
