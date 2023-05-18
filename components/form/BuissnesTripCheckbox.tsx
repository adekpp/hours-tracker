import { useDayForm } from "@/hooks/useDayForm";
import { DayFormChildProps } from "@/hooks/useDayForm";

type BusinessTripCheckboxProps = {
  dayForm: DayFormChildProps;
};

export const BusinessTripCheckbox = ({
  dayForm,
}: BusinessTripCheckboxProps) => {
  const { register, watch } = dayForm;
  const leaveType = watch("leaveType");

  return (
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
  );
};
