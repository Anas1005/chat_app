
'use client'
import Navigate from "@/components/Navigate";
import { useSelector } from "react-redux";

export default function Home() {

  const { isLoggedIn } = useSelector((state) => state.auth);
  console.log(isLoggedIn)
  if(isLoggedIn){
    return <Navigate to="/dashboard" replace />
  }
  else{
    return <Navigate to="/auth/login" replace />

  }
}


