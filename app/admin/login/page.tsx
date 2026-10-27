"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const router = useRouter();
  const handleLogin = (e:any) => {
    e.preventDefault();
    if(password === "Musa@123"){
      localStorage.setItem("isAdminLoggedIn", "true");
      router.push("/admin");
    } else {
      alert("Wrong Password! Musa@123");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-xl border w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center">Admin Login</h1>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Musa@123" className="w-full mt-6 px-4 py-3 rounded-xl bg-gray-50 border" required />
        <button className="w-full mt-4 bg-slate-900 text-white py-3 rounded-xl font-bold">Login →</button>
      </form>
    </div>
  );
}