"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { Input } from "@mui/joy";

const Login = () => {
  // Focus Input
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <>
      <div className="h-full flex items-center justify-center p-4">
        <div
          className="max-w-md w-full space-y-6 p-6 sm:p-8 rounded-2xl shadow-lg border border-solid border-color"
          style={{ backgroundColor: "var(--cl-bg-dropdown)" }}
        >
          <div className="text-center">
            <div className="logo">
              <Image
                src="/images/logo.png"
                priority
                alt="CIAI"
                width={80}
                height={31}
                className="mx-auto light-logo"
              />
              <Image
                src="/images/logo-white.png"
                priority
                alt="CIAI"
                width={80}
                height={31}
                className="mx-auto dark-logo"
              />
            </div>
            <h2 className="mt-6 text-3xl font-medium">Sign in</h2>
          </div>
          <form className="mt-8 space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-mail h-5 w-5 text-gray-400"
                    >
                      <rect width={20} height={16} x={2} y={4} rx={2} />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </div>
                  <Input
                    type="text"
                    className="w-fullfocus:outline-none input"
                    placeholder="Your email"
                    sx={{ pl: 5 }}
                    slotProps={{
                      input: {
                        ref: inputRef,
                        autoFocus: true,
                      },
                    }}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-lock h-5 w-5 text-gray-400"
                    >
                      <rect width={18} height={11} x={3} y={11} rx={2} ry={2} />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                  <Input
                    type="password"
                    className="w-full focus:outline-none input"
                    placeholder="Enter at least 8+ characters"
                    sx={{ pl: 5 }}
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between">
              <div className="flex items-center mr-4 mb-2">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  readOnly
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm">
                  Remember me
                </label>
              </div>
              <div className="text-sm mb-2">
                <a
                  className="font-medium"
                  href="/forgot-password"
                  style={{ color: "var(--cl-primary-70)" }}
                >
                  Forgot your password?
                </a>
              </div>
            </div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 btn-color"
              style={{ marginTop: "16px" }}
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-log-in h-5 w-5"
                >
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1={15} x2={3} y1={12} y2={12} />
                </svg>
              </span>
              Sign in
            </button>
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span
                  className="px-2 text-gray-500"
                  style={{
                    backgroundColor: "var(--cl-bg-dropdown)",
                    color: "var(--cl-neutral-90)",
                  }}
                >
                  Or continue with
                </span>
              </div>
            </div>
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              <svg
                width="20"
                height="20"
                viewBox="-3 0 262 262"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="xMidYMid"
              >
                <path
                  d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                  fill="#4285F4"
                />
                <path
                  d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                  fill="#34A853"
                />
                <path
                  d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
                  fill="#FBBC05"
                />
                <path
                  d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                  fill="#EB4335"
                />
              </svg>
              Sign in with Google
            </button>
          </form>
          <p className="mt-4 text-center text-sm">
            Not a member?
            <a
              className="font-medium pl-1"
              style={{ color: "var(--cl-primary-70)" }}
              href="/html/register"
            >
              Sign up now
            </a>
          </p>
        </div>
      </div>
    </>
  );
};
export default Login;
