import Loader from "@/components/Loader";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function CreateInitialData() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        if (session?.user?.email) {
          const months = await fetch(
            `${process.env.NEXT_PUBLIC_URL}/api/months`
          );
          const monthsData = await months.json();
          if (monthsData.length > 0) {
            setLoading(false);
            router.push("/");
            return;
          } else {
            const res = await fetch(
              `${process.env.NEXT_PUBLIC_URL}/api/initial-data/createData`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ userEmail: session.user.email }),
              }
            );
            if (res.status === 201 || res.status === 200) {
              setLoading(false);
              router.push("/");
            }
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [session, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      {loading && <Loader />}
    </div>
  );
}
