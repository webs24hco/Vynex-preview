import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

// ============================================================
// POST /api/appointments/[id]/checkout - Process payment for an appointment
// ============================================================
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const businessId = user.id;
    const { id } = await params;

    const body = await request.json();
    const { paymentMethod, amountPaid } = body;

    // Validation
    if (!paymentMethod || !["Cash", "Card", "Transfer"].includes(paymentMethod)) {
      return NextResponse.json(
        { error: "paymentMethod must be one of: Cash, Card, Transfer" },
        { status: 400 }
      );
    }

    if (amountPaid === undefined || amountPaid === null || amountPaid <= 0) {
      return NextResponse.json(
        { error: "amountPaid must be a positive number" },
        { status: 400 }
      );
    }

    // Find the appointment and ensure it belongs to this business
    const appointment = await prisma.appointment.findFirst({
      where: {
        id,
        businessId,
      },
      include: {
        client: true,
      },
    });

    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }

    if (appointment.status === "COMPLETED") {
      return NextResponse.json(
        { error: "Appointment is already completed" },
        { status: 400 }
      );
    }

    // Calculate pending balance (if partially paid)
    const pendingDifference = appointment.totalAmount - amountPaid;
    const additionalPending = pendingDifference > 0 ? pendingDifference : 0;

    // Use a transaction to update both the appointment and the client
    const [updatedAppointment, updatedClient] = await prisma.$transaction([
      // Update appointment status to COMPLETED
      prisma.appointment.update({
        where: { id },
        data: {
          status: "COMPLETED",
        },
        include: {
          client: true,
          services: { include: { service: true } },
        },
      }),
      // Update client's totalSpent and pendingBalance
      prisma.client.update({
        where: { id: appointment.clientId },
        data: {
          totalSpent: { increment: amountPaid },
          pendingBalance: { increment: additionalPending },
        },
      }),
    ]);

    return NextResponse.json(
      {
        appointment: updatedAppointment,
        client: updatedClient,
        payment: {
          method: paymentMethod,
          amountPaid,
          totalAmount: appointment.totalAmount,
          pendingBalance: additionalPending,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing checkout:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
