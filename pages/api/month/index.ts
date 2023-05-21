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

  if (req.method === "GET") {
    try {
      const user = await prisma.user.findUnique({
        where: {
          email: session?.user?.email as string,
        },
        include: {
          months: true,
        },
      });

      if (user) {
        let month;

        if (req.query.id) {
          month = user.months.find((m) => m.id === req.query.id);

          if (month) {
            month = await prisma.month.findUnique({
              where: {
                id: month.id,
              },
              include: {
                days: {
                  orderBy: {
                    date: "asc",
                  },
                },
              },
            });
          }
        } else if (req.query.monthNumber) {
          month = user.months.find(
            (m) => m.monthNumber === Number(req.query.monthNumber)
          );

          if (month) {
            month = await prisma.month.findUnique({
              where: {
                id: month.id,
              },
              include: {
                days: {
                  orderBy: {
                    date: "asc",
                  },
                },
              },
            });
          }
        }

        if (month) {
          res.status(200).json(month);
        } else {
          res.status(404).json({ message: "Month not found" });
        }
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong" });
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
