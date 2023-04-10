import { NextApiResponse, NextApiRequest } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { prisma } from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PUT") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }
  const { dayId, data } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: session?.user?.email as string,
      },
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const updatedDay = await prisma.day.update({
      where: {
        id: dayId,
      },
      data: data,
      include: {
        month: {
          include: {
            user: true,
          },
        },
      },
    });

    if (updatedDay.month.user.id !== user.id) {
      res.status(403).json({ message: "The day does not belong to the user" });
      return;
    }

    res.status(200).json({
      id: updatedDay.id,
      leaveType: updatedDay.leaveType,
      from: updatedDay.from,
      to: updatedDay.to,
      businessTrip: updatedDay.businessTrip,
      monthId: updatedDay.monthId,
      date: updatedDay.date,
      dayName: updatedDay.dayName,
      breakTime: updatedDay.breakTime,
      hours: updatedDay.hours,
    });
  } catch (error) {
    console.error("Error updating day:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
