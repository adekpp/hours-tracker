import Footer from "./Footer";
import Header from "./Header";
import { MonthsDropdown } from "./MonthsDropdown";
interface Props {
  children: React.ReactNode;
}

export default function MainLayout({ children }: Props) {
  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col  px-3 pt-6">
      <Header />

      <div className="mx-auto my-6 flex h-full  w-full flex-1 flex-col items-center ">
        <div className="md:w-full mb-6 md:mb-2">
          <MonthsDropdown />
        </div>
        {children}
      </div>

      <Footer />
    </div>
  );
}
