"use client";

import React, { useEffect, useState } from "react";

interface ConsulProfile {
  id: string;
  full_name: string;
  cities_of_operation: string;
  jurisdictions: string;
  days_remaining: number;
}

export default function AmbassadorPortalPage() {
  const [profiles, setProfiles] = useState<ConsulProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProfiles() {
      try {
        const response = await fetch("/api/profiles");
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to load profiles");
        setProfiles(data);
      } catch (err: any) {
        setError(err.message || "Failed to connect to local database engine.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchProfiles();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 p-6 flex flex-col items-center">
      <div className="w-full max-w-5xl bg-white rounded-xl border border-slate-300 shadow-xl p-8 space-y-6">
        
        <div className="border-b-2 border-slate-200 pb-4">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Head of Mission Dashboard</h2>
          <p className="text-sm font-semibold text-slate-500 mt-1">Ambassador Review Panel — Real-time tracking of active Honorary Consuls.</p>
        </div>

        {isLoading && <p className="text-sm font-bold text-slate-700 animate-pulse bg-slate-50 p-4 border rounded-lg">Streaming live diplomatic tracking streams...</p>}
        {error && <p className="text-sm font-bold text-red-700 bg-red-50 p-4 rounded-lg border border-red-200">{error}</p>}
        
        {!isLoading && !error && (
          <div className="overflow-x-auto border-2 border-slate-200 rounded-lg">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-900 text-amber-400 font-black uppercase text-xs tracking-wider border-b-2 border-slate-900">
                  <th className="p-4">Consul Officer</th>
                  <th className="p-4">Jurisdiction Scope</th>
                  <th className="p-4">Operational Cities</th>
                  <th className="p-4">Contract Health Status</th>
                  <th className="p-4">Evaluation Action</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-slate-200 text-slate-900 font-bold bg-white">
                {profiles.map((profile) => (
                  <tr key={profile.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-black text-slate-950 text-base">{profile.full_name}</td>
                    <td className="p-4 font-extrabold text-slate-700">{profile.jurisdictions}</td>
                    <td className="p-4 font-medium text-slate-600">{profile.cities_of_operation}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-md text-xs font-black border-2 ${
                        profile.days_remaining <= 60 
                          ? "bg-amber-100 text-amber-900 border-amber-400" 
                          : "bg-emerald-100 text-emerald-900 border-emerald-400"
                      }`}>
                        {profile.days_remaining} Days Remaining
                      </span>
                    </td>
                    <td className="p-4">
                      <button className="bg-slate-900 text-white font-black text-xs px-3 py-2 rounded hover:bg-slate-800 transition-all uppercase tracking-wide">
                        Review Logs
                      </button>
                    </td>
                  </tr>
                ))}
                {profiles.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-slate-500 font-bold italic bg-slate-50">
                      No active consular profiles discovered in the system database templates. Run seed data.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
