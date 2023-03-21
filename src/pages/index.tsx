import Head from "next/head";
import { Header } from "../components/header";
import { BaseBackground } from "../styles/global";

export default function Home() {
  return (
    <>
      <Head>
        <title>TODO</title>
        <meta name="description" content="TODO" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <BaseBackground />
      <Header />
      <main>TODO</main>
    </>
  );
}
