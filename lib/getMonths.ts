import { IDay, IMonth } from "@/types";

interface IMonthData {
  name: string;
  number: number;
}

const monthData: IMonthData[] = [
  { name: "Styczeń", number: 1 },
  { name: "Luty", number: 2 },
  { name: "Marzec", number: 3 },
  { name: "Kwiecień", number: 4 },
  { name: "Maj", number: 5 },
  { name: "Czerwiec", number: 6 },
  { name: "Lipiec", number: 7 },
  { name: "Sierpień", number: 8 },
  { name: "Wrzesień", number: 9 },
  { name: "Październik", number: 10 },
  { name: "Listopad", number: 11 },
  { name: "Grudzień", number: 12 },
];

export default function getAllMonthInfo(year: number): IMonth[] {
  return monthData.map((month) => getMonthInfo(month.name, month.number, year));
}

function getMonthInfo(
  monthName: IMonthData["name"],
  monthNumber: IMonthData["number"],
  year: number
): IMonth {
  const dayNames: string[] = [
    "Niedziela",
    "Poniedziałek",
    "Wtorek",
    "Środa",
    "Czwartek",
    "Piątek",
    "Sobota",
  ];

  const daysInMonth = new Date(year, monthNumber, 0).getDate();
  const days: IDay[] = [];

  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, monthNumber - 1, i);
    const dayName = dayNames[date.getDay()];
    days.push({
      dayName: dayName,
      date: date,
    });
  }

  return { monthName, monthNumber, year, days };
}
