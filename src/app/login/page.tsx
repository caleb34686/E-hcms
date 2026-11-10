"use client";

import React, { useState } from "react";

export default function SecurityLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ text: "", isError: false });

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setFeedback({ text: "Please enter both your username and password.", isError: true });
      return;
    }

    setLoading(true);
    setFeedback({ text: "", isError: false });

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Authentication failed.");

      setFeedback({ text: `Access Granted! Redirecting to secure panel...`, isError: false });
      
      setTimeout(() => {
        if (data.role === "HQ_ADMIN") window.location.href = "/hq";
        else if (data.role === "HEAD_OF_MISSION") window.location.href = "/ambassador";
        else if (data.role === "PROTOCOL_OFFICER") window.location.href = "/protocol";
        else if (data.role === "PCS_APPROVER") window.location.href = "/pcs";
        else window.location.href = "/consul";
      }, 1000);

    } catch (err: any) {
      setFeedback({ text: err.message || "Invalid diplomatic credentials.", isError: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-6 bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: "linear-gradient(rgba(15, 23, 42, 0.85), rgba(15, 23, 42, 0.85)), url('/kenya-coat-of-arms.png')" }}
    >
      {/* High-Contrast Glassmorphism Container Panel Box */}
      <div className="w-full max-w-md bg-white/95 backdrop-blur-md rounded-xl border-2 border-slate-300 shadow-2xl p-8 space-y-6 relative z-10">
        
        <div className="border-b-2 border-slate-200 pb-4 text-center flex flex-col items-center gap-3">
          <img 
            src="/kenya-coat-of-arms.png" 
            alt="National Emblem" 
            className="h-20 w-auto object-contain drop-shadow-md"
          />
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">e-HCMS Security Gateway</h2>
            <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wider">Authorized Personnel Only</p>
          </div>
        </div>

        {feedback.text && (
          <div className={`p-3 text-xs font-black rounded-lg border text-center ${
            feedback.isError ? "bg-red-50 text-red-700 border-red-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"
          }`}>
            {feedback.text}
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-1">Username / Email Address</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)}
              className="w-full text-base p-3 bg-slate-50 border-2 border-slate-300 text-slate-950 rounded-lg font-bold focus:outline-none focus:border-slate-900 focus:bg-white"
              placeholder="e.g., admin_hq" 
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-800 mb-1">Secret Access Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-base p-3 bg-slate-50 border-2 border-slate-300 text-slate-950 rounded-lg font-bold focus:outline-none focus:border-slate-900 focus:bg-white"
              placeholder="••••••••••••" 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-slate-900 text-white font-black p-3 rounded-lg shadow-md text-sm uppercase tracking-wider border-2 border-slate-950 hover:bg-slate-800 transition-all"
          >
            {loading ? "Verifying Credentials..." : "Authenticate Session"}
          </button>
        </form>

        <div className="bg-slate-50 p-4 border border-slate-200 rounded-lg text-[11px] text-slate-500 font-medium space-y-1">
          <p className="font-bold text-slate-700 border-b pb-1 mb-1">💡 Sandbox Credentials (Password: Secure2026!):</p>
          <p>• HQ Admin ➡️ <code className="font-bold text-slate-800">admin_hq</code></p>
          <p>• Protocol Dept ➡️ <code className="font-bold text-slate-800">protocol_user</code></p>
          <p>• PCS Approver ➡️ <code className="font-bold text-slate-800">pcs_boss</code></p>
        </div>

      </div>
    </div>
  );
}
