// /src/app/api/reports/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { quarter, year, achievements, challenges, diplomatic_engagements } = body;

    // 1. Mandatory validation schema checklist
    if (!achievements || !challenges || !diplomatic_engagements) {
      return NextResponse.json(
        { error: "Validation Failure: Please fill in all required section criteria fields before submission." },
        { status: 400 }
      );
    }

    // 2. Fetch active consul profile link reference
    const activeConsul = await prisma.honoraryConsulProfile.findFirst();
    if (!activeConsul) {
      return NextResponse.json(
        { error: "Configuration Error: No active Honorary Consul profiles found to link this report." },
        { status: 404 }
      );
    }

    // 3. Mount transaction payload record straight into database layout using Prisma Client mapping
    const newReport = await prisma.quarterlyReport.create({
      data: {
        consulId: activeConsul.id,
        quarter: Number(quarter),
        year: Number(year),
        status: "SUBMITTED",
        submissionTimestamp: new Date(),
        receiptToken: `EHCMS-REC-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
        achievements,
        challenges,
        diplomaticEngagements: diplomatic_engagements,
      },
    });

    return NextResponse.json(
      { message: "Digital report successfully locked and transmitted to HQ matrices.", data: newReport },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal Database Pipeline Transaction Failure", details: error.message },
      { status: 500 }
    );
  }
}
