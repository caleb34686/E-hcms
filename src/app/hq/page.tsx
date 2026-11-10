"use client";

import React, { useEffect, useState } from "react";

interface ExpiryProfile {
  id: string;
  full_name: string;
  jurisdictions: string;
  days_remaining: number;
  contract_end_date: string;
}

export default function HQPortalPage() {
  const [criticalContracts, setCriticalContracts] = useState<ExpiryProfile[]>([]);
  const [counters, setCounters] = useState({ warning: 0, intermediate: 0, critical: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState("");

  const loadHQMetrics = async () => {
    try {
      const response = await fetch("/api/profiles");
      const data: ExpiryProfile[] = await response.json();
      setCriticalContracts(Array.isArray(data) ? data : []);

      let warning = 0;   
      let intermediate = 0; 
      let critical = 0;     

      if (Array.isArray(data)) {
        data.forEach(item => {
          if (item.days_remaining <= 30) critical++;
          else if (item.days_remaining <= 60) intermediate++;
          else if (item.days_remaining <= 90) warning++;
        });
      }

      setCounters({ warning, intermediate, critical });
    } catch (error) {
      console.error("HQ Metrics Load Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHQMetrics();
  }, []);

  const handleAuthorizeRenewal = async (consulId: string) => {
    setActionMessage("Processing official cryptographic contract extension authorization...");
    try {
      const res = await fetch("/api/renewals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ consulId }),
      });
      const result = await res.json();
      
      if (res.ok) {
        setActionMessage(result.message);
        // Force refresh table models to recalculate day differentials immediately
        await loadHQMetrics();
      } else {
        setActionMessage(`Authorization aborted: ${result.error}`);
      }
    } catch {
      setActionMessage("Gateway network communication link loss error.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6 flex flex-col items-center space-y-6">
      <div className="w-full max-w-5xl bg-white rounded-xl border border-slate-300 shadow-xl p-8 space-y-6">
        
        <div className="border-b-2 border-slate-200 pb-4">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">DGPDA Headquarters Control Terminal</h2>
          <p className="text-sm font-semibold text-slate-500 mt-1">Macro Deployment Tracking — Multi-stage contract expiration watchdog alerts.</p>
        </div>

        {actionMessage && (
          <div className="p-4 text-xs font-black bg-slate-900 text-amber-400 rounded-lg border-2 border-slate-950 animate-fade-in shadow-inner">
            🔔 SYSTEM LOG: {actionMessage}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white border-2 border-slate-300 p-5 rounded-xl shadow-md border-l-8 border-amber-500">
            <span className="block text-xs font-black text-slate-500 uppercase tracking-wider">90-Day Expiry Warnings</span>
            <span className="block text-4xl font-black text-slate-900 mt-1">
              {isLoading ? "..." : String(counters.warning).padStart(2, "0")}
            </span>
          </div>
          <div className="bg-white border-2 border-slate-300 p-5 rounded-xl shadow-md border-l-8 border-orange-500">
            <span className="block text-xs font-black text-slate-500 uppercase tracking-wider">60-Day Expiry Flags</span>
            <span className="block text-4xl font-black text-slate-900 mt-1">
              {isLoading ? "..." : String(counters.intermediate).padStart(2, "0")}
            </span>
          </div>
          <div className="bg-white border-2 border-slate-300 p-5 rounded-xl shadow-md border-l-8 border-red-600">
            <span className="block text-xs font-black text-slate-500 uppercase tracking-wider">30-Day Critical Alarms</span>
            <span className="block text-4xl font-black text-slate-900 mt-1">
              {isLoading ? "..." : String(counters.critical).padStart(2, "0")}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-black text-slate-800 text-base uppercase tracking-wide border-b pb-2">Contract Expiry Warning Queue</h3>
          
          {isLoading && <p className="text-sm font-bold text-slate-600 animate-pulse bg-slate-50 p-4 rounded border">Running automated date differential audit scans...</p>}

          {!isLoading && criticalContracts.map((profile) => (
            <div key={profile.id} className="border-2 border-slate-200 rounded-lg p-5 bg-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-slate-400 transition-all shadow-sm">
              <div className="space-y-1">
                <span className="font-black text-slate-950 text-lg block">{profile.full_name}</span>
                <span className="text-slate-500 font-bold block text-sm">Jurisdiction Assignment: {profile.jurisdictions}</span>
                <span className="text-slate-700 font-extrabold block text-sm">
                  Contract Expiration Limit: <span className="underline">{String(profile.contract_end_date).substring(0,10)}</span>
                </span>
              </div>
              <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                <span className={`px-3 py-1.5 rounded-md text-xs font-black border-2 ${
                  profile.days_remaining <= 30 ? "bg-red-100 text-red-900 border-red-400 animate-pulse" : profile.days_remaining <= 60 ? "bg-orange-100 text-orange-900 border-orange-400" : "bg-amber-100 text-amber-900 border-amber-400"
                }`}>
                  {profile.days_remaining} Days Left
                </span>
                <button 
                  onClick={() => handleAuthorizeRenewal(profile.id)}
                  className="bg-slate-900 text-white font-black text-xs px-4 py-2.5 rounded-lg hover:bg-slate-800 shadow hover:shadow-lg transition-colors uppercase tracking-wide whitespace-nowrap border border-slate-950"
                >
                  Authorize Renewal
                </button>
              </div>
            </div>
          ))}

          {!isLoading && criticalContracts.length === 0 && (
            <p className="text-sm text-slate-500 font-bold italic text-center py-6 bg-slate-50 border rounded-lg">
              No active contracts currently falling within warning thresholds.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
