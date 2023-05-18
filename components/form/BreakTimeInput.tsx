import { useDayForm } from "@/hooks/useDayForm";
import { DayFormChildProps } from "@/hooks/useDayForm";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { Tooltip } from "react-tooltip";

type BreakInputProps = {
  dayForm: DayFormChildProps;
};

export const BreakTimeInput = ({ dayForm }: BreakInputProps) => {
  const { register, watch } = dayForm;
  const leaveType = watch("leaveType");

  return (
    <div
      className="flex flex-col items-center md:flex-row"
      data-tooltip-id="my-tooltip"
      data-tooltip-content="Hello world!"
    >
      <label className="inline-flex">
        <InformationCircleIcon className="my-anchor-element-class h-6 w-6 text-teal-500 antialiased" />
        Przerwa:(min.)
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
        {...register("breakTime", {
          validate: (value) => {
            const from = new Date(`2021-01-01T${watch("from")}Z`);
            const to = new Date(`2021-01-01T${watch("to")}Z`);
            const workTime = to.getTime() - from.getTime();
            const breakTime = value * 60 * 1000;
            if(from > to) return false;
            if (breakTime > workTime) {
              return "Czas przerwy nie może być większy niż czas pracy";
            }
            return true;
          },
        })}
        disabled={!!leaveType}
        className="ml-2 rounded border border-gray-300 py-1 px-2 outline-teal-600"
      />
    </div>
  );
};
