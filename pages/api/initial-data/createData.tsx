import { NextApiResponse, NextApiRequest } from "next";
import { prisma } from "../../../lib/prisma";
import getAllMonthInfo from "@/lib/getMonths";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  async function userDataExists(userEmail: string) {
    const userMonths = await prisma.month.findFirst({
      where: {
        userEmail: userEmail,
      },
    });

    return Boolean(userMonths);
  }

  if (req.method === "POST") {
    const userEmail = req.body.userEmail;
    const currentYear = new Date().getFullYear();
    const allMonthsInfo = getAllMonthInfo(currentYear);

    try {
      // check if user data already exists
      if (await userDataExists(userEmail)) {
        return res.status(200).json({ message: "User data already exists" });
      }

      const results = await Promise.all(
        allMonthsInfo.map(async (monthInfo) => {
          return await prisma.month.create({
            data: {
              ...(monthInfo as any),
              userEmail: userEmail,
              days: {
                create: monthInfo?.days?.map((dayInfo) => ({
                  ...dayInfo,
                })),
              },
            },
          });
        })
      );

      res.status(201).json(results);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error creating months and days" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
