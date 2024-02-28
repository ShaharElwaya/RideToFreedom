import { useRouter } from "next/router";
import { useEffect } from "react";
import { userStore } from "@/stores/userStore";

export default function Home(){
  const {push} = useRouter();
  const {is_logged_in} = userStore.getState();

  useEffect(() => {
    if(is_logged_in) {
      push('/customerFile');
    }
    else {
      push('/login');
    }
  },[])

  return null
}