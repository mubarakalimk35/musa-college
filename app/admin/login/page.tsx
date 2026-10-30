"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Thoda delay - brute force slow
    await new Promise(r => setTimeout(r, 600));

    if (password === "Musa@123") {
      localStorage.setItem("isAdminLoggedIn", "true");
      localStorage.setItem("adminLoginTime", Date.now().toString());
      router.push("/admin");
    } else {
      setError("Wrong Password!");
      setPassword("");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4">
      <form onSubmit={handleLogin} className="bg-white p-6 md:p-8 rounded-[20px] shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-gray-100 w-full max-w-[360px]">
        <div className="text-center">
          <div className="w-12 h-12 bg-[#0d1b34] rounded-xl flex items-center justify-center text-white font-black mx-auto">M</div>
          <h1 className="text-[20px] md:text-2xl font-black mt-3 tracking-tight">Admin Login</h1>
          <p className="text-[11px] md:text-xs text-gray-400 mt-1 font-medium">Govt. Musa College Quetta</p>
        </div>

        <div className="mt-6">
          <input 
            type="password" 
            value={password} 
            onChange={e=>setPassword(e.target.value)} 
            placeholder="Enter password" 
            className="w-full px-4 py-3.5 rounded-xl bg-[#f8fafc] border border-gray-200 focus:border-black focus:bg-white outline-none text-[14px] transition" 
            required 
            autoFocus
          />
          {error && <p className="text-[11px] text-red-500 font-bold mt-2 ml-1">{error}</p>}
        </div>

        <button disabled={loading} className="w-full mt-4 bg-[#0d1b34] text-white py-3.5 rounded-xl font-black text-[14px] hover:bg-black active:scale-[0.98] transition disabled:opacity-60">
          {loading ? "Checking..." : "Login →"}
        </button>

        <p className="text-[10px] text-center text-gray-300 mt-4">Secure Admin Access Only</p>
      </form>
    </div>
  );
}