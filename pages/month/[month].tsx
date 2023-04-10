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
import { calculateTotalHours } from "@/lib/calculateTotalHours";
export default function MonthDetails() {
  const [filteredDays, setFilteredDays] = useState<IDay[]>([]);

  const router = useRouter();
  const query = router.query;

  const {
    data: month,
    isFetching,
    isError,
  } = useQuery<IMonth>(
    ["month", query.month],
    () =>
      axios
        .get(`/api/month?${query.month}`)
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

  return (
    <>
      <Toaster />

      <DayPicker days={month?.days || []} onFilter={setFilteredDays} />

      <div>
        <h1>
          {month?.monthName} {calculateTotalHours(month?.days || [])}{" "}
        </h1>
        <p className="md:text-md mt-6 w-full text-left text-sm font-semibold tracking-wider text-white">
          Wybierz dzień aby uzupełnić godziny:
        </p>

        <div className="mt-2 grid grid-cols-3 gap-2 md:grid-cols-7">
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
