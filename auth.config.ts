import type { NextAuthConfig } from 'next-auth'

export const authConfig: NextAuthConfig = {
  trustHost: true,
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
        token.emailVerified = (user as any).emailVerified
      }
      if (trigger === 'update' && session?.emailVerified !== undefined) {
        token.emailVerified = session.emailVerified
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = (token.id as string) || token.sub!
        ;(session.user as any).role = token.role
        ;(session.user as any).emailVerified = token.emailVerified
      }
      return session
    },
    authorized({ auth }) {
      return !!auth?.user
    },
  },
  providers: [],
}
