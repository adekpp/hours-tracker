import { useDayForm } from "@/hooks/useDayForm";
import { DayFormChildProps } from "@/hooks/useDayForm";

type LeaveTypeRadioProps = {
  dayForm: DayFormChildProps;
};
export const LeaveTypeRadio = ({ dayForm }: LeaveTypeRadioProps) => {
  const { register, watch, setValue, clearErrors } = dayForm;
  const leaveType = watch("leaveType");

  const handleRadioChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const target = e.target as HTMLInputElement;
    setValue("leaveType", target.value);
  };

  const handleRadioDeselect: React.MouseEventHandler<HTMLInputElement> = (
    e
  ) => {
    const target = e.target as HTMLInputElement;
    if (target.checked) {
      clearErrors();
      setValue("leaveType", "");
      setValue("from", "");
      setValue("to", "");
      setValue("businessTrip", false);
      setValue("breakTime", "" as any);
    }
  };

  return (
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
  );
};
