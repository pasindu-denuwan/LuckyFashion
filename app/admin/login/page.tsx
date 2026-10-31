"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Lock, Mail, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/admin/overview";
  const errorParam = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isResetMode, setIsResetMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(
    errorParam === "unauthorized_profile"
      ? "Your account does not have admin permissions."
      : ""
  );
  const [successMessage, setSuccessMessage] = useState("");

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const supabase = createClient();

      if (isResetMode) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/admin/reset-password`,
        });
        if (error) throw error;
        setSuccessMessage("Password reset email sent. Please check your inbox.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push(redirectTo);
        router.refresh();
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Authentication failed.";
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-lg border-lucky-borderLight">
      <CardHeader>
        <CardTitle className="text-xl">
          {isResetMode ? "Reset Password" : "Admin Sign In"}
        </CardTitle>
        <CardDescription>
          {isResetMode
            ? "Enter your authorized admin email to receive a recovery link."
            : "Enter your credentials to manage products, quotes, and content."}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {errorMessage && (
          <div className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-red-50 text-red-700 text-sm border border-red-200">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3 mb-4 rounded-lg bg-emerald-50 text-emerald-700 text-sm border border-emerald-200">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-lucky-dark uppercase mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-lucky-mutedText absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@luckyfashion.com"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-lucky-borderLight focus:outline-none focus:ring-2 focus:ring-lucky-blue focus:border-transparent"
              />
            </div>
          </div>

          {!isResetMode && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold text-lucky-dark uppercase">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setIsResetMode(true);
                    setErrorMessage("");
                  }}
                  className="text-xs text-lucky-blue hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-lucky-mutedText absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-lucky-borderLight focus:outline-none focus:ring-2 focus:ring-lucky-blue focus:border-transparent"
                />
              </div>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full mt-2"
            variant="default"
          >
            {loading
              ? "Authenticating..."
              : isResetMode
              ? "Send Recovery Link"
              : "Sign In to Admin"}
          </Button>

          {isResetMode && (
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setIsResetMode(false);
                setErrorMessage("");
              }}
              className="w-full text-xs"
            >
              Return to Sign In
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-lucky-offwhite p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-lucky-mutedText hover:text-lucky-blue transition mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Public Site
          </Link>
          <h1 className="text-3xl font-bold font-heading text-lucky-dark">Lucky Fashion</h1>
          <p className="text-xs tracking-wider uppercase font-semibold text-lucky-mutedText mt-1">
            Manufacturing Administration Portal
          </p>
        </div>

        <Suspense fallback={<div className="p-8 text-center text-sm text-lucky-mutedText">Loading portal...</div>}>
          <AdminLoginForm />
        </Suspense>
      </div>
    </div>
  );
}
