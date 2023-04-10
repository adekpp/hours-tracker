import { SummaryLayout } from "@/components/Layout";

export default function Summary() {
  return <div>index</div>;
}

Summary.getLayout = function getLayout(
  page: React.ReactElement
): React.ReactNode {
  return <SummaryLayout>{page}</SummaryLayout>;
};
