"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSignIn } from "@clerk/nextjs";
import { Toaster, toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const { signIn, isLoaded } = useSignIn();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isLoaded) return;

    try {
      await signIn.create({ identifier: formData.email, password: formData.password });
      toast.success("Login successful! Redirecting...");
      setTimeout(() => router.push("/"), 500);
    } catch (error) {
      toast.error("Invalid credentials. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 overflow-hidden">
      <Toaster />

      {/* Background Blobs */}
      <div className="absolute top-0 -left-10 w-[500px] h-[500px] bg-purple-300 rounded-full opacity-20 blur-3xl animate-pulse z-0"></div>
      <div className="absolute bottom-0 -right-10 w-[400px] h-[400px] bg-blue-300 rounded-full opacity-20 blur-3xl animate-pulse z-0"></div>

      <div className="relative z-10 w-[90vw] h-[90vh] flex shadow-2xl rounded-3xl overflow-hidden backdrop-blur-md bg-white/30 border border-white/50">
        {/* Left Side - Doctor Image */}
        <div className="w-1/2 relative flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
          <Image
            height={1}
            width={1}
            src="/Doctor.png"
            alt="Doctor Illustration"
            className="w-[450px] h-auto object-contain drop-shadow-2xl"
          />
        </div>

        {/* Right Side - Form */}
        <div className="w-1/2 flex flex-col justify-center px-14 py-10 bg-white/80 backdrop-blur-sm">
          <h1 className="text-4xl font-bold text-center text-indigo-800 drop-shadow mb-2">
            Welcome Back to MedicoHub
          </h1>
          <p className="text-center text-gray-600 text-md mb-6">
            Login to access your dashboard
          </p>

          <Card className="w-full max-w-md mx-auto bg-white rounded-xl shadow-xl p-8">
            <CardHeader>
              <CardTitle className="text-center text-2xl font-semibold text-gray-800">
                Login
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="mt-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition-all duration-200"
                >
                  Login
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-700 font-medium">
              Don’t have an account?{" "}
              <a href="/register" className="text-indigo-600 hover:underline font-semibold">
                Register
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
