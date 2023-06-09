import Footer from "./Footer";
import Header from "./Header";
import { MonthsDropdown } from "./MonthsDropdown";
interface Props {
  children: React.ReactNode;
}

export function LandingPage({ children }: Props) {
  return (
    <div className="items-center flex flex-col bg-landing bg-no-repeat bg-cover bg-fixed">
      {children}
    </div>
  );
}

export default function MainLayout({ children }: Props) {
  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col   md:pt-6">
      <Header />

      <div className="mx-auto my-3 flex h-full  w-full flex-1 flex-col items-center px-3">
        <div className="mb-2 md:w-full">
          <MonthsDropdown showHours redirectTo="details" />
        </div>
        {children}
      </div>

      <Footer />
    </div>
  );
}

export function SummaryLayout({ children }: Props) {
  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col   md:pt-6">
      <Header />

      <div className="mx-auto my-3 flex h-full  w-full flex-1 flex-col items-center px-3">
        <div className="mb-2 md:w-full">
          <MonthsDropdown showHours redirectTo="summary" />
        </div>
        {children}
      </div>

      <Footer />
    </div>
  );
}
