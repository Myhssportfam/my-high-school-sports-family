import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../lib/firebase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleEmailLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    if (!auth) {
      setError("Firebase Authentication is not available.");
      return;
    }

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email.trim(), password);
      await router.push("/profile");
    } catch (loginError: any) {
      switch (loginError?.code) {
        case "auth/invalid-credential":
        case "auth/user-not-found":
        case "auth/wrong-password":
          setError("The email or password is incorrect.");
          break;
        case "auth/too-many-requests":
          setError("Too many attempts. Please wait and try again.");
          break;
        case "auth/invalid-email":
          setError("Please enter a valid email address.");
          break;
        default:
          setError("Unable to sign in. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setMessage("");

    if (!auth) {
      setError("Firebase Authentication is not available.");
      return;
    }

    try {
      setLoading(true);

      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: "select_account",
      });

      await signInWithPopup(auth, provider);
      await router.push("/profile");
    } catch (googleError: any) {
      if (googleError?.code === "auth/popup-closed-by-user") {
        setError("Google sign-in was cancelled.");
      } else if (googleError?.code === "auth/popup-blocked") {
        setError("Your browser blocked the Google sign-in window.");
      } else {
        setError("Google sign-in was unsuccessful. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Enter your email first, then select Forgot password.");
      return;
    }

    if (!auth) {
      setError("Firebase Authentication is not available.");
      return;
    }

    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email.trim());
      setMessage("Password-reset instructions were sent to your email.");
    } catch (resetError: any) {
      if (resetError?.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else {
        setError("Unable to send the reset email. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-3xl border border-white/10 bg-white shadow-2xl lg:grid-cols-2">
          <section className="hidden bg-gradient-to-br from-blue-950 via-blue-800 to-red-700 p-12 lg:flex lg:flex-col lg:justify-between">
            <div>
              <div className="mb-8 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-3xl shadow-xl">
                🏆
              </div>

              <h1 className="max-w-lg text-5xl font-black leading-tight">
                My High School Sports Family
              </h1>

              <p className="mt-5 max-w-lg text-lg text-blue-100">
                Connect with athletes, coaches, families and sports communities
                across the country.
              </p>
            </div>

            <div className="space-y-3 text-sm text-blue-100">
              <p>✓ Build your athlete profile</p>
              <p>✓ Post highlights and sports updates</p>
              <p>✓ Connect with recruiters and coaches</p>
              <p>✓ Join your state sports community</p>
            </div>
          </section>

          <section className="p-6 text-slate-900 sm:p-10 lg:p-12">
            <div className="mx-auto max-w-md">
              <Link
                href="/"
                className="mb-8 inline-flex items-center text-sm font-semibold text-blue-700 hover:text-blue-900"
              >
                ← Back to home
              </Link>

              <div className="mb-8">
                <p className="text-sm font-bold uppercase tracking-widest text-red-600">
                  Welcome back
                </p>

                <h2 className="mt-2 text-3xl font-black text-slate-950">
                  Sign in to your account
                </h2>

                <p className="mt-2 text-slate-600">
                  Enter the sports community and continue building your profile.
                </p>
              </div>

              {error && (
                <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {error}
                </div>
              )}

              {message && (
                <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                  {message}
                </div>
              )}

              <form onSubmit={handleEmailLogin} className="space-y-5">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-bold text-slate-800"
                  >
                    Email address
                  </label>

                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="text-sm font-bold text-slate-800"
                    >
                      Password
                    </label>

                    <button
                      type="button"
                      onClick={handlePasswordReset}
                      className="text-sm font-bold text-blue-700 hover:text-blue-900"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Enter your password"
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-20 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-500 hover:text-slate-900"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-blue-700 px-5 py-3 font-black text-white shadow-lg transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Signing in..." : "Sign in"}
                </button>
              </form>

              <div className="my-6 flex items-center gap-4">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-sm font-semibold text-slate-400">OR</span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white px-5 py-3 font-bold text-slate-800 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="text-xl font-black text-blue-600">G</span>
                Continue with Google
              </button>

              <p className="mt-8 text-center text-sm text-slate-600">
                Don&apos;t have an account?{" "}
                <Link
                  href="/signup"
                  className="font-black text-red-600 hover:text-red-700"
                >
                  Create an account
                </Link>
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}