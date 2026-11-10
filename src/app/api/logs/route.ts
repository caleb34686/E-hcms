// /src/app/api/logs/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST Endpoint: /api/logs - Saves active Consul logbook entry submissions down to SQLite
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, activity_notes, assigned_duties, completed_tasks } = body;

    // 1. Fallback verification: Check for mandatory submission metrics
    if (!title || !activity_notes) {
      return NextResponse.json(
        { error: "Validation Failure: Title and Activity Notes are required fields." },
        { status: 400 }
      );
    }

    // 2. Fetch the first seeded consul record from the database to map the relationship link cleanly
    const fallbackConsul = await prisma.honoraryConsulProfile.findFirst();
    if (!fallbackConsul) {
      return NextResponse.json(
        { error: "Configuration Error: No active Honorary Consul profiles found to map this log entry." },
        { status: 404 }
      );
    }

    // 3. Execute mutation query pushing form data directly into the database via Prisma
    const newLogEntry = await prisma.workLogEntry.create({
      data: {
        consulId: fallbackConsul.id,
        title,
        activityNotes: activity_notes,
        assignedDuties: assignedDuties || "General Diplomatic Duties",
        completedTasks: completedTasks || "Completed Scheduled Engagements",
        isLocked: false, // Audit-locked flag defaults to false upon initialization
      },
    });

    return NextResponse.json(
      { message: "Logbook entry successfully written to database records", data: newLogEntry },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal Database Pipeline Write Failure", details: error.message },
      { status: 500 }
    );
  }
}
