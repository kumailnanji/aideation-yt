import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";
import { $users } from "./lib/db/schema";
import { db } from "./lib/db";
import { eq } from "drizzle-orm";



// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware
export default authMiddleware({
  publicRoutes: ["/project/:path*", "/", "api/webhook"],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
