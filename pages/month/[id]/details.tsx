import { DayPicker } from "@/components/Daypicker";
import MainLayout from "@/components/Layout";
import Loader from "@/components/Loader";
import { IDay, IMonth } from "@/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import Day from "@/components/Day";
import { Toaster } from "react-hot-toast";
import Head from "next/head";
export default function MonthDetails() {
  const router = useRouter();
  const { id } = router.query;

  const [filteredDays, setFilteredDays] = useState<IDay[]>([]);

  const {
    data: month,
    isFetching,
    isError,
  } = useQuery<IMonth>(
    ["month", id],
    () =>
      axios
        .get(`/api/month?${id}`)
        .then((res) => res.data)
        .catch((error) => console.error("Error fetching data:", error)),

    {
      refetchOnWindowFocus: false,
      enabled: !!router.isReady,
      cacheTime: Infinity,
    }
  );
  if (isFetching) {
    return (
      <div className="flex flex-1 items-center">
        <Loader />
      </div>
    );
  }
  if (isError) {
    return <div className="text-white">Coś poszło nie tak.</div>;
  }
  const pageTitle = month ? `Hours Tracker - ${month?.monthName} ${month?.year}` : "Hours Tracker"
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <Toaster />

      <DayPicker days={month?.days || []} onFilter={setFilteredDays} />

      <div className="flex w-full flex-col place-content-center">
        {month && (
          <div className="mt-6 flex w-full flex-row place-content-between items-center">
            <p className="md:text-md mr-3 text-sm font-semibold tracking-wider text-white">
              Wybierz dzień aby uzupełnić godziny:
            </p>
            <button
              onClick={() => {
                router.push(`/month/id=${month.id}/summary`);
              }}
              className="text-md rounded-md bg-teal-800 px-2 py-1 tracking-wider text-white shadow-md transition-all duration-75 hover:bg-teal-700 active:scale-95 active:bg-teal-900"
            >
              Podsumowanie
            </button>
          </div>
        )}

        <div className="mt-2 grid grid-cols-3 place-content-center gap-2 sm:grid-cols-4 md:grid-cols-7">
          {filteredDays?.map((day) => (
            <Day key={day.id} day={day} />
          ))}
        </div>
      </div>
    </>
  );
}

MonthDetails.getLayout = function getLayout(
  page: React.ReactElement
): React.ReactNode {
  return <MainLayout>{page}</MainLayout>;
};
