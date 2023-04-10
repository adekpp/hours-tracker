import { useForm } from "react-hook-form";
import axios from "axios";
import { IDay, IMonth } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { calculateWorkTime } from "@/lib/calculateWorkTime";
import { useState } from "react";
import { isError } from "@/lib/isError";
import toast from "react-hot-toast";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
type DayFormProps = {
  day: IDay;
  setIsModalOpen: (value: boolean) => void;
};

type FormData = {
  leaveType: string;
  from: string;
  to: string;
  businessTrip: boolean;
  breakTime: string;
  hours: string | null | Error;
};

const updateDay = async (data: FormData, dayId: IDay["id"]) => {
  try {
    const response = await axios.put<IDay>(`/api/day`, { data, dayId });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const DayForm = ({ day, setIsModalOpen }: DayFormProps) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const router = useRouter();
  const query = router.query;
  const queryKey = ["month", query.month];
  const queryClient = useQueryClient();
  const mutation = useMutation((data: FormData) => updateDay(data, day.id), {
    onSuccess: (updatedDayData) => {
      queryClient.setQueryData<IMonth>(queryKey, (oldMonthData) => {
        if (!oldMonthData) {
          return;
        }
        return {
          ...oldMonthData,
          days: oldMonthData.days
            ?.map((day) =>
              day.id === updatedDayData?.id ? updatedDayData : day
            )
            .filter(Boolean) as IDay[],
        };
      });
      setIsModalOpen(false);
      toast.success("Dzień został zaktualizowany");
      queryClient.invalidateQueries(["months"]);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const { register, handleSubmit, watch, setValue } = useForm<FormData>({
    defaultValues: {
      leaveType: day.leaveType,
      from: day.from,
      to: day.to,
      businessTrip: day.businessTrip,
      breakTime: day.breakTime,
    },
  });
  const leaveType = watch("leaveType");

  const onSubmit = (data: FormData) => {
    const hours = calculateWorkTime(data.from, data.to, data.breakTime);
    if (isError(hours)) {
      setErrorMessage(hours.message);
      console.log(errorMessage);
    } else {
      setErrorMessage(null);
      mutation.mutate({ ...data, hours });
    }
  };

  const handleRadioChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const target = e.target as HTMLInputElement;
    setValue("leaveType", target.value);
  };

  const handleRadioDeselect: React.MouseEventHandler<HTMLInputElement> = (
    e
  ) => {
    const target = e.target as HTMLInputElement;
    if (target.checked) {
      setValue("leaveType", "");
      setValue("from", "");
      setValue("to", "");
      setValue("businessTrip", false);
      setValue("breakTime", "0");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-center space-y-4"
    >
      {errorMessage && <div className="mb-4 text-red-500">{errorMessage}</div>}
      <div className="flex flex-col items-start gap-2 md:flex-row">
        <label className="flex items-center">
          <input
            type="radio"
            {...register("leaveType")}
            value="sickLeave"
            checked={leaveType === "sickLeave"}
            onChange={handleRadioChange}
            onClick={handleRadioDeselect}
            className="radio-accent radio radio-xs mr-2"
          />
          Zwolnienie lekarskie
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            {...register("leaveType")}
            value="vacations"
            checked={leaveType === "vacations"}
            onChange={handleRadioChange}
            onClick={handleRadioDeselect}
            className="radio-accent radio radio-xs mr-2"
          />
          Urlop
        </label>
      </div>

      <div className="flex flex-col gap-3 md:flex-row">
        <label>
          Od:
          <input
            type="time"
            {...register("from")}
            disabled={!!leaveType}
            className="ml-2 rounded border border-gray-300 py-1 px-2 outline-teal-600"
          />
        </label>
        <label>
          Do:
          <input
            type="time"
            {...register("to")}
            disabled={!!leaveType}
            className="ml-2 rounded border border-gray-300 py-1 px-2 outline-teal-600"
          />
        </label>
      </div>
      <div
        className="flex flex-col items-center md:flex-row"
        data-tooltip-id="my-tooltip"
        data-tooltip-content="Hello world!"
      >
        <label className="inline-flex">
          <InformationCircleIcon className="my-anchor-element-class h-6 w-6 text-teal-500 antialiased" />
          Przerwa:
        </label>
        <Tooltip
          anchorSelect=".my-anchor-element-class"
          className="max-w-[130px] text-xs"
          style={{
            backgroundColor: "rgb(13, 148, 136)",
            color: "white",
            border: "1px solid rgb(19, 78, 74) ",
          }}
          content="Jeśli twoja przerwa jest wliczona w godziny pracy, nie wpisuj jej tutaj."
        />
        <input
          type="number"
          {...register("breakTime")}
          disabled={!!leaveType}
          className="ml-2 rounded border border-gray-300 py-1 px-2 outline-teal-600"
        />
      </div>

      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            {...register("businessTrip")}
            disabled={!!leaveType}
            className="checkbox-accent checkbox checkbox-xs mr-2"
          />
          Delegacja
        </label>
      </div>
      <div className="space-x-2">
        <button
          type="submit"
          className={`rounded bg-teal-600 py-1 px-4 text-white ${
            mutation.isLoading && "opacity-50"
          } shadow-md`}
        >
          {mutation.isLoading ? "Zapisywanie..." : "Zapisz"}
        </button>
        <button
          onClick={() => setIsModalOpen(false)}
          className="rounded bg-error py-1 px-4 text-white shadow-md"
        >
          Anuluj
        </button>
      </div>
    </form>
  );
};
