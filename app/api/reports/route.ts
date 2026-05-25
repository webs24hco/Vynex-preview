import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";

// ============================================================
// GET /api/reports - Calculate real stats from the database
// ============================================================
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const businessId = user.id;
    const { searchParams } = new URL(request.url);
    const rangeParam = searchParams.get("range") || "today"; // today | week | month

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);

    // --- Today's stats ---
    const todayAppointments = await prisma.appointment.findMany({
      where: {
        businessId,
        date: {
          gte: todayStart,
          lt: todayEnd,
        },
      },
    });

    const completedToday = todayAppointments.filter(
      (a) => a.status === "COMPLETED"
    );

    const todayRevenue = completedToday.reduce(
      (sum, a) => sum + a.totalAmount,
      0
    );

    const appointmentsToday = todayAppointments.length;
    const completedCount = completedToday.length;
    const pendingCount = todayAppointments.filter(
      (a) => a.status === "PENDING"
    ).length;

    // --- Week stats ---
    const dayOfWeek = now.getDay(); // 0=Sun, 1=Mon, ...
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() + mondayOffset);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    const weekAppointments = await prisma.appointment.findMany({
      where: {
        businessId,
        date: {
          gte: weekStart,
          lt: weekEnd,
        },
        status: "COMPLETED",
      },
    });

    const weekRevenue = weekAppointments.reduce(
      (sum, a) => sum + a.totalAmount,
      0
    );

    // Build daily breakdown for the week (Mon-Sun)
    const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const weekOverview = weekDays.map((day, index) => {
      const dayDate = new Date(weekStart);
      dayDate.setDate(dayDate.getDate() + index);
      const nextDay = new Date(dayDate);
      nextDay.setDate(nextDay.getDate() + 1);

      const dayAppts = weekAppointments.filter((a) => {
        const d = new Date(a.date);
        return d >= dayDate && d < nextDay;
      });

      return {
        day,
        appointments: dayAppts.length,
        revenue: dayAppts.reduce((sum, a) => sum + a.totalAmount, 0),
      };
    });

    // --- Monthly stats (for reports page) ---
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const monthAppointments = await prisma.appointment.findMany({
      where: {
        businessId,
        date: {
          gte: monthStart,
          lt: monthEnd,
        },
        status: "COMPLETED",
      },
    });

    const monthRevenue = monthAppointments.reduce(
      (sum, a) => sum + a.totalAmount,
      0
    );

    // --- Monthly revenue for last 5 months (for chart) ---
    const monthlyRevenue = [];
    for (let i = 4; i >= 0; i--) {
      const mStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      const monthName = mStart.toLocaleString("en", { month: "short" });

      const mAppts = await prisma.appointment.findMany({
        where: {
          businessId,
          date: {
            gte: mStart,
            lt: mEnd,
          },
          status: "COMPLETED",
        },
      });

      monthlyRevenue.push({
        month: monthName,
        revenue: mAppts.reduce((sum, a) => sum + a.totalAmount, 0),
      });
    }

    // --- Top services ---
    const allCompletedAppts = await prisma.appointment.findMany({
      where: {
        businessId,
        status: "COMPLETED",
        date: {
          gte: monthStart,
          lt: monthEnd,
        },
      },
      include: {
        services: {
          include: { service: true },
        },
      },
    });

    const serviceStats: Record<string, { name: string; count: number; revenue: number }> = {};
    for (const appt of allCompletedAppts) {
      for (const as of appt.services) {
        const sName = as.service.name;
        if (!serviceStats[sName]) {
          serviceStats[sName] = { name: sName, count: 0, revenue: 0 };
        }
        serviceStats[sName].count += 1;
        serviceStats[sName].revenue += as.priceAtTimeOfBooking;
      }
    }

    const topServices = Object.values(serviceStats)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // --- Client stats ---
    const totalClients = await prisma.client.count({
      where: { businessId },
    });

    const newClientsThisMonth = await prisma.client.count({
      where: {
        businessId,
        createdAt: {
          gte: monthStart,
          lt: monthEnd,
        },
      },
    });

    // Unique clients who had appointments this month
    const clientsWithAppts = await prisma.appointment.findMany({
      where: {
        businessId,
        date: {
          gte: monthStart,
          lt: monthEnd,
        },
      },
      select: { clientId: true },
      distinct: ["clientId"],
    });

    const avgPerClient =
      clientsWithAppts.length > 0
        ? monthRevenue / clientsWithAppts.length
        : 0;

    return NextResponse.json({
      today: {
        revenue: todayRevenue,
        appointmentsTotal: appointmentsToday,
        completedCount,
        pendingCount,
      },
      week: {
        revenue: weekRevenue,
        overview: weekOverview,
      },
      month: {
        revenue: monthRevenue,
        totalAppointments: monthAppointments.length,
      },
      monthlyRevenue,
      topServices,
      clients: {
        total: totalClients,
        newThisMonth: newClientsThisMonth,
        avgPerClient: Math.round(avgPerClient * 100) / 100,
        activeThisMonth: clientsWithAppts.length,
      },
    });
  } catch (error) {
    console.error("Error fetching reports:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
