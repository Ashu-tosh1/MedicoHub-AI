"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";
import axios from "axios";
import { useRegister } from "@/lib/api/Register";
import Image from "next/image";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";

export default function AuthPage() {
  const router = useRouter();
  const { mutate, isPending } = useRegister();
  const [formData, setFormData] = useState({ email: "", username: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate(formData, {
      onSuccess: () => {
        toast.success("Registration successful! Redirecting...");
        setTimeout(() => router.push("/"), 500);
      },
      onError: (error) => {
        if (axios.isAxiosError(error)) {
          const errorMessage = error.response?.data?.error || "Registration failed. Try again.";
          toast.error(errorMessage);
        } else {
          toast.error("An unexpected error occurred.");
        }
      },
    });
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 overflow-hidden">
      <Toaster />

      {/* Animated Background Blobs */}
      <div className="absolute top-0 -left-10 w-[500px] h-[500px] bg-purple-300 rounded-full opacity-30 blur-3xl z-0 animate-pulse"></div>
      <div className="absolute bottom-0 -right-10 w-[400px] h-[400px] bg-pink-300 rounded-full opacity-30 blur-3xl z-0 animate-pulse"></div>

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
          <h2 className="text-3xl font-semibold mb-2">Welcome to MedicoHub</h2>
          <p className="text-sm text-white/80 text-center px-6">
            Your one-stop platform for smarter healthcare
          </p>
        </div>

        {/* Right Panel - Form */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center bg-white/80">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-indigo-800 drop-shadow">
              Create Account
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Join us and simplify your medical journey
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="username" className="text-gray-700">Username</Label>
              <Input
                type="text"
                name="username"
                id="username"
                placeholder="johndoe"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

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
              disabled={isPending}
              className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition duration-200"
            >
              {isPending ? "Creating your account..." : "Create Account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <a href="login" className="text-indigo-600 hover:text-indigo-800 font-semibold">
              Login
            </a>
          </p>

          <p className="mt-6 text-xs text-center text-gray-500">
            By signing up, you agree to our{" "}
            <a href="#" className="underline text-indigo-500">Terms of Service</a> and{" "}
            <a href="#" className="underline text-indigo-500">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
