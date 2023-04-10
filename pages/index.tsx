import MainLayout from "@/components/Layout";
import { IMonth } from "@/types";
import { NextApiRequest } from "next";

export default function Home() {}
Home.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export async function getServerSideProps({ req }: { req: NextApiRequest }) {
  const months = await fetch("http://192.168.1.30:3000/api/months", {
    headers: {
      cookie: req.headers.cookie as string,
    },
  });
  const data = await months.json();
  if (data) {
    const currentMonth = data.find(
      (month: IMonth) => month.monthNumber === new Date().getMonth() + 1
    );
    if (currentMonth) {
      return {
        redirect: {
          destination: `http://192.168.1.30:3000/month/id=${currentMonth.id}`,
          permanent: false,
        },
      };
    }
  }
  
    return {
      redirect: {
        destination: `http://192.168.1.30:3000/api/auth/signin`,
        permanent: false,
      },
    
  };
}
