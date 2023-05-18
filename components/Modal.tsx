import { IDay } from "@/types";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { DayForm } from "./form/DayForm"; 
import { format } from "date-fns";
type ModalProps = {
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
  day: IDay;
};

export default function MyModal({
  isModalOpen,
  setIsModalOpen,
  day,
}: ModalProps) {
  return (
    <>
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-4 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-center text-lg font-medium leading-6 text-gray-900 md:text-left"
                  >
                    {day.dayName} - {format(new Date(day.date), "dd.MM.yyyy")}
                  </Dialog.Title>

                  <div className="mt-2 border-[1px] p-2 rounded-md">
                    <DayForm day={day} setIsModalOpen={setIsModalOpen} />
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
