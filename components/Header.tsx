import { signOut, useSession } from "next-auth/react";
import logo from "../public/images/logo.png";
import Image from "next/image";
import { useRouter } from "next/router";

export default function Header() {
  const router = useRouter();
  const { id } = router.query;
  const { data: session, status } = useSession();
  return (
    <>
      <div className="navbar relative mx-auto md:rounded-lg bg-teal-900 ">
        <div className="text-md flex-1 md:text-xl">
          <Image
            onClick={() => router.push(`/month/${id}/details`)}
            src={logo}
            alt="Logo"
            width={200}
            className="w-[170px] cursor-pointer  md:w-[200px] md:h-auto"
            priority
          />
        </div>
        <div className="flex-none">
          <button
            onClick={() => signOut()}
            className="btn-error btn-xs btn text-white md:btn-sm"
          >
            Wyloguj
          </button>
        </div>
        {status === "authenticated" && (
          <p className=" absolute right-0 -bottom-6 mt-1 pr-3 text-center text-sm text-white md:text-right">
            Witaj,&nbsp;{" "}
            <span className="font-semibold">{session?.user?.email}</span>
          </p>
        )}
      </div>
    </>
  );
}
