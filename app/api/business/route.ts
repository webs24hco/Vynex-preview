import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";

// ============================================================
// GET /api/business - Fetch business settings for the authenticated user
// ============================================================
export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const business = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        businessName: true,
        plan: true,
        currency: true,
        themeColor: true,
        themeDarkMode: true,
      },
    });

    if (!business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }

    // Map themeColor to a theme name for the frontend
    const themeMap: Record<string, string> = {
      "#DCAE96": "default",
      "#f0d4c4": "roseGold",
      "#C9A0DC": "midnightGlamour",
      "#7BA68C": "softSage",
    };

    const themeName = themeMap[business.themeColor] || "default";

    return NextResponse.json({
      id: business.id,
      businessName: business.businessName,
      plan: business.plan,
      currency: business.currency,
      theme: themeName,
      themeColor: business.themeColor,
      themeDarkMode: business.themeDarkMode,
    });
  } catch (error) {
    console.error("Error fetching business:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ============================================================
// PATCH /api/business - Update business settings
// ============================================================
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { theme, businessName, themeColor, themeDarkMode } = body;

    // Build update data
    const updateData: Record<string, unknown> = {};

    if (businessName !== undefined) {
      updateData.businessName = businessName;
    }

    if (themeColor !== undefined) {
      updateData.themeColor = themeColor;
    }

    if (themeDarkMode !== undefined) {
      updateData.themeDarkMode = themeDarkMode;
    }

    // If a theme name is provided, map it to the corresponding color
    if (theme !== undefined && themeColor === undefined) {
      const themeColorMap: Record<string, string> = {
        default: "#DCAE96",
        roseGold: "#f0d4c4",
        midnightGlamour: "#C9A0DC",
        softSage: "#7BA68C",
        custom: body.customColor || "#DCAE96",
      };
      updateData.themeColor = themeColorMap[theme] || "#DCAE96";
      updateData.themeDarkMode = theme === "midnightGlamour";
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
      select: {
        id: true,
        businessName: true,
        plan: true,
        currency: true,
        themeColor: true,
        themeDarkMode: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating business:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ============================================================
// PUT /api/business - Full update of business settings (alias for PATCH)
// ============================================================
export async function PUT(request: NextRequest) {
  return PATCH(request);
}
