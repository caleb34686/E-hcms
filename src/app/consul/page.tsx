"use client";

import React, { useState } from "react";

export default function ConsulPage() {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [msg, setMsg] = useState("");
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !notes) {
      setMsg("Please enter an operation header and activity details.");
      setIsError(true);
      return;
    }

    setIsSubmitting(true);
    setMsg("");

    try {
      // POST directly to the internal Next.js backend endpoint we just created
      const response = await fetch("/api/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          activity_notes: notes,
          assigned_duties: "General Diplomatic Duties",
          completed_tasks: "Completed Scheduled Engagements",
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Server error occurred");
      }

      setMsg("Activity log entry successfully saved to database!");
      setIsError(false);
      setTitle("");
      setNotes("");
    } catch (err: any) {
      setMsg(err.message || "Failed to stream log to local backend server.");
      setIsError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-xl border border-slate-300 shadow-xl p-8 space-y-6">
        <div className="border-b border-slate-200 pb-4">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Honorary Consul Activity Logbook</h2>
          <p className="text-sm font-semibold text-slate-500 mt-1">Authorized Entry Panel - Data streams securely to MFDA records.</p>
        </div>

        {msg && (
          <div className={`p-4 rounded-lg text-sm font-bold border ${isError ? "bg-red-50 text-red-700 border-red-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"}`}>
            {msg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2">Engagement Summary Header *</label>
            <input 
              type="text" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              className="w-full text-base p-3 bg-slate-50 border-2 border-slate-300 text-slate-950 rounded-lg font-medium focus:outline-none focus:border-slate-900 focus:bg-white placeholder-slate-400" 
              placeholder="e.g., Bilateral Trade Briefing with Swiss Delegates" 
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2">Operational Activity Log Details *</label>
            <textarea 
              rows={5} 
              value={notes} 
              onChange={e => setNotes(e.target.value)} 
              className="w-full text-base p-3 bg-slate-50 border-2 border-slate-300 text-slate-950 rounded-lg font-medium focus:outline-none focus:border-slate-900 focus:bg-white placeholder-slate-400" 
              placeholder="Provide complete text details of assigned duties completed..."
            ></textarea>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full sm:w-auto bg-slate-900 text-white font-bold text-sm px-6 py-3 rounded-lg hover:bg-slate-800 transition-all shadow-md disabled:bg-slate-400 uppercase tracking-wider"
          >
            {isSubmitting ? "Saving Entry..." : "Commit Entry to Log"}
          </button>
        </form>
      </div>
    </div>
  );
}
