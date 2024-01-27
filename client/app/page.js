
'use client'
import Navigate from "@/components/Navigate";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { apiConnector } from "@/services/apiConnector";
export default function Home() {

  useEffect(() => {
    (async () => {
      await apiConnector("GET","/visit");
    })();
  }, []);
  

  const { isLoggedIn } = useSelector((state) => state.auth);
  console.log(isLoggedIn)
  if(isLoggedIn){
    return <Navigate to="/dashboard" replace />
  }
  else{
    return <Navigate to="/auth/login" replace />

  }
}


