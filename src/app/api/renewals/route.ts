// /src/app/api/renewals/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST Endpoint: /api/renewals - Authorizes an official 1-year contract extension
export async function POST(request: Request) {
  try {
    const { consulId } = await request.json();

    if (!consulId) {
      return NextResponse.json({ error: "Missing Consul Identifier Code." }, { status: 400 });
    }

    // 1. Fetch current profile targets to calculate lifecycle extensions safely
    const currentProfile = await prisma.honoraryConsulProfile.findUnique({
      where: { id: consulId },
    });

    if (!currentProfile) {
      return NextResponse.json({ error: "Consular profile records missing from system host." }, { status: 404 });
    }

    // 2. Compute a new contract expiration boundary extension date exactly 1 year out
    const oldEndDate = new Date(currentProfile.contractEndDate);
    const newEndDate = new Date(oldEndDate.setFullYear(oldEndDate.getFullYear() + 1));

    // 3. Execute atomized transactional queries updating values and logging audit trails simultaneously
    const updatedProfile = await prisma.$transaction(async (tx) => {
      // Step A: Patch expiry boundary timestamp attributes
      const profile = await tx.honoraryConsulProfile.update({
        where: { id: consulId },
        data: { contractEndDate: newEndDate },
      });

      // Step B: Write a secure, unalterable historical log entry into the Renewal Audit Trail table
      await tx.renewalWorkflowLog.create({
        data: {
          consulId,
          previousContractEndDate: currentProfile.contractEndDate,
          newContractEndDate: newEndDate,
          approvedByUserId: currentProfile.userId, // Map approval role trace links
          authorizationNotes: "Official 12-Month Diplomatic Contract Extension granted by DGPDA HQ Directorate.",
        },
      });

      return profile;
    });

    return NextResponse.json({ 
      success: true, 
      message: `Contract for ${updatedProfile.fullName} successfully extended to ${newEndDate.toISOString().substring(0, 10)}`,
      data: updatedProfile 
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Database transaction update failure", details: error.message }, { status: 500 });
  }
}
