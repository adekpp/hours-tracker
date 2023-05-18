import {
  UseFormClearErrors,
  UseFormHandleSubmit,
  useForm,
} from "react-hook-form";
import { IDay, IMonth } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { calculateWorkTime } from "@/lib/calculateWorkTime";
import { useState } from "react";
import { isError } from "@/lib/isError";
import toast from "react-hot-toast";
import axios from "axios";
import {
  UseFormRegister,
  UseFormWatch,
  UseFormSetValue,
} from "react-hook-form";

export type DayFormChildProps = {
  register: UseFormRegister<FormData>;
  watch: UseFormWatch<FormData>;
  setValue: UseFormSetValue<FormData>;
  handleSubmit: UseFormHandleSubmit<FormData>;
  clearErrors: UseFormClearErrors<FormData>;
};

type FormData = {
  leaveType: string;
  from: Date | string | null;
  to: Date | string | null;
  businessTrip: boolean;
  breakTime: number;
  hours: number | null | Error;
};

const updateDay = async (data: FormData, dayId: IDay["id"]) => {
  try {
    const response = await axios.put<IDay>(`/api/day`, { data, dayId });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const useDayForm = (
  day: IDay,
  setIsModalOpen: (value: boolean) => void
) => {
  const router = useRouter();
  const query = router.query;
  const queryKey = ["month", query.id];
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
      toast.error("Coś poszło nie tak");
    },
  });

  const fromHour =
    day.to === null
      ? null
      : new Date(day.from as Date).toISOString().slice(11, 16);
  const toHour =
    day.to === null
      ? null
      : new Date(day.to as Date).toISOString().slice(11, 16);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    clearErrors,
  } = useForm<FormData>({
    defaultValues: {
      leaveType: day.leaveType,
      from: fromHour,
      to: toHour,
      businessTrip: day.businessTrip,
      breakTime: day.breakTime,
    },
    mode: "onSubmit",
  });

  const onSubmit = (data: FormData) => {
    const from = new Date(`1970-01-01T${data.from as string}Z`);
    const to = new Date(`1970-01-01T${data.to as string}Z`);
    const breakTime = Number(data.breakTime);
    const hours = calculateWorkTime(from, to, breakTime);

    if (isError(hours)) {
      console.error(hours);
    } else {
      const mutationData = {
        leaveType: data.leaveType,
        businessTrip: data.businessTrip,
        breakTime: breakTime,
        from: from,
        to: to,
        hours,
      };
      mutation.mutate(mutationData);
    }
  };

  return {
    register,
    handleSubmit,
    watch,
    setValue,
    onSubmit,
    mutation,
    errors,
    clearErrors,
  };
};
