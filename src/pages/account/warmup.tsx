import { GetServerSidePropsContext } from "next/types";
import { GetServerSideProps } from "next";
import { getHosts } from "../../../db/query";

/**
 * This page is called automatically every few minutes by a worker.
 * Its purpose is to remove cold start, caused by the loading of NodeJS and establishing a database connection.
 * This page is not placed in /api because it looks like Vercel is running a separate NodeJS instance for API routes.
 */
export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  if (context.req.method === "POST" && context.req.headers.authorization === `Bearer ${process.env.INTERNAL_SECRET}`) {
    await getHosts("");
  }

  return {
    props: {},
  };
};

export default function Page() {
  return <></>;
}
