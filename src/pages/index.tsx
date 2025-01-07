// src/pages/index.tsx
import { signIn, signOut, useSession } from 'next-auth/react';

export default function Home() {
  const { data: session } = useSession();
console.log(session)
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">NextAuth with Google Login</h1>
      {!session ? (
        <button
          onClick={() => signIn('google')}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Login with Google
        </button>
      ) : (
        <div>
          <p>Welcome, {session.user?.name}</p>
          <img src={session.user?.image || ''} alt="User Image" className="w-16 h-16 rounded-full" />
          <button
            onClick={() => signOut()}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
