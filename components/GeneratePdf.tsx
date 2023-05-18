import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { getHours } from "./DaysTable";
import { IDay } from "@/types";
import "../public/arial.js";

const generatePDF = async (
  daysInMonth: IDay[],
  dailyNormHours: number,
  monthName: string,
  year: number
) => {
  const doc = new jsPDF();
  doc.setFont("arial", "normal");
  const text = `Godziny pracy ${monthName} ${year}`;
  const pageWidth = doc.internal.pageSize.width;
  doc.text(text, pageWidth / 2, 10, { align: "center" });
  const columns = ["Data", "Dzień", "Godziny", "Nadgodziny"];
  const data = daysInMonth
    .filter((day) => day.hours != null || day.leaveType)
    .map((day) => {
      const isWeekend = day.dayName === "Sobota" || day.dayName === "Niedziela";
      const { workTime, overTime } = getHours(
        day.hours as number,
        dailyNormHours as number,
        isWeekend
      );
      const date = new Date(day.date).toLocaleDateString();
      const dayName = day.dayName;
      const hours =
        day.leaveType === "vacations"
          ? "Urlop"
          : day.leaveType === "sickLeave"
          ? "Zwolnienie"
          : workTime;
      const overTimeFormatted = overTime || "";
      const businessTrip = day.businessTrip;
      return [
        date || "",
        dayName || "",
        hours ? hours.toString() : "",
        overTimeFormatted ? overTimeFormatted.toString() : "",
        businessTrip || false,
      ];
    });

  autoTable(doc, {
    startY: 20,
    columns: columns,
    body: data,
    styles: {
      font: "arial",
      fontStyle: "normal",
    },
    theme: "grid",
    didParseCell: (data) => {
      if (
        data.row.cells[2].raw === "Urlop" ||
        data.row.cells[2].raw === "Zwolnienie"
      ) {
        data.cell.styles.fillColor = "#FACC15";
      }
      if ((data.row.raw as any[])[4] === true) {
        data.cell.styles.fillColor = "#60A5FA";
      }
    },
  });
  doc.setProperties({
    title: `Godziny pracy ${monthName} ${year}`,
    author: "Working Hours",
  });
  doc.output("dataurlnewwindow", {
    filename: `Godziny pracy ${monthName} ${year}`,
  });
};

export default generatePDF;
