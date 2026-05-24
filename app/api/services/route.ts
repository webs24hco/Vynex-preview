import { NextRequest, NextResponse } from "next/server";
// import prisma from "@/lib/prisma"; // Uncomment when DB is connected

// ============================================================
// GET /api/services - List all services for a business
// ============================================================
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get("businessId");
    const category = searchParams.get("category"); // Optional filter

    if (!businessId) {
      return NextResponse.json(
        { error: "businessId is required" },
        { status: 400 }
      );
    }

    // TODO: Replace mock data with Prisma query
    // const services = await prisma.service.findMany({
    //   where: {
    //     businessId,
    //     isActive: true,
    //     ...(category && { category }),
    //   },
    //   orderBy: [{ category: "asc" }, { name: "asc" }],
    // });

    const mockServices = [
      {
        id: "svc_mock_001",
        businessId,
        name: "Classic Full Set",
        duration: 90,
        price: 85.0,
        category: "Lashes",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "svc_mock_002",
        businessId,
        name: "Lash Fill (2 weeks)",
        duration: 45,
        price: 45.0,
        category: "Lashes",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "svc_mock_003",
        businessId,
        name: "Lash Tint",
        duration: 30,
        price: 65.0,
        category: "Lashes",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "svc_mock_004",
        businessId,
        name: "Volume Full Set",
        duration: 120,
        price: 150.0,
        category: "Lashes",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "svc_mock_005",
        businessId,
        name: "Brow Lamination",
        duration: 45,
        price: 55.0,
        category: "Brows",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    // Apply optional category filter
    let filtered = mockServices;
    if (category) {
      filtered = filtered.filter(
        (s) => s.category?.toLowerCase() === category.toLowerCase()
      );
    }

    return NextResponse.json({ services: filtered }, { status: 200 });
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ============================================================
// POST /api/services - Create a new service
// ============================================================
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { businessId, name, duration, price, category } = body;

    // Validation
    if (!businessId || !name || !duration || price === undefined) {
      return NextResponse.json(
        { error: "businessId, name, duration, and price are required" },
        { status: 400 }
      );
    }

    if (typeof duration !== "number" || duration <= 0) {
      return NextResponse.json(
        { error: "duration must be a positive number (in minutes)" },
        { status: 400 }
      );
    }

    if (typeof price !== "number" || price < 0) {
      return NextResponse.json(
        { error: "price must be a non-negative number" },
        { status: 400 }
      );
    }

    // TODO: Replace with Prisma create
    // const service = await prisma.service.create({
    //   data: { businessId, name, duration, price, category },
    // });

    const mockService = {
      id: `svc_${Date.now()}`,
      businessId,
      name,
      duration,
      price,
      category: category || null,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({ service: mockService }, { status: 201 });
  } catch (error) {
    console.error("Error creating service:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
