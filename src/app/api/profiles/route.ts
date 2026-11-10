import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // 1. Fetch active consul profiles from your local Prisma SQLite data store
    const profiles = await prisma.honoraryConsulProfile.findMany({
      orderBy: {
        contractEndDate: "asc", // Prioritize imminent contract expiry borders
      },
    });

    // 2. Map through the rows and calculate remaining days dynamically on the server
    const formattedProfiles = profiles.map((profile) => {
      const today = new Date();
      const expiry = new Date(profile.contractEndDate);
      const diffTime = expiry.getTime() - today.getTime();
      const daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

      return {
        id: profile.id,
        full_name: profile.fullName,
        cities_of_operation: profile.citiesOfOperation,
        jurisdictions: profile.jurisdictions,
        contract_end_date: profile.contractEndDate.toISOString().split("T")[0],
        days_remaining: daysRemaining,
      };
    });

    // 3. Return the formatted array cleanly as a valid JSON package with cache-busting headers
    return new NextResponse(JSON.stringify(formattedProfiles), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });

  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({ error: "Database Fetch Failure", details: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
