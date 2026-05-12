import { SignInButton, SignUpButton } from "@clerk/nextjs";

export default function HomePage() {
  return (
 <div className="min-h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-4xl font-bold">
        Sports League Platform
      </h1>

      <p className="text-gray-600">
        Join teams, create tournaments, play locally.
      </p>

      <div className="flex gap-4">
        <SignInButton className="px-4 py-2 bg-black text-white rounded">
            Sign in
        </SignInButton>

        <SignUpButton className="px-4 py-2 border rounded">
            Sign up
        </SignUpButton>
      </div>
    </div>
  );
}
