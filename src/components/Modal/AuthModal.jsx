'use client';

/* eslint-disable */
import { useState, useEffect } from "react";
import { X, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { useDispatch } from "react-redux";
import { setAuthStatus, setUser } from "@/store/slices/authSlice";
import { toastError, toastSuccess } from "@/lib/toast";
import { authService } from "@/services/api/endpoints";
import { auth, parseAuthSession } from "@/lib/auth";
import { GoogleLogin } from '@react-oauth/google';

const AuthModal = ({ isOpen, onClose, defaultTab = "signin" }) => {
    const [activeTab, setActiveTab] = useState(defaultTab);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const dispatch = useDispatch();
    const [signInData, setSignInData] = useState({ email: "", password: "" });
    const [signUpData, setSignUpData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [forgotEmail, setForgotEmail] = useState("");
    const [forgotSent, setForgotSent] = useState(false);
    const [forgotMessage, setForgotMessage] = useState("");

    useEffect(() => {
        if (isOpen) {
            setActiveTab(defaultTab);
            setSignInData({ email: "", password: "" });
            setSignUpData({ firstName: "", lastName: "", email: "", password: "", confirmPassword: "" });
            setForgotEmail("");
            setForgotSent(false);
            setForgotMessage("");
        }
    }, [isOpen, defaultTab]);

    const handleSwitchTab = (tab) => {
        setIsAnimating(true);
        if (tab !== "forgot") {
            setForgotSent(false);
            setForgotMessage("");
        }
        if (tab === "forgot" && signInData.email && !forgotEmail) {
            setForgotEmail(signInData.email);
        }
        setTimeout(() => {
            setActiveTab(tab);
            setIsAnimating(false);
        }, 200);
    };

    const handleSignIn = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!signInData.email.trim() || !signInData.password.trim()) {
            toastError("Please enter both email and password");
            return false;
        }

        setIsLoading(true);
        
        try {
            const response = await authService.login({
                email: signInData.email,
                password: signInData.password,
            });

            if (response?.data?.success) {
                const session = parseAuthSession(response);
                if (!session) {
                    toastError("Login failed");
                    return false;
                }

                auth.login(session.accessToken, session.refreshToken, session.user);
                dispatch(setAuthStatus(true));
                if (session.user) dispatch(setUser(session.user));

                toastSuccess("Login successful!");
                onClose();
            } else {
                toastError(response?.data?.message || "Login failed");
            }
        } catch (error) {
            toastError(error?.response?.data?.message || "Invalid credentials");
        } finally {
            setIsLoading(false);
        }
        
        return false;
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!signUpData.firstName.trim() || !signUpData.lastName.trim() || !signUpData.email.trim() || !signUpData.password.trim()) {
            toastError("Please fill in all fields");
            return;
        }
        
        if (signUpData.password !== signUpData.confirmPassword) {
            toastError("Passwords do not match");
            return;
        }

        setIsLoading(true);
        
        try {
            const response = await authService.register({
                firstName: signUpData.firstName.trim(),
                lastName: signUpData.lastName.trim(),
                email: signUpData.email.trim(),
                password: signUpData.password,
            });

            if (response?.data?.success) {
                const session = parseAuthSession(response);
                if (session) {
                    auth.login(session.accessToken, session.refreshToken, session.user);
                    dispatch(setAuthStatus(true));
                    if (session.user) dispatch(setUser(session.user));
                    toastSuccess("Registration successful!");
                    onClose();
                } else {
                    toastSuccess("Registration successful! Please sign in.");
                    handleSwitchTab("signin");
                }
                setSignUpData({ firstName: "", lastName: "", email: "", password: "", confirmPassword: "" });
            } else {
                toastError(response?.data?.message || "Registration failed");
            }
        } catch (error) {
            toastError(error?.response?.data?.message || "Registration failed");
        } finally {
            setIsLoading(false);
        }
        
        return false;
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!forgotEmail.trim()) {
            toastError("Please enter your email address");
            return false;
        }

        setIsLoading(true);
        try {
            const response = await authService.forgotPassword(forgotEmail.trim());
            if (response?.data?.success) {
                const payload = response?.data?.data ?? response?.data;
                const message =
                    payload?.message ||
                    "If an account exists for this email, a password reset link has been sent.";
                setForgotMessage(message);
                setForgotSent(true);
                toastSuccess(message);
            } else {
                toastError(response?.data?.message || "Failed to send reset link");
            }
        } catch (error) {
            toastError(error?.response?.data?.message || "Failed to send reset link");
        } finally {
            setIsLoading(false);
        }

        return false;
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        setIsLoading(true);
        try {
            const { credential } = credentialResponse;
            const response = await authService.googleLogin(credential);

            if (response?.data?.success) {
                const session = parseAuthSession(response);
                if (!session) {
                    toastError("Google Login failed");
                    return;
                }

                auth.login(session.accessToken, session.refreshToken, session.user);
                dispatch(setAuthStatus(true));
                if (session.user) dispatch(setUser(session.user));

                toastSuccess("Google Login successful!");
                onClose();
            } else {
                toastError(response?.data?.message || "Google Login failed");
            }
        } catch (error) {
            toastError(error?.response?.data?.message || "Google Login failed");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleError = () => {
        toastError("Google Login Failed");
    };

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-[1000] flex cursor-pointer items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
            onClick={onClose}
        >
            <div 
                className="relative my-auto w-full max-w-[400px] cursor-default rounded-2xl border border-line bg-surface shadow-premium transition-all duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="absolute top-4 right-4 z-20">
                    <button
                        type="button"
                        onClick={onClose}
                        className="cursor-pointer rounded-lg p-1.5 text-muted transition-colors hover:bg-surface-2 hover:text-ink"
                        aria-label="Close"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <div className={`p-6 pt-10 transition-all duration-200 ease-in-out ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>

                    <div className="mb-6 text-center">
                        <h2 className="mb-1.5 text-xl font-semibold text-ink">
                            {activeTab === "signin"
                                ? "Sign in to DigiMart"
                                : activeTab === "signup"
                                  ? "Create your account"
                                  : "Reset password"}
                        </h2>
                        <p className="mx-auto max-w-[85%] text-xs leading-relaxed text-muted">
                            {activeTab === "signin"
                                ? "Access your orders, favorites, and saved details."
                                : activeTab === "signup"
                                  ? "Join DigiMart to save favorites and checkout faster."
                                  : "Enter your email and we'll send you a reset link."}
                        </p>
                    </div>

                    {activeTab !== "forgot" && (
                    <>
                    {/* Social Login Buttons */}
                    <div className="flex flex-col gap-2.5 mb-6">
                        <div className="flex justify-center w-full">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={handleGoogleError}
                                theme="filled_blue"
                                shape="pill"
                                width="100%"
                                size="large"
                            />
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="relative mb-6 flex items-center gap-3">
                        <div className="h-px flex-1 bg-line" />
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted">Or</span>
                        <div className="h-px flex-1 bg-line" />
                    </div>
                    </>
                    )}

                    {/* Forms */}
                    {activeTab === "forgot" ? (
                        forgotSent ? (
                            <div className="space-y-4 text-center">
                                <p className="text-sm leading-relaxed text-body">
                                    {forgotMessage}
                                </p>
                                <button
                                    type="button"
                                    onClick={() => handleSwitchTab("signin")}
                                    className="btn-primary h-10 w-full cursor-pointer text-sm"
                                >
                                    Back to Login
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleForgotPassword} className="space-y-4">
                                <div className="space-y-1">
                                    <label className="ml-0.5 text-xs font-medium text-body">Email</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted transition-colors group-focus-within:text-brand" />
                                        <input
                                            type="email"
                                            value={forgotEmail}
                                            onChange={(e) => setForgotEmail(e.target.value)}
                                            placeholder="Enter your email"
                                            className="field h-10 w-full pl-9 pr-3 text-sm"
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="btn-primary h-10 w-full cursor-pointer text-sm disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    {isLoading ? (
                                        <span className="flex items-center gap-2">
                                            <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Sending...
                                        </span>
                                    ) : "Send Reset Link"}
                                </button>
                            </form>
                        )
                    ) : activeTab === "signin" ? (
                        <form onSubmit={handleSignIn} className="space-y-4">
                            <div className="space-y-1">
                                <label className="ml-0.5 text-xs font-medium text-body">Email</label>
                                <div className="relative group">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-brand transition-colors" />
                                    <input
                                        type="email"
                                        value={signInData.email}
                                        onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                                        placeholder="Enter your email"
                                        className="field h-10 w-full pl-9 pr-3 text-sm"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="ml-0.5 text-xs font-medium text-body">Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-brand transition-colors" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={signInData.password}
                                        onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                                        placeholder="Enter password"
                                        className="field h-10 w-full pl-9 pr-9 text-sm"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted transition-colors hover:text-ink"
                                    >
                                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => handleSwitchTab("forgot")}
                                className="ml-auto block cursor-pointer text-xs font-medium text-brand hover:text-brand-hover"
                            >
                                Forgot Password?
                            </button>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="btn-primary h-10 w-full cursor-pointer text-sm disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Logging in...
                                    </span>
                                ) : "Login"}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleSignUp} className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="ml-0.5 text-xs font-medium text-body">First Name</label>
                                    <div className="relative group">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-brand transition-colors" />
                                        <input
                                            type="text"
                                            value={signUpData.firstName}
                                            onChange={(e) => setSignUpData({ ...signUpData, firstName: e.target.value })}
                                            placeholder="First name"
                                            className="field h-10 w-full pl-9 pr-3 text-sm"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="ml-0.5 text-xs font-medium text-body">Last Name</label>
                                    <div className="relative group">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-brand transition-colors" />
                                        <input
                                            type="text"
                                            value={signUpData.lastName}
                                            onChange={(e) => setSignUpData({ ...signUpData, lastName: e.target.value })}
                                            placeholder="Last name"
                                            className="field h-10 w-full pl-9 pr-3 text-sm"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="ml-0.5 text-xs font-medium text-body">Email</label>
                                <div className="relative group">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-brand transition-colors" />
                                    <input
                                        type="email"
                                        value={signUpData.email}
                                        onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                                        placeholder="Enter your email"
                                        className="field h-10 w-full pl-9 pr-3 text-sm"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="ml-0.5 text-xs font-medium text-body">Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-brand transition-colors" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={signUpData.password}
                                        onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                                        placeholder="Create Password"
                                        className="field h-10 w-full pl-9 pr-9 text-sm"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted transition-colors hover:text-ink"
                                    >
                                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="ml-0.5 text-xs font-medium text-body">Confirm Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-brand transition-colors" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={signUpData.confirmPassword}
                                        onChange={(e) => setSignUpData({ ...signUpData, confirmPassword: e.target.value })}
                                        placeholder="Confirm Password"
                                        className="field h-10 w-full pl-9 pr-9 text-sm"
                                        required
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="btn-primary mt-2 h-10 w-full cursor-pointer text-sm disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Creating Account...
                                    </span>
                                ) : "Sign Up"}
                            </button>
                        </form>
                    )}

                    {/* Footer Toggle */}
                    <div className="mt-5 border-t border-line pt-4 text-center">
                        <p className="text-xs text-muted">
                            {activeTab === "forgot" ? (
                                <>
                                    Remember your password?
                                    <button
                                        onClick={() => handleSwitchTab("signin")}
                                        className="ml-1.5 cursor-pointer font-medium text-brand hover:text-brand-hover"
                                    >
                                        Login
                                    </button>
                                </>
                            ) : activeTab === "signin" ? (
                                <>
                                    Didn&apos;t have an account?
                                    <button
                                        onClick={() => handleSwitchTab("signup")}
                                        className="ml-1.5 cursor-pointer font-medium text-brand hover:text-brand-hover"
                                    >
                                        Sign Up
                                    </button>
                                </>
                            ) : (
                                <>
                                    Already have an account?
                                    <button
                                        onClick={() => handleSwitchTab("signin")}
                                        className="ml-1.5 cursor-pointer font-medium text-brand hover:text-brand-hover"
                                    >
                                        Login
                                    </button>
                                </>
                            )}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
