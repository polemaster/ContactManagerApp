import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { register } = useAuth();
  const nav = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(email, password);
      nav("/");
    } catch {
      setError("Registration failed");
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="max-w-md mx-auto bg-white p-6 rounded shadow"
    >
      <h2 className="text-xl mb-4">Register</h2>
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
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Register
      </button>
    </form>
  );
}
