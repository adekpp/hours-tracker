import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getCsrfToken } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import logo from "../../public/images/logo.png";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import { motion } from "framer-motion";
export default function SignIn({
  csrfToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Head>
        <title>Hours Tracker - logowanie</title>
        <meta
          property="og:title"
          content="Hours Tracker - logowanie"
          key="Hours Tracker - logowanie"
        />
      </Head>

      <div className="relative flex min-h-screen w-full flex-col place-content-center items-center  bg-landing bg-cover bg-no-repeat text-neutral-900">
        <div className="flex w-full  items-center justify-center md:top-0">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="flex w-full max-w-full  flex-col place-items-center space-y-5 bg-teal-900 p-8 shadow-md md:max-w-xs md:rounded-md "
          >
            <Image
              src={logo}
              alt="Logo"
              width={200}
              height={100}
              className="w-[170px] md:w-[200px]"
            />
            <form
              className="flex w-full max-w-[280px] flex-col gap-y-2"
              method="post"
              action="/api/auth/signin/email"
            >
              <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
              <label className="text-md text-white">Twój adres e-mail:</label>
              <input
                className="rounded-md border-[1px] py-1 pl-2 text-gray-900 outline-teal-700"
                type="email"
                id="email"
                name="email"
                autoFocus
              />
              <button
                className="mt-3 rounded-md bg-teal-600 py-2 px-3 font-semibold text-white shadow-md active:scale-95"
                type="submit"
              >
                Wyślij link do logowania
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  } else {
    const csrfToken = await getCsrfToken(context);
    return {
      props: { csrfToken },
    };
  }
}
