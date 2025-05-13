import { useMutation } from "@tanstack/react-query";
import axios from "axios";

interface RegisterUserData {
  email: string;
  username: string;
  password: string;
}

interface RegisterResponse {
  message: string;
  users?: string;
}

const registerUser = async (userData: RegisterUserData): Promise<RegisterResponse> => {
  const response = await axios.post("/api/register", userData);
  return response.data;
};

export function useRegister() {
  return useMutation({
    mutationFn: registerUser, // This is required to avoid "No mutationFn found" error
  });
}
