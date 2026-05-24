import { NextRequest, NextResponse } from "next/server";
// import prisma from "@/lib/prisma"; // Uncomment when DB is connected

// ============================================================
// GET /api/appointments - List appointments for a business
// ============================================================
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get("businessId");
    const date = searchParams.get("date"); // Optional filter by date
    const status = searchParams.get("status"); // Optional filter by status

    if (!businessId) {
      return NextResponse.json(
        { error: "businessId is required" },
        { status: 400 }
      );
    }

    // TODO: Replace mock data with Prisma query
    // const appointments = await prisma.appointment.findMany({
    //   where: {
    //     businessId,
    //     ...(date && { date: new Date(date) }),
    //     ...(status && { status: status as any }),
    //   },
    //   include: {
    //     client: true,
    //     teamMember: true,
    //     services: {
    //       include: { service: true },
    //     },
    //   },
    //   orderBy: [{ date: "asc" }, { startTime: "asc" }],
    // });

    const mockAppointments = [
      {
        id: "apt_mock_001",
        businessId,
        clientId: "cl_mock_001",
        teamMemberId: null,
        date: new Date().toISOString().split("T")[0],
        startTime: "09:00",
        endTime: "10:30",
        status: "CONFIRMED",
        totalAmount: 150.0,
        notes: "First-time client, do consultation",
        client: {
          id: "cl_mock_001",
          name: "Sarah Johnson",
          phone: "+1 (555) 123-4567",
        },
        teamMember: null,
        services: [
          {
            id: "as_mock_001",
            serviceId: "svc_mock_001",
            priceAtTimeOfBooking: 85.0,
            service: { name: "Classic Full Set", duration: 90 },
          },
          {
            id: "as_mock_002",
            serviceId: "svc_mock_003",
            priceAtTimeOfBooking: 65.0,
            service: { name: "Lash Tint", duration: 30 },
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "apt_mock_002",
        businessId,
        clientId: "cl_mock_002",
        teamMemberId: "tm_mock_001",
        date: new Date().toISOString().split("T")[0],
        startTime: "11:00",
        endTime: "11:45",
        status: "PENDING",
        totalAmount: 45.0,
        notes: null,
        client: {
          id: "cl_mock_002",
          name: "Michael Chen",
          phone: "+1 (555) 987-6543",
        },
        teamMember: {
          id: "tm_mock_001",
          name: "Jessica",
          role: "Lash Tech",
        },
        services: [
          {
            id: "as_mock_003",
            serviceId: "svc_mock_002",
            priceAtTimeOfBooking: 45.0,
            service: { name: "Lash Fill", duration: 45 },
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    // Apply optional filters on mock data
    let filtered = mockAppointments;
    if (status) {
      filtered = filtered.filter((a) => a.status === status.toUpperCase());
    }

    return NextResponse.json({ appointments: filtered }, { status: 200 });
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
    const body = await request.json();
    const {
      businessId,
      clientId,
      teamMemberId,
      date,
      startTime,
      endTime,
      notes,
      serviceIds, // Array of { serviceId, price }
    } = body;

    // Validation
    if (!businessId || !clientId || !date || !startTime || !endTime) {
      return NextResponse.json(
        {
          error:
            "businessId, clientId, date, startTime, and endTime are required",
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

    // TODO: Replace with Prisma transaction
    // const appointment = await prisma.$transaction(async (tx) => {
    //   const apt = await tx.appointment.create({
    //     data: {
    //       businessId,
    //       clientId,
    //       teamMemberId: teamMemberId || null,
    //       date: new Date(date),
    //       startTime,
    //       endTime,
    //       notes: notes || null,
    //       totalAmount: serviceIds.reduce((sum, s) => sum + s.price, 0),
    //       services: {
    //         create: serviceIds.map((s) => ({
    //           serviceId: s.serviceId,
    //           priceAtTimeOfBooking: s.price,
    //         })),
    //       },
    //     },
    //     include: {
    //       client: true,
    //       teamMember: true,
    //       services: { include: { service: true } },
    //     },
    //   });
    //   return apt;
    // });

    const totalAmount = serviceIds.reduce(
      (sum: number, s: { price: number }) => sum + s.price,
      0
    );

    const mockAppointment = {
      id: `apt_${Date.now()}`,
      businessId,
      clientId,
      teamMemberId: teamMemberId || null,
      date,
      startTime,
      endTime,
      status: "PENDING",
      totalAmount,
      notes: notes || null,
      services: serviceIds.map(
        (s: { serviceId: string; price: number }, i: number) => ({
          id: `as_${Date.now()}_${i}`,
          serviceId: s.serviceId,
          priceAtTimeOfBooking: s.price,
        })
      ),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({ appointment: mockAppointment }, { status: 201 });
  } catch (error) {
    console.error("Error creating appointment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
