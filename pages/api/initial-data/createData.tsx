import { NextApiResponse, NextApiRequest } from "next";
import { prisma } from "../../../lib/prisma";
import getAllMonthInfo from "@/lib/getMonths";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const userEmail = req.body.userEmail;
    const currentYear = new Date().getFullYear();
    const allMonthsInfo = getAllMonthInfo(currentYear);

    try {
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
      res.status(200).json(results);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error creating months and days" });
    }
  }
}
