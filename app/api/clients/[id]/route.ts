import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
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
    const clientId = params.id;

    const client = await prisma.client.findFirst({
      where: { id: clientId, businessId },
      include: {
        appointments: {
          include: {
            services: {
              include: { service: true },
            },
          },
          orderBy: { date: "desc" },
        },
      },
    });

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    return NextResponse.json({ client }, { status: 200 });
  } catch (error) {
    console.error("Error fetching client details:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}