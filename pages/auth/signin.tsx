import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getCsrfToken } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import logo from "../../public/images/logo.png";
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

      <div className="relative flex min-h-screen w-full flex-col place-content-center items-center  bg-gradient-to-b from-teal-600 to-blue-300 text-neutral-900">
        <div className="flex w-full  items-center justify-center md:top-0">
          <div className="flex w-full max-w-full  flex-col place-items-center space-y-5 rounded-md bg-teal-900 p-8 shadow-md md:max-w-xs ">
            <Image
              src={logo}
              alt="Logo"
              width={200}
              height={100}
              className="w-[170px] md:w-[200px]"
            />
            <form
              className="flex flex-col gap-y-2"
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
                className="mt-3 rounded-md bg-success py-2 px-3 font-semibold text-white shadow-md active:scale-95"
                type="submit"
              >
                Wyślij link do logowania
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const csrfToken = await getCsrfToken(context);
  return {
    props: { csrfToken },
  };
}
