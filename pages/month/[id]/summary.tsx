import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import type { IMonth } from "@/types";
import { useState } from "react";
import Head from "next/head";
import { SummaryLayout } from "@/components/Layout";
import Loader from "@/components/Loader";
import { motion } from "framer-motion";
import { DaysTable } from "@/components/DaysTable";
import generatePDF from "@/components/GeneratePdf";
import { DocumentArrowDownIcon } from "@heroicons/react/24/outline";

export default function MonthSummary() {
  const [hoursNorm = 8, setHoursNorm] = useState<number>();
  const [inputValue = 8, setInputValue] = useState<number | string>();

  const router = useRouter();
  const { id } = router.query;

  const { data: month, isLoading } = useQuery<IMonth>(
    ["month", id],
    () =>
      fetch(`/api/month?${id}`)
        .then((res) => res.json())
        .catch((error) => console.error("Error fetching data:", error)),
    {
      refetchOnWindowFocus: false,
      enabled: !!router.isReady,
      cacheTime: Infinity,
    }
  );
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputValue) return;
    setHoursNorm(Number(inputValue));
  };

  const handleDownload = () => {
    generatePDF(
      month?.days || [],
      hoursNorm,
      month?.monthName || "",
      month?.year || 0
    );
  };
  const hasWorkedDays = month?.days?.some(
    (day) => day.from || day.to || day.leaveType
  );

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center">
        <Loader />
      </div>
    );
  }
  const pageTitle = month
    ? `Hours Tracker - ${month?.monthName} ${month?.year} - Podsumowanie`
    : "Hours Tracker";
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <div className="flex w-full max-w-md flex-col justify-center">
        {hasWorkedDays ? (
          <div>
            <div className=" my-3 flex place-content-between items-center gap-3">
              <form
                onSubmit={handleSubmit}
                className="flex flex-col items-center justify-end md:flex-row md:gap-4"
              >
                <label className="text-white">Norma godzinowa:</label>
                <div>
                  <input
                    type="number"
                    value={inputValue}
                    min={1}
                    onChange={(e) => setInputValue(e.currentTarget.value)}
                    className="mr-1 max-w-[100px] rounded border border-gray-300 py-1 px-2 outline-teal-600"
                  />
                  <button
                    type="submit"
                    className="rounded bg-teal-800 py-1 px-4 text-white shadow-md hover:bg-teal-700  active:scale-95"
                  >
                    Zapisz
                  </button>
                </div>
              </form>
              <button
                onClick={handleDownload}
                className="text-md  inline-flex items-center place-self-end rounded-md bg-teal-800     px-1 py-1 tracking-wider text-white shadow-md transition-all duration-75 hover:bg-teal-700 active:scale-95 active:bg-teal-900"
              >
                PDF
                <DocumentArrowDownIcon className="h-[20px] w-[20px]" />
              </button>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mx-auto mb-2 max-w-md rounded-md bg-teal-700">
                <h1 className=" text-md text-center font-thin uppercase text-white md:text-xl ">
                  Godziny pracy {month?.monthName} - {month?.year}
                </h1>
              </div>
              <DaysTable
                dailyNormHours={hoursNorm}
                daysInMonth={month?.days || []}
              />
            </motion.div>
          </div>
        ) : (
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mt-8 text-center text-white"
          >
            Nie masz jeszcze godzin pracy w tym miesiącu.
          </motion.h1>
        )}
      </div>
    </>
  );
}

MonthSummary.getLayout = function getLayout(
  page: React.ReactElement
): React.ReactNode {
  return <SummaryLayout>{page}</SummaryLayout>;
};
