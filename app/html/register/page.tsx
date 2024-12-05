"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Input } from "@mui/joy";

const Register = () => {
  const router = useRouter();

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
            <h2 className="mt-6 text-3xl font-medium">Sign up</h2>
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
                    className="w-full focus:outline-none input"
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
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 btn-color"
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
              Create account
            </button>
          </form>
          <p className="mt-4 text-center text-sm">
            Already have an account?
            <a
              className="font-medium pl-1"
              style={{ color: "var(--cl-primary-70)" }}
              href="/html/login"
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Register;
