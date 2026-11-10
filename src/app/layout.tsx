"use client";

import Link from "next/link";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  const handleLogOut = async () => {
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (response.ok) window.location.href = "/login";
    } catch {
      alert("Authentication host unreachable.");
    }
  };

  return (
    <html lang="en">
      <body className="bg-slate-100 text-slate-900 min-h-screen antialiased flex flex-col font-sans">
        
        {/* Banner Header Block with Embedded Logo Component */}
        <header className="bg-slate-900 text-white border-b-4 border-amber-500 sticky top-0 z-50 shadow-2xl">
          <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
            
            <div className="flex items-center gap-4">
              {/* NATIVE HEADER EMBEDDED LOGO LOGIC */}
              <img 
                src="/kenya-coat-of-arms.png" 
                alt="Republic of Kenya Coat of Arms" 
                className="h-14 w-auto object-contain bg-white/10 p-1 rounded-lg border border-slate-700"
              />
              <div>
                <h1 className="text-xl font-black tracking-wider text-amber-400">
                  MINISTRY OF FOREIGN AND DIASPORA AFFAIRS
                </h1>
                <p className="text-xs text-slate-300 font-extrabold tracking-wide mt-0.5">
                  e-Honorary Consul Management System (e-HCMS Hub)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-black">
              <span className="bg-slate-800 text-amber-400 px-3 py-2 rounded-md border-2 border-slate-700 shadow-inner uppercase tracking-wider">
                DGPDA Directorate Security
              </span>
              <div className="h-6 w-0.5 bg-slate-700 hidden md:block"></div>
              <span className="text-slate-400 hidden sm:inline tracking-tight font-bold">
                Secure Prisma Data Node
              </span>
            </div>

          </div>

          <nav className="bg-slate-950 border-t border-slate-800 px-6 py-2.5">
            <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs font-black uppercase tracking-wider">
              <div className="flex flex-wrap items-center gap-2 md:gap-4">
                <Link href="/consul" className="text-slate-300 hover:text-white bg-slate-900 border-2 border-slate-800 hover:border-slate-400 px-3 py-1.5 rounded transition-all">📝 Logbook Form</Link>
                <Link href="/consul/report" className="text-slate-300 hover:text-white bg-slate-900 border-2 border-slate-800 hover:border-slate-400 px-3 py-1.5 rounded transition-all">📋 Report Wizard</Link>
                <Link href="/ambassador" className="text-slate-300 hover:text-white bg-slate-900 border-2 border-slate-800 hover:border-slate-400 px-3 py-1.5 rounded transition-all">📊 Ambassador View</Link>
                <Link href="/hq" className="text-slate-300 hover:text-white bg-slate-900 border-2 border-slate-800 hover:border-slate-400 px-3 py-1.5 rounded transition-all">🚨 HQ Watchdog Alert Terminal</Link>
              </div>
              <button onClick={handleLogOut} className="bg-red-700 hover:bg-red-600 text-white font-black px-4 py-1.5 rounded border-2 border-red-900 hover:border-red-400 transition-all uppercase tracking-wide">🔒 Log Out Session</button>
            </div>
          </nav>
        </header>

        <main className="flex-1 w-full max-w-6xl mx-auto py-2">
          {children}
        </main>

        <footer className="bg-slate-900 text-slate-400 text-center py-4 border-t-2 border-slate-800 text-[10px] font-bold uppercase tracking-wider mt-12 shadow-inner">
          &copy; 2026 MFDA HQ - Directorate General of Parliamentary and Diplomatic Affairs. Confidential Data Channel.
        </footer>

      </body>
    </html>
  );
}
