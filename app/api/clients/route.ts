import { NextRequest, NextResponse } from "next/server";
// import prisma from "@/lib/prisma"; // Uncomment when DB is connected

// ============================================================
// GET /api/clients - List all clients for a business
// ============================================================
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get("businessId");

    if (!businessId) {
      return NextResponse.json(
        { error: "businessId is required" },
        { status: 400 }
      );
    }

    // TODO: Replace mock data with Prisma query
    // const clients = await prisma.client.findMany({
    //   where: { businessId },
    //   orderBy: { createdAt: "desc" },
    // });

    const mockClients = [
      {
        id: "cl_mock_001",
        businessId,
        name: "Sarah Johnson",
        phone: "+1 (555) 123-4567",
        email: "sarah@example.com",
        notes: "Prefers natural lash style",
        pendingBalance: 0,
        totalSpent: 450.0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "cl_mock_002",
        businessId,
        name: "Michael Chen",
        phone: "+1 (555) 987-6543",
        email: "michael@example.com",
        notes: "Allergic to certain adhesives",
        pendingBalance: 75.0,
        totalSpent: 320.0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    return NextResponse.json({ clients: mockClients }, { status: 200 });
  } catch (error) {
    console.error("Error fetching clients:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ============================================================
// POST /api/clients - Create a new client
// ============================================================
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { businessId, name, phone, email, notes } = body;

    if (!businessId || !name) {
      return NextResponse.json(
        { error: "businessId and name are required" },
        { status: 400 }
      );
    }

    // TODO: Replace with Prisma create
    // const client = await prisma.client.create({
    //   data: { businessId, name, phone, email, notes },
    // });

    const mockClient = {
      id: `cl_${Date.now()}`,
      businessId,
      name,
      phone: phone || null,
      email: email || null,
      notes: notes || null,
      pendingBalance: 0,
      totalSpent: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({ client: mockClient }, { status: 201 });
  } catch (error) {
    console.error("Error creating client:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
