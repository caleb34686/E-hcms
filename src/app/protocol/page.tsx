"use client";

import React, { useEffect, useState } from "react";

export default function ProtocolDeptPage() {
  const [profiles, setProfiles] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/profiles").then(res => res.json()).then(setProfiles).catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 p-6 flex flex-col items-center">
      <div className="w-full max-w-5xl bg-white rounded-xl border border-slate-300 shadow-xl p-8 space-y-6">
        <div className="border-b-2 border-slate-200 pb-4">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Protocol Department Dashboard</h2>
          <p className="text-sm font-semibold text-slate-500 mt-1">Jurisdiction & Credentials Scope Management Terminal.</p>
        </div>

        <div className="space-y-4">
          {profiles.map(p => (
            <div key={p.id} className="border-2 border-slate-200 p-5 rounded-lg bg-slate-50 flex justify-between items-center text-sm font-bold text-slate-900">
              <div>
                <span className="text-lg font-black block text-slate-950">{p.full_name}</span>
                <span className="text-slate-500 block text-xs mt-0.5">Assigned Cities: {p.cities_of_operation}</span>
              </div>
              <span className="bg-slate-900 text-amber-400 px-3 py-1.5 rounded border border-slate-950 uppercase text-xs tracking-wider">
                📍 {p.jurisdictions}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
