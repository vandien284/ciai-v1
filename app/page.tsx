"use client";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    const fetchAccessToken = async () => {
      try {
        // const access_token = getCookie("access_token");
        // if (access_token) {
        //     const res = await axios.post("/api/CheckAccessToken",{
        //         headers: {
        //           "Content-Type": "application/json",
        //           "Authorization": "Bearer "+ access_token
        //         },
        //     });

        //     if (res.status === 200) {
        //         router.push("/home");
        //         return;
        //     }
        // }

        // router.push("/login");
        router.push("/home");
      } catch {
        router.push("/login");
      }
    };

    fetchAccessToken();
  }, [router]);
  return <></>;
}
