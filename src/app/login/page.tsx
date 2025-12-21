"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useStore from "@/store/store";
import { signIn } from "@/lib/auth";
import { useAuth } from "@/components/AuthProvider";
import { colorScheme } from "@/utils/colorUtils";

const Login = () => {
  const { isDarkMode } = useStore();
  const router = useRouter();
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  if (user) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await signIn(email, password);

    if (error) {
      setError(error.message);
    } else {
      router.push("/dashboard");
    }

    setLoading(false);
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 ${colorScheme.background.secondary
        }`}
    >
      <div
        className={`w-full max-w-md p-8 rounded-lg shadow-lg ${colorScheme.background.primary}`}
      >
        <h1
          className={`text-2xl font-bold text-center mb-6 ${colorScheme.text.primary}`}
        >
          Admin Login
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={`w-full px-3 py-2 rounded-md border ${colorScheme.input} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>

          <div>
            <label
              className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={`w-full px-3 py-2 rounded-md border ${colorScheme.input} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>

          {error && (
            <div
              className={`p-3 rounded-md text-sm ${isDarkMode
                ? "bg-red-900 text-red-200"
                : "bg-red-100 text-red-700"
                }`}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
