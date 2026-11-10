// /src/app/api/auth/login/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    // 1. Structural security validation: Block arbitrary entries
    if (password !== "Secure2026!") {
      return NextResponse.json({ error: "Access Denied: Invalid password combination." }, { status: 401 });
    }
   // Inside src/app/api/auth/login/route.ts update the role assignment block:
let assignedRole = "";
if (username === "admin_hq") assignedRole = "HQ_ADMIN";
else if (username === "ambassador_post") assignedRole = "HEAD_OF_MISSION";
else if (username === "consul_geneva") assignedRole = "HONORARY_CONSUL";
else if (username === "protocol_user") assignedRole = "PROTOCOL_OFFICER";  // <-- ADDED
else if (username === "pcs_boss") assignedRole = "PCS_APPROVER";          // <-- ADDED
else {
  return NextResponse.json({ error: "Unknown credentials." }, { status: 401 });
}

    const response = NextResponse.json({ success: true, role: assignedRole });

    // 3. Set a fallback secure cookie to state memory space
    response.cookies.set("ehcms_session_role", assignedRole, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 2, // 2-Hour active clearance lifespan window
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Authentication system failure" }, { status: 500 });
  }
}
