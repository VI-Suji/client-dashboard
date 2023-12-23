"use client";

import Button from "@/components/elements/Button";
import TextBox from "@/components/elements/TextBox";
import { signIn } from "next-auth/react";
import { useRef } from "react";

interface IProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

const LoginPage = ({ searchParams }: IProps) => {
  const userName = useRef("");
  const pass = useRef("");

  const onSubmit = async () => {
    const result = await signIn("credentials", {
      username: userName.current,
      password: pass.current,
      redirect: true,
      callbackUrl: "/",
    });
  };
  return (
    <div className={"flex flex-col justify-center items-center  h-screen bg-gradient-to-br gap-1 from-cyan-300 to-sky-600"}>
      {searchParams?.message && <p className="text-red-700 bg-red-100 py-2 px-5 rounded-md">{searchParams?.message}</p>}
      <div className="px-7 py-4 shadow bg-white rounded-md flex flex-col gap-2">
        <TextBox className="text-black" lableText="User Name" onChange={(e) => (userName.current = e.target.value)} />
        <TextBox className="text-black" lableText="Password" type={"password"} onChange={(e) => (pass.current = e.target.value)} />
        <Button onClick={onSubmit}>Login</Button>
      </div>
    </div>
  );
};

export default LoginPage;