import axios from "axios";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import logo from "../public/images/logo.png";
import { LandingPage } from "@/components/Layout";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { motion } from "framer-motion";
export default function Home() {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>Hours Tracker</title>
      </Head>
      <div className="grid min-h-screen w-full max-w-7xl grid-rows-2 p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className="row-span-1 flex h-[80%] w-full max-w-full flex-col items-center gap-10 md:flex-row md:place-content-between"
        >
          <Image
            src={logo}
            alt="logo"
            width={701}
            priority={true}
            sizes="(max-width: 400px) 100vw"
            className="w-[200px] max-w-[400px] object-contain md:w-full "
          />
          <div className="flex max-w-sm flex-col text-white md:min-w-[380px]">
            <h1 className="text-xl md:text-3xl">Śledź Swoje Godziny Pracy</h1>
            <div className="divider" />
            <p className="text-sm font-light md:text-xl">
              Monitoruj bez wysiłku swoje godziny pracy i generuj miesięczne
              podsumowania z Hours Tracker.
            </p>
          </div>
          <div className="flex flex-col items-center gap-6 md:mt-16 md:hidden">
            <h2 className="text-2xl text-white">Spróbuj teraz! </h2>
            <button
              onClick={() => router.push("/auth/signin")}
              className="rounded-md bg-teal-600 py-2 px-3 text-white outline outline-2  outline-offset-4  transition-all hover:bg-teal-800 active:scale-95"
            >
              Zaloguj się
            </button>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className="row-span-1 hidden flex-1 flex-col items-center gap-6 md:mt-16 md:flex md:place-content-start"
        >
          <h2 className="text-2xl text-white">Spróbuj teraz! </h2>
          <button
            onClick={() => router.push("/auth/signin")}
            className="rounded-md bg-teal-600 py-2 px-3 text-white outline outline-2  outline-offset-4  transition-all hover:bg-teal-800 active:scale-95"
          >
            Zaloguj się
          </button>
        </motion.div>
      </div>
    </>
  );
}

Home.getLayout = function getLayout(page: React.ReactElement) {
  return <LandingPage>{page}</LandingPage>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (session?.user?.email) {
    const monthNumber: number = new Date().getMonth() + 1;
    const month = await axios
      .get(
        `${process.env.NEXT_PUBLIC_URL}/api/month?monthNumber=${monthNumber}`,
        {
          headers: {
            cookie: context.req.headers.cookie,
          },
        }
      )
      .then((res) => res.data);

    if (month) {
      console.log("month", month.id);
      return {
        redirect: {
          destination: `${process.env.NEXT_PUBLIC_URL}/month/id=${month.id}/details`,
          permanent: false,
        },
      };
    }
  }
  return {
    props: {},
  };
};
