import Loader from "@/components/Loader";
import { IMonth } from "@/types";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
interface Props {
  data: IMonth[];
}
export default function CreateInitialData({ data }: Props) {
  const router = useRouter();
  useEffect(() => {
    if (data) {
      router.push("/");
    }
  }, [data, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <Loader />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  
  if (session?.user?.email) {
    const res = await fetch(`${process.env.NEXT_URL}/api/initial-data/createData`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userEmail: session.user.email }),
    });
    const data = await res.json();
    return { props: { data } };
  } else {
    return { props: {} };
  }
};
