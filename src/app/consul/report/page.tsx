"use client";

import React, { useState } from "react";

export default function QuarterlyReportWizard() {
  const [quarter, setQuarter] = useState<number>(4);
  const [year, setYear] = useState<number>(2026);
  const [achievements, setAchievements] = useState("");
  const [challenges, setChallenges] = useState("");
  const [engagements, setEngagements] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ text: "", isError: false });

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!achievements || !challenges || !engagements) {
      setFeedback({ text: "Please complete all mandatory section text fields before transmission.", isError: true });
      return;
    }

    setIsSubmitting(true);
    setFeedback({ text: "", isError: false });

    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quarter,
          year,
          achievements,
          challenges,
          diplomatic_engagements: engagements
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Filing transaction aborted by data host.");
      }

      setFeedback({ 
        text: `Success! Digital quarterly report verified. System token issued: ${result.data.receiptToken}`, 
        isError: false 
      });
      
      setAchievements(""); 
      setChallenges(""); 
      setEngagements("");
    } catch (err: any) {
      setFeedback({ text: err.message || "Filing pipeline delivery link broke.", isError: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-white rounded-xl border border-slate-300 shadow-xl p-8 space-y-6">
        
        <div className="border-b-2 border-slate-200 pb-4">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Digital Quarterly Report Wizard</h2>
          <p className="text-sm font-semibold text-slate-500 mt-1">Filing Terminal — Direct secure packet upload transmission to MFDA oversight loops.</p>
        </div>

        {feedback.text && (
          <div className={`p-4 rounded-lg text-sm font-bold border ${feedback.isError ? "bg-red-50 text-red-700 border-red-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"}`}>
            {feedback.text}
          </div>
        )}

        <form onSubmit={handleReportSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">Target Filing Quarter</label>
              <select value={quarter} onChange={(e) => setQuarter(Number(e.target.value))} className="w-full text-base p-3 bg-slate-50 border-2 border-slate-300 text-slate-950 rounded-lg font-bold focus:outline-none focus:border-slate-900 focus:bg-white">
                <option value={1}>Q1 Administrative Review</option>
                <option value={2}>Q2 Mid-Year Audit</option>
                <option value={3}>Q3 Operational Audit</option>
                <option value={4}>Q4 Year-End Summary</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">Filing Year Tracker</label>
              <input type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} className="w-full text-base p-3 bg-slate-50 border-2 border-slate-300 text-slate-950 rounded-lg font-bold focus:outline-none focus:border-slate-900 focus:bg-white" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2">1. Major Bilateral Diplomatic Achievements *</label>
            <textarea rows={4} value={achievements} onChange={(e) => setAchievements(e.target.value)} className="w-full text-base p-3 bg-slate-50 border-2 border-slate-300 text-slate-950 rounded-lg font-medium focus:outline-none focus:border-slate-900 focus:bg-white placeholder-slate-400" placeholder="Detail milestone briefings, signed partnerships, and high-level structural clearances achieved..."></textarea>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2">2. Operational Constraints & Mission Hurdles *</label>
            <textarea rows={4} value={challenges} onChange={(e) => setChallenges(e.target.value)} className="w-full text-base p-3 bg-slate-50 border-2 border-slate-300 text-slate-950 rounded-lg font-medium focus:outline-none focus:border-slate-900 focus:bg-white placeholder-slate-400" placeholder="Outline local jurisdiction constraints, consular logistical gaps, or cross-border blockades met..."></textarea>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2">3. Diaspora Engagement & Welfare Security Records *</label>
            <textarea rows={4} value={engagements} onChange={(e) => setEngagements(e.target.value)} className="w-full text-base p-3 bg-slate-50 border-2 border-slate-300 text-slate-950 rounded-lg font-medium focus:outline-none focus:border-slate-900 focus:bg-white placeholder-slate-400" placeholder="Log status updates regarding community rescue assist cases, passport queries processing, and state delegate assemblies..."></textarea>
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full sm:w-auto bg-slate-900 text-white font-black text-sm px-6 py-3 rounded-lg hover:bg-slate-800 disabled:bg-slate-400 shadow-md uppercase tracking-wider transition-all">
            {isSubmitting ? "Transmitting Cryptographic Files..." : "Transmit Digital Quarterly Report"}
          </button>
        </form>
      </div>
    </div>
  );
}
