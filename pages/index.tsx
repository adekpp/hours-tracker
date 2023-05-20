import MainLayout from "@/components/Layout";
import Loader from "@/components/Loader";
import { IMonth } from "@/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const {
    data: months,
    isLoading,
    isFetching,
  } = useQuery<IMonth[]>(
    ["months"],
    () => axios.get(`/api/months`).then((res) => res.data),
    {
      refetchOnWindowFocus: false,
      cacheTime: Infinity,
      staleTime: Infinity,
    }
  );

  useEffect(() => {
    if (!months) return;
    const currentMonth: IMonth | undefined = months.find(
      (month: IMonth) => month.monthNumber === new Date().getMonth() + 1
    );
    currentMonth && router.push(`/month/id=${currentMonth.id}/details`);
  }, [months, router]);

  return (
    <>
      <Head>
        <title>Hours Tracker</title>
      </Head>
      {isLoading && (
        <div className="flex flex-1 items-center">
          <Loader />
        </div>
      )}
    </>
  );
}

Home.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
