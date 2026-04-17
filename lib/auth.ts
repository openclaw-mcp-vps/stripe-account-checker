import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { hasAccessCookie } from "@/lib/lemonsqueezy";

const credentialsSchema = z.object({
  email: z.string().email(),
  accessToken: z.string().min(10)
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Email Access Token",
      credentials: {
        email: { label: "Email", type: "email" },
        accessToken: { label: "Access token", type: "password" }
      },
      authorize: async (credentials) => {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const hasAccess = await hasAccessCookie();
        if (!hasAccess) return null;

        return {
          id: parsed.data.email,
          email: parsed.data.email,
          name: "Paid User"
        };
      }
    })
  ]
});
