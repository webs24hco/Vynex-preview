import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";

// ============================================================
// GET /api/appointments - List appointments for the authenticated business
// ============================================================
export async function GET(request: NextRequest) {
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
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");
    const status = searchParams.get("status");
    const teamMemberId = searchParams.get("teamMemberId");

    const appointments = await prisma.appointment.findMany({
      where: {
        businessId,
        ...(date && { date: new Date(date) }),
        ...(status && { status: status.toUpperCase() as any }),
        ...(teamMemberId && { teamMemberId }),
      },
      include: {
        client: true,
        teamMember: true,
        services: {
          include: { service: true },
        },
      },
      orderBy: [{ date: "asc" }, { startTime: "asc" }],
    });

    return NextResponse.json({ appointments }, { status: 200 });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ============================================================
// POST /api/appointments - Create a new appointment
// ============================================================
export async function POST(request: NextRequest) {
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
    const body = await request.json();
    const {
      clientId,
      teamMemberId,
      date,
      startTime,
      endTime,
      notes,
      serviceIds, // Array of { serviceId, price }
    } = body;

    // Validation
    if (!clientId || !date || !startTime || !endTime) {
      return NextResponse.json(
        {
          error:
            "clientId, date, startTime, and endTime are required",
        },
        { status: 400 }
      );
    }

    if (!serviceIds || !Array.isArray(serviceIds) || serviceIds.length === 0) {
      return NextResponse.json(
        { error: "At least one service is required" },
        { status: 400 }
      );
    }

    // If teamMemberId is provided, verify it belongs to the same business
    if (teamMemberId) {
      const teamMember = await prisma.teamMember.findFirst({
        where: { id: teamMemberId, businessId },
      });
      if (!teamMember) {
        return NextResponse.json(
          { error: "Invalid team member" },
          { status: 400 }
        );
      }
    }

    const totalAmount = serviceIds.reduce(
      (sum: number, s: { serviceId: string; price: number }) => sum + s.price,
      0
    );

    const appointment = await prisma.appointment.create({
      data: {
        businessId,
        clientId,
        teamMemberId: teamMemberId || null,
        date: new Date(date),
        startTime,
        endTime,
        notes: notes || null,
        totalAmount,
        services: {
          create: serviceIds.map((s: { serviceId: string; price: number }) => ({
            serviceId: s.serviceId,
            priceAtTimeOfBooking: s.price,
          })),
        },
      },
      include: {
        client: true,
        teamMember: true,
        services: { include: { service: true } },
      },
    });

    return NextResponse.json({ appointment }, { status: 201 });
  } catch (error) {
    console.error("Error creating appointment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
