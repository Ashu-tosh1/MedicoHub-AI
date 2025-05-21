/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSignIn } from "@clerk/nextjs";
import { Toaster, toast } from "sonner";
import Image from "next/image";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Button } from "@/Components/ui/button";

interface FormData {
  email: string;
  password: string;
}

export default function DoctorLoginPage() {
  const router = useRouter();
  const { signIn, isLoaded, setActive } = useSignIn();

  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isLoaded) {
      toast.error("Authentication system not loaded");
      return;
    }

    setIsLoading(true);

    try {
      const result = await signIn.create({
        identifier: formData.email,
        password: formData.password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        toast.success("Login successful!");
        router.push("/doctor/dashboard");
      } else {
        toast.error("Authentication incomplete");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error?.errors?.[0]?.message || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 overflow-hidden">
      <Toaster position="top-center" />

      {/* Background blobs */}
      <div className="absolute top-0 -left-10 w-96 h-96 bg-purple-300 rounded-full opacity-30 blur-3xl z-0 animate-pulse" />
      <div className="absolute bottom-0 -right-10 w-80 h-80 bg-blue-300 rounded-full opacity-30 blur-3xl z-0 animate-pulse" />

      {/* Main Container */}
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
          <h2 className="text-3xl font-semibold mb-2">Welcome Doctor</h2>
          <p className="text-sm text-white/80 text-center px-6">
            Access your dashboard and start managing patient consultations.
          </p>
        </div>

        {/* Right Panel - Login Form */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center bg-white/80">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-indigo-800 drop-shadow">
              Doctor Login
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-gray-700">Email</Label>
              <Input
                type="email"
                name="email"
                id="email"
                placeholder="doctor@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="bg-white"
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
                className="bg-white"
              />
                      </div>
                      

            <Button
              type="submit"
              className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition duration-200"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Not a doctor?{" "}
            <a
              href="/sign-in"
              className="text-indigo-600 hover:text-indigo-800 font-semibold"
            >
              Go to Patient Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
