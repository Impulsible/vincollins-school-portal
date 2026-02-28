// src/lib/auth/config.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { createClient } from "@/lib/supabase/client";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const supabase = createClient();
        const { data, error } = await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password,
        });

        if (error || !data.user) return null;

        // Fetch profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('first_name, last_name, role')
          .eq('id', data.user.id)
          .single();

        const userEmail = data.user.email || `${data.user.id}@vincollins.edu.ng`;
        const displayName = profile 
          ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || userEmail.split('@')[0]
          : userEmail.split('@')[0] || 'User';

        return {
          id: data.user.id,
          email: userEmail,
          name: displayName,
          firstName: profile?.first_name || '',
          lastName: profile?.last_name || '',
          role: profile?.role || 'student',
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.firstName = token.firstName as string;
        session.user.lastName = token.lastName as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
};