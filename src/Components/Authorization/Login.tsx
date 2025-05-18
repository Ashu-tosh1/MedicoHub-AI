"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSignIn } from "@clerk/nextjs";
import { Toaster, toast } from "sonner";
import Image from "next/image";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";

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

      {/* Animated Background Blobs */}
      <div className="absolute top-0 -left-10 w-[500px] h-[500px] bg-purple-300 rounded-full opacity-30 blur-3xl z-0 animate-pulse"></div>
      <div className="absolute bottom-0 -right-10 w-[400px] h-[400px] bg-blue-300 rounded-full opacity-30 blur-3xl z-0 animate-pulse"></div>

      <div className="relative z-10 flex flex-col md:flex-row bg-white/30 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden max-w-5xl w-full m-4 border border-white/40">
        
        {/* Left Panel */}
        <div className="hidden md:flex md:w-1/2 flex-col justify-center items-center p-10 bg-gradient-to-tr from-indigo-500 to-purple-600 text-white">
          <Image
            src="/Doctor.png"
            width={260}
            height={260}
            alt="Doctor Illustration"
            className="mb-6 drop-shadow-xl"
          />
          <h2 className="text-3xl font-semibold mb-2">Welcome Back to MedicoHub</h2>
          <p className="text-sm text-white/80 text-center px-6">
            Your one-stop platform for All the Medical Services
          </p>
          <p className="text-sm text-white/80 text-center px-6">
           Integerated With AI for your better Health
          </p>
        </div>

        {/* Right Panel - Form */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center bg-white/80">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-indigo-800 drop-shadow">
              Login
            </h1>
          
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-gray-700">Email</Label>
              <Input
                type="email"
                name="email"
                id="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-gray-700">Password</Label>
              <Input
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition duration-200"
            >
              Login
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <a href="/register" className="text-indigo-600 hover:text-indigo-800 font-semibold">
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
