'use client';

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Eye, EyeOff, ChevronRight } from "lucide-react";
import { authService } from "@/services/api/endpoints";
import { toastError, toastSuccess } from "@/lib/toast";

const ResetPasswordForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      toastError("Invalid or missing reset link. Please request a new one.");
      return;
    }
    if (!password.trim() || password.length < 6) {
      toastError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      toastError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.resetPassword(token, password);
      if (response?.data?.success) {
        const payload = response?.data?.data ?? response?.data;
        toastSuccess(payload?.message || "Password reset successfully");
        router.push("/");
      } else {
        toastError(response?.data?.message || "Failed to reset password");
      }
    } catch (error) {
      toastError(error?.response?.data?.message || "Failed to reset password. Link may have expired.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="card mx-auto max-w-md p-8 text-center">
        <h1 className="text-xl font-semibold text-ink">Invalid reset link</h1>
        <p className="mt-2 text-sm text-muted">
          This password reset link is missing or expired. Request a new one from the sign-in page.
        </p>
        <Link href="/" className="btn-primary mt-6 inline-flex h-11 px-6 text-sm">
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="card mx-auto max-w-md p-8">
      <h1 className="text-xl font-semibold text-ink">Reset your password</h1>
      <p className="mt-1 text-sm text-muted">Enter a new password for your account.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-ink">New password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              className="field h-11 w-full pl-10 pr-10"
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-ink">Confirm password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="field h-11 w-full pl-10 pr-3"
              required
              minLength={6}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary h-11 w-full text-sm disabled:opacity-70"
        >
          {isLoading ? "Updating password..." : "Update password"}
        </button>
      </form>

      <Link
        href="/"
        className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand hover:underline"
      >
        Back to home
        <ChevronRight className="h-4 w-4" />
      </Link>
    </div>
  );
};

const ResetPasswordPage = () => (
  <div className="min-h-screen bg-canvas py-10">
    <div className="container-page">
      <Suspense
        fallback={
          <div className="card mx-auto max-w-md animate-pulse p-8">
            <div className="h-6 w-1/2 rounded bg-surface-2" />
            <div className="mt-4 h-11 w-full rounded bg-surface-2" />
            <div className="mt-4 h-11 w-full rounded bg-surface-2" />
          </div>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </div>
  </div>
);

export default ResetPasswordPage;
