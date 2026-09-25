const users = new Map();
const referrals = new Map();

function generateCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export async function POST(request) {
  try {
    const body = await request.json();

    // Register a participant
    if (body.action === "register") {
      const phone = String(body.phone || "").trim();

      if (!phone) {
        return Response.json(
          { error: "Phone number is required." },
          { status: 400 }
        );
      }

      // Return existing referral code if already registered
      if (users.has(phone)) {
        const existing = users.get(phone);

        return Response.json({
          refCode: existing.refCode,
          count: referrals.get(existing.refCode) || 0,
        });
      }

      const refCode = generateCode();

      users.set(phone, {
        refCode,
        createdAt: Date.now(),
      });

      referrals.set(refCode, 0);

      return Response.json({
        refCode,
        count: 0,
      });
    }

    // Record a referral visit
    if (body.action === "visit") {
      const ref = String(body.ref || "").trim();

      if (!ref || !referrals.has(ref)) {
        return Response.json({
          success: false,
        });
      }

      const current = referrals.get(ref) || 0;

      referrals.set(ref, current + 1);

      return Response.json({
       success: true,
        count: current + 1,
      });
    }

    return Response.json(
      { error: "Invalid action." },
      { status: 400 }
    );
  } catch {
    return Response.json(
      { error: "Invalid request." },
      { status: 400 }
    );
  }
}￼Enter
