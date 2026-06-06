import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import store from "@/store/store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthInit } from "./AuthInit";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const queryClient = new QueryClient();

const clientId = "798368534301-rap3d22s80ee83qbc7q33r3ab6lmbijs.apps.googleusercontent.com";

export const metadata = {
  title: "DigiMart",
  description: "Your one-stop digital marketplace",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <QueryClientProvider client={queryClient}>
          <GoogleOAuthProvider clientId={clientId}>
            <Provider store={store}>
              <ThemeProvider>
                <AuthInit />
                {children}
                <ToastContainer newestOnTop limit={3} />
              </ThemeProvider>
            </Provider>
          </GoogleOAuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
