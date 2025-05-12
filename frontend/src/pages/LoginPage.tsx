import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const nav = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      nav("/");
    } catch {
      setError("Invalid credentials");
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="max-w-md mx-auto bg-white p-6 rounded shadow"
    >
      <h2 className="text-xl mb-4">Login</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <label className="block mb-2">
        Email
        <input
          type="email"
          className="border w-full p-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>
      <label className="block mb-4">
        Password
        <input
          type="password"
          className="border w-full p-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Login
      </button>
    </form>
  );
}
