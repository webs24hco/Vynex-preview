import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";

// ============================================================
// GET /api/services - List all services for the authenticated business
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
    const category = searchParams.get("category");

    const services = await prisma.service.findMany({
      where: {
        businessId,
        isActive: true,
        ...(category ? { category } : {}),
      },
      orderBy: [{ category: "asc" }, { name: "asc" }],
    });

    return NextResponse.json({ services }, { status: 200 });
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
    const { name, duration, price, category } = body;

    // Validation
    if (!name || !duration || price === undefined) {
      return NextResponse.json(
        { error: "name, duration, and price are required" },
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

    const service = await prisma.service.create({
      data: {
        businessId,
        name,
        duration,
        price,
        category: category || null,
      },
    });

    return NextResponse.json({ service }, { status: 201 });
  } catch (error) {
    console.error("Error creating service:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
