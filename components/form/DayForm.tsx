import { useForm } from "react-hook-form";
import { LeaveTypeRadio } from "./LeaveTypeRadio";
import { TimeInputs } from "./TimeInputs";
import { BreakTimeInput } from "./BreakTimeInput";
import { useDayForm } from "@/hooks/useDayForm";
import { BusinessTripCheckbox } from "./BuissnesTripCheckbox";
import { motion, AnimatePresence } from "framer-motion";
import { IDay } from "@/types";

type DayFormProps = {
  day: IDay;
  setIsModalOpen: (value: boolean) => void;
};
export const DayForm = ({ day, setIsModalOpen }: DayFormProps) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    onSubmit,
    mutation,
    errors,
    clearErrors,
  } = useDayForm(day, setIsModalOpen);

  const clearForm = () => {
    setValue("leaveType", "");
    setValue("from", "" as any);
    setValue("to", "" as any);
    setValue("businessTrip", false);
    setValue("breakTime", 0);
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-center space-y-4"
    >
      <AnimatePresence>
        {errors.from && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center text-sm text-red-500"
          >
            {errors.from.message}
          </motion.p>
        )}
      </AnimatePresence>
      {errors.breakTime && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="text-sm text-red-500"
        >
          {errors.breakTime.message}
        </motion.p>
      )}
      <LeaveTypeRadio
        dayForm={{ register, watch, setValue, handleSubmit, clearErrors }}
      />
      <TimeInputs
        dayForm={{ register, watch, setValue, handleSubmit, clearErrors }}
      />
      <BreakTimeInput
        dayForm={{ register, watch, setValue, handleSubmit, clearErrors }}
      />
      <BusinessTripCheckbox
        dayForm={{ register, watch, setValue, handleSubmit, clearErrors }}
      />

      <div className="flex w-full place-content-evenly gap-1 text-xs sm:flex-row md:text-base">
        <button
          type="submit"
          className={`relative w-24 rounded bg-teal-600 py-2 px-3 text-white shadow-md hover:bg-teal-700 active:scale-95 ${
            mutation.isLoading ? "opacity-50" : ""
          }`}
        >
          {mutation.isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="inline-block h-3 w-3 md:h-4 md:w-4  animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                role="status"
              >
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                  Loading...
                </span>
              </div>
            </div>
          ) : (
            "Zapisz"
          )}
        </button>
        <button
          type="button"
          onClick={() => setIsModalOpen(false)}
          className="w-24 rounded bg-red-400 py-2 px-3 text-white shadow-md hover:bg-red-500 active:scale-95"
        >
          Anuluj
        </button>
        <button
          onClick={() => {
            clearForm();
            clearErrors();
          }}
          type="button"
          className="w-24 rounded bg-yellow-400 py-2 px-3 text-white shadow-md hover:bg-yellow-500 active:scale-95"
        >
          Wyczyść
        </button>
      </div>
    </form>
  );
};
