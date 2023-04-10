import { Fragment, useEffect, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { IMonth } from "@/types";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { calculateTotalHours } from "@/lib/calculateTotalHours";

export function MonthsDropdown() {
  const router = useRouter();

  const { data: session, status } = useSession();
  const { data: months, isLoading } = useQuery<IMonth[]>(
    ["months"],
    () => axios.get(`/api/months`).then((res) => res.data),
    {
      refetchOnWindowFocus: false,
      enabled: !!session,
      cacheTime: Infinity,
    }
  );

  const [selected, setSelected] = useState<IMonth | null>();
  const [totalHours, setTotalHours] = useState<string | null>("");
  useEffect(() => {
    if (!router.isReady) return;
    setSelected(
      months
        ? months.find((month) => month.id === router.query.month?.slice(3)) ||
            null
        : null
    );
  }, [router.isReady, months, router.query.month]);

  useEffect(() => {
    if (!selected) return;
    setTotalHours(calculateTotalHours(selected.days || []));
  }, [selected]);

  const handleSelectedChange = (newSelected: IMonth) => {
    setSelected(newSelected);
    router.push(`/month/id=${newSelected.id}`);
  };
  if (isLoading) {
    return (
      <div className=" mt-8 w-72 sm:mt-2">
        <div className="relative mt-1">
          <div className="w-full animate-pulse rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
            <span className="block truncate">Ładuję...</span>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="top-16 mt-8 w-72 sm:mt-2">
      <Listbox value={selected} onChange={handleSelectedChange}>
        <div className="relative mt-1">
          <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
            <div className="flex w-full place-content-between">
              <span className="block truncate">{selected?.monthName}</span>
              <span className="block truncate">{totalHours}</span>
            </div>

            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {months?.map((month, index) => (
                <Link key={month.id} href={`/month/id=${month.id}`}>
                  <Listbox.Option
                    key={index}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? "bg-teal-200 text-gray-900" : "text-gray-900"
                      }`
                    }
                    value={month}
                  >
                    {({ selected }) => (
                      <>
                        <div
                          className={` flex w-full place-content-between truncate ${
                            selected ? "font-medium" : "font-normal"
                          }`}
                        >
                          <span
                            className={`block truncate ${
                              selected ? "font-medium" : "font-normal"
                            }`}
                          >
                            {month.monthName}
                          </span>
                          <span
                            className={`block truncate ${
                              selected ? "font-medium" : "font-normal"
                            }`}
                          >
                            {calculateTotalHours(month.days || [])}
                          </span>
                        </div>
                        {selected ? (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-teal-600">
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                </Link>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}
