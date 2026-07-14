import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// Extract the invitee UUID from a Calendly invitee URI, e.g.
// https://api.calendly.com/scheduled_events/XXX/invitees/<UUID>
function getInviteeId(uri?: string): string | null {
  if (!uri) return null;
  const parts = uri.split("/").filter(Boolean);
  return parts[parts.length - 1] || null;
}

// Verify Calendly's `Calendly-Webhook-Signature: t=<ts>,v1=<sig>` header.
// HMAC-SHA256 of `<ts>.<rawBody>` using CALENDLY_WEBHOOK_SIGNING_KEY.
function verifySignature(rawBody: string, header: string | null): boolean {
  const signingKey = process.env.CALENDLY_WEBHOOK_SIGNING_KEY;
  if (!signingKey) {
    console.warn("CALENDLY_WEBHOOK_SIGNING_KEY not set — skipping signature verification");
    return true;
  }
  if (!header) return false;

  const parts = Object.fromEntries(
    header.split(",").map((kv) => kv.trim().split("=") as [string, string])
  );
  const timestamp = parts["t"];
  const signature = parts["v1"];
  if (!timestamp || !signature) return false;

  const expected = crypto
    .createHmac("sha256", signingKey)
    .update(`${timestamp}.${rawBody}`)
    .digest("hex");

  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();

    if (!verifySignature(rawBody, req.headers.get("calendly-webhook-signature"))) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const body = JSON.parse(rawBody);
    const { event, payload } = body;

    switch (event) {
      case "invitee.created":
        await handleInviteeCreated(payload);
        break;
      case "invitee.canceled":
        await handleInviteeCanceled(payload);
        break;
      default:
        console.log("Unhandled Calendly event:", event);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Calendly webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}

async function handleInviteeCreated(payload: any) {
  const inviteeId = getInviteeId(payload?.uri);
  const email = payload?.email || null;
  const name = payload?.name || null;
  const timezone = payload?.timezone || null;

  const scheduledEvent = payload?.scheduled_event || {};
  const startTime = scheduledEvent?.start_time || null;
  const eventTitle = scheduledEvent?.name || null;
  const meetingUri = scheduledEvent?.location?.join_url || null;

  const intakeFormData = payload?.questions_and_answers || [];

  if (!inviteeId || !email) {
    console.warn("Calendly invitee missing uri/email, skipping");
    return;
  }

  const scheduledAt = startTime ? new Date(startTime) : new Date();

  try {
    const user = await prisma.user.upsert({
      where: { email },
      update: { name },
      create: { email, name, role: "CLIENT" },
    });

    const booking = await prisma.booking.upsert({
      where: { calcomId: inviteeId },
      update: {
        clientName: name || "",
        clientEmail: email,
        timezone: timezone || "",
        eventTitle: eventTitle || "",
        meetingUri: meetingUri || "",
        scheduledAt,
        status: "SCHEDULED",
      },
      create: {
        calcomId: inviteeId,
        calendlyEventId: getInviteeId(scheduledEvent?.uri),
        userId: user.id,
        clientName: name || "",
        clientEmail: email,
        timezone: timezone || "",
        eventTitle: eventTitle || "",
        meetingUri: meetingUri || "",
        scheduledAt,
        intakeFormData,
        status: "SCHEDULED",
      },
    });

    console.log("Booking created from Calendly:", booking.id);
  } catch (error) {
    console.error("Error creating Calendly booking:", error);
    throw error;
  }
}

async function handleInviteeCanceled(payload: any) {
  const inviteeId = getInviteeId(payload?.uri);
  if (!inviteeId) return;
  await prisma.booking.updateMany({
    where: { calcomId: inviteeId },
    data: { status: "CANCELLED", cancelledAt: new Date() },
  });
}
