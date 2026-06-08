'use client';

/* eslint-disable */
import { useState, useEffect } from "react";
import { X, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { useDispatch } from "react-redux";
import { setAuthStatus, setUser } from "@/store/slices/authSlice";
import { toastError, toastSuccess } from "@/utils/toast";
import { authService } from "@/api/endpoints";
import { GoogleLogin } from '@react-oauth/google';

const AuthModal = ({ isOpen, onClose, defaultTab = "signin" }) => {
    const [activeTab, setActiveTab] = useState(defaultTab);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const dispatch = useDispatch();
    const [signInData, setSignInData] = useState({ email: "", password: "" });
    const [signUpData, setSignUpData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    useEffect(() => {
        if (isOpen) {
            setActiveTab(defaultTab);
            setSignInData({ email: "", password: "" });
            setSignUpData({ name: "", email: "", password: "", confirmPassword: "" });
        }
    }, [isOpen, defaultTab]);

    const handleSwitchTab = (tab) => {
        setIsAnimating(true);
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
                const { accessToken, refreshToken } = response.data.data;
                
                // Save tokens in localStorage
                if (typeof window !== 'undefined') {
                    localStorage.setItem('accessToken', accessToken);
                    localStorage.setItem('refreshToken', refreshToken);
                }

                // Fetch user details
                try {
                    const meResponse = await authService.getCurrentUser();
                    if (meResponse?.data) {
                        dispatch(setAuthStatus(true));
                        dispatch(setUser(meResponse.data.data || meResponse.data));
                    }
                } catch {
                    dispatch(setAuthStatus(true));
                }
                
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
        
        if (!signUpData.name.trim() || !signUpData.email.trim() || !signUpData.password.trim()) {
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
                fullName: signUpData.name,
                email: signUpData.email,
                password: signUpData.password,
            });

            if (response?.data?.success) {
                toastSuccess("Registration successful! Please sign in.");
                handleSwitchTab("signin");
                setSignUpData({ name: "", email: "", password: "", confirmPassword: "" });
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

    const handleGoogleSuccess = async (credentialResponse) => {
        setIsLoading(true);
        try {
            const { credential } = credentialResponse;
            const response = await authService.googleLogin(credential);

            if (response?.data?.success) {
                const { accessToken, refreshToken } = response.data.data;
                if (typeof window !== 'undefined') {
                    localStorage.setItem('accessToken', accessToken);
                    localStorage.setItem('refreshToken', refreshToken);
                }

                try {
                    const meResponse = await authService.getCurrentUser();
                    if (meResponse?.data) {
                        dispatch(setAuthStatus(true));
                        dispatch(setUser(meResponse.data.data || meResponse.data));
                    }
                } catch {
                    dispatch(setAuthStatus(true));
                }

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
            className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto"
            onClick={onClose}
        >
            {/* Modal Container */}
            <div 
                className="relative w-full max-w-[380px] bg-white dark:bg-gray-950 rounded-3xl shadow-2xl my-auto transition-all duration-300 transform scale-100"
                onClick={(e) => e.stopPropagation()}
            >

                {/* Close & Theme Toggle */}
                <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className={`p-6 pt-10 transition-all duration-200 ease-in-out ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>

                    {/* Header */}
                    <div className="text-center mb-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1.5">
                            {activeTab === "signin" ? "Welcome Back!" : "Create Account"}
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 text-xs text-center mx-auto max-w-[80%] leading-relaxed">
                            {activeTab === "signin"
                                ? "Login to access your DigiMart account"
                                : "Join DigiMart to start shopping"}
                        </p>
                    </div>

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
                    <div className="relative flex items-center gap-3 mb-6">
                        <div className="h-px bg-gray-200 dark:bg-gray-800 flex-1" />
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Or</span>
                        <div className="h-px bg-gray-200 dark:bg-gray-800 flex-1" />
                    </div>

                    {/* Forms */}
                    {activeTab === "signin" ? (
                        <form onSubmit={handleSignIn} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-900 dark:text-gray-300 ml-0.5">Email</label>
                                <div className="relative group">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-cyan-600 transition-colors" />
                                    <input
                                        type="email"
                                        value={signInData.email}
                                        onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                                        placeholder="Enter your email"
                                        className="w-full h-10 pl-9 pr-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-600 outline-none transition-all placeholder:text-gray-400 text-sm dark:text-white"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-900 dark:text-gray-300 ml-0.5">Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-cyan-600 transition-colors" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={signInData.password}
                                        onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                                        placeholder="Enter password"
                                        className="w-full h-10 pl-9 pr-9 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-600 outline-none transition-all placeholder:text-gray-400 text-sm dark:text-white"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                    >
                                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                    </button>
                                </div>
                            </div>

                            <button type="button" className="block ml-auto text-xs font-semibold text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 translate-y-[-4px]">
                                Forgot Password?
                            </button>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-10 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg shadow-md shadow-cyan-500/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
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
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-900 dark:text-gray-300 ml-0.5">Full Name</label>
                                <div className="relative group">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-cyan-600 transition-colors" />
                                    <input
                                        type="text"
                                        value={signUpData.name}
                                        onChange={(e) => setSignUpData({ ...signUpData, name: e.target.value })}
                                        placeholder="Enter your name"
                                        className="w-full h-10 pl-9 pr-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-600 outline-none transition-all placeholder:text-gray-400 text-sm dark:text-white"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-900 dark:text-gray-300 ml-0.5">Email</label>
                                <div className="relative group">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-cyan-600 transition-colors" />
                                    <input
                                        type="email"
                                        value={signUpData.email}
                                        onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                                        placeholder="Enter your email"
                                        className="w-full h-10 pl-9 pr-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-600 outline-none transition-all placeholder:text-gray-400 text-sm dark:text-white"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-900 dark:text-gray-300 ml-0.5">Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-cyan-600 transition-colors" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={signUpData.password}
                                        onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                                        placeholder="Create Password"
                                        className="w-full h-10 pl-9 pr-9 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-600 outline-none transition-all placeholder:text-gray-400 text-sm dark:text-white"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                    >
                                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-900 dark:text-gray-300 ml-0.5">Confirm Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-cyan-600 transition-colors" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={signUpData.confirmPassword}
                                        onChange={(e) => setSignUpData({ ...signUpData, confirmPassword: e.target.value })}
                                        placeholder="Confirm Password"
                                        className="w-full h-10 pl-9 pr-9 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-600 outline-none transition-all placeholder:text-gray-400 text-sm dark:text-white"
                                        required
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-10 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg shadow-md shadow-cyan-500/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2 text-sm"
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
                    <div className="mt-5 text-center border-t border-gray-100 dark:border-gray-800 pt-4">
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                            {activeTab === "signin" ? "Didn't have an account?" : "Already have an account?"}
                            <button
                                onClick={() => handleSwitchTab(activeTab === "signin" ? "signup" : "signin")}
                                className="ml-1.5 font-bold text-cyan-600 hover:text-cyan-700 transition-all"
                            >
                                {activeTab === "signin" ? "Sign Up" : "Login"}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
