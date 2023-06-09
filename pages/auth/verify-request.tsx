import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getCsrfToken } from "next-auth/react";
import Image from "next/image";
import checkMark from "../../public/images/check-mark.svg";
import logo from "../../public/images/logo.png";
import { motion } from "framer-motion";

export default function verifyRequest({
  csrfToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div className="grid min-h-screen w-full place-content-center items-center bg-landing bg-cover bg-no-repeat">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, ease: "easeInOut" }}
        className="flex flex-col place-items-center space-y-5 rounded-md bg-teal-900 p-8 shadow-md "
      >
        <div>
          <Image
            src={logo}
            alt="Logo"
            width={200}
            height={100}
            className="w-[170px] md:w-[200px]"
          />
        </div>

        <Image
          priority
          src={checkMark}
          height={100}
          width={100}
          alt="check mark"
        />
        <div className="rounded-md bg-green-600 p-2 text-white shadow-md">
          <h2 className="text-center text-xl">Sprawdź pocztę!</h2>
          <p className="text-sm">Twój link do logowania już tam jest!</p>
        </div>
        <small className="text-white">Możesz zamknąć to okno</small>
      </motion.div>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const csrfToken = await getCsrfToken(context);
  return {
    props: { csrfToken },
  };
}
