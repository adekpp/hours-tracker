import { DayFormChildProps } from "@/hooks/useDayForm";

type TimeInputsProps = {
  dayForm: DayFormChildProps;
};

export const TimeInputs = ({ dayForm }: TimeInputsProps) => {
  const { register, watch, clearErrors } = dayForm;
  const leaveType = watch("leaveType");
  return (
    <div className="flex flex-col gap-3 md:flex-row">
      <label>
        Od:
        <input
          type="time"
          {...register("from", {
            validate: (value) => {
              const from = new Date(`2021-01-01T${value}`);
              const to = new Date(`2021-01-01T${watch("to")}`);
              if (from > to) {
                return "Czas początku pracy nie może być większy niż czas zakończenia";
              }
              return true;
            },
          })}
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
  );
};
