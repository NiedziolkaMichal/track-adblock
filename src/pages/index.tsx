import Head from "next/head";
import { Header } from "../components/header";
import { HeroImage, HeroSection } from "../components/hero";
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
      <main>
        <HeroSection heading="Śledź użytkowników AdBlocka" paragraph="Wtyczka która zwiększa dokładność Google Analytics i pozwala lepiej oszacować skuteczność reklam." buttons>
          <HeroImage src="/img/illustration/hero.svg" width={700} height={466} alt="" />
        </HeroSection>
      </main>
    </>
  );
}
