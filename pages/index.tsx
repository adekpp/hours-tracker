import MainLayout from "@/components/Layout";
import { IMonth } from "@/types";
import { NextApiRequest } from "next";
import Head from "next/head";

export default function Home() {
  return (
    <Head>
      <title>Hours Tracker</title>
    </Head>
  );
}

Home.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export async function getServerSideProps({ req }: { req: NextApiRequest }) {
  try {
    const months = await fetch(`${process.env.NEXT_URL}/api/months`, {
      headers: {
        cookie: req.headers.cookie || "",
      },
    });
    const data = await months.json();

    if (data) {
      const currentMonth: IMonth = data.find(
        (month: IMonth) => month.monthNumber === new Date().getMonth() + 1
      );

      if (currentMonth) {
        return {
          redirect: {
            destination: `${process.env.NEXT_URL}/month/id=${currentMonth.id}/details`,
            permanent: false,
          },
        };
      }
    }

    return {
      redirect: {
        destination: `${process.env.NEXT_URL}/api/auth/signin`,
        permanent: false,
      },
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      props: {
        error: "Error fetching data.",
      },
    };
  }
}
