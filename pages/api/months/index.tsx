import { NextApiResponse, NextApiRequest } from "next";
import { getSession } from "next-auth/react";
import { authOptions } from "../auth/[...nextauth]";

import { prisma } from "@/lib/prisma";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  console.log(session);
  if (!session) {
    res.status(401).json({ message: "Not authenticated" });
  }

  if (req.method === "GET") {
    try {
      const months = await prisma.month.findMany({
        where: {
          userEmail: session?.user?.email as string,
        },
        orderBy: {
          monthNumber: "asc",
        },
        include: {
          days: true,
        },
      });
      res.status(200).json(months);
    } catch (error) {
      res.status(500).json({ message: "Something goes worng" });
    }
  }
}
