import { type GetServerSideProps, type NextPage } from "next";
import { getServerSession } from "next-auth";
import { signIn } from "next-auth/react";
import Head from "next/head";
import { Button } from "~/components/Button";
import { authOptions } from "~/server/auth";

const AuthPage: NextPage = () => {
  return (
    <>
      <Head key={"home"}>
        <title>CodeMart</title>
        <meta
          name="description"
          content="Marketplace for selling source code"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <>
        <div className="mx-4 mt-32 grid max-w-sm gap-y-8 bg-white px-8 py-8 text-center shadow-md md:mx-auto">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">Welcome Back</h1>
            <p>Please use your credentials using</p>
          </div>

          <Button style="outline" onClick={() => signIn("google")}>
            Sign Up with Google
          </Button>
        </div>
      </>
    </>
  );
};

export default AuthPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
