import { NextApiResponse, NextApiRequest } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { prisma } from "@/lib/prisma";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    res.status(401).json({ message: "Not authenticated" });
  }
  console.log(req.query);

  if (req.method === "GET") {
    console.log(req.query.month);
    try {
      const user = await prisma.user.findUnique({
        where: {
          email: session?.user?.email as string,
        },
        select: {
          months: {
            where: {
              id: req.query.id as string,
            },
            include: {
              days: {
                orderBy: {
                  date: "asc",
                },
              },
            },
          },
        },
      });

      if (user && user.months.length > 0) {
        res.status(200).json(user.months[0]);
      } else {
        res.status(404).json({ message: "Month not found" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something goes wrong" });
    }
  }
  if (req.method === "PATCH") {
    try {
      const month = await prisma.month.update({
        where: {
          id: req.query.month as string,
        },
        data: req.body,
      });
      res.status(200).json(month);
    } catch (error) {
      res.status(500).json({ message: "Something goes wrong" });
    }
  }
}
