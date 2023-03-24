import Head from "next/head";
import styled from "styled-components";
import { BigP, FullSizeImg } from "../components/common";
import { Header } from "../components/header";
import { SectionContent, SkewedSection } from "../components/section";
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
        <ExplanationSection />
      </main>
    </>
  );
}

function ExplanationSection() {
  return (
    <SkewedSection $bgColor={(theme) => theme.background.section_1} $skew="-2deg">
      <SectionContent $gap="50px" $margin="t-90px b-120px" $alignItems="baseline">
        <ColumnWithImg>
          <FullSizeImg src="img/illustration/blocked.svg" width={2536} height={1272} alt="" />
          <BigP $margin="t-30px">
            W Polsce <b>44%</b> użytkowników korzysta z różnego rodzaju oprogramowania blokującego reklamy, które przy okazji blokuje dane przesyłane do Google Analytics.
          </BigP>
        </ColumnWithImg>
        <ColumnWithImg>
          <FullSizeImg src="img/illustration/chart.svg" width={720} height={440} alt="" />
          <BigP $margin="t-30px">Liczba wyjść do witryny, czas zaangażowania, konwersje, raporty, a także zdarzenia niestandardowe, nie uwzględniają prawię połowy użytkowników.</BigP>
        </ColumnWithImg>
        <ColumnWithImg>
          <FullSizeImg src="img/illustration/bulls-eye.svg" width={631} height={433} alt="" />
          <BigP $margin="t-30px">Prowadzi to do błędnej oceny skuteczności reklam, pozycjonowania, pisanych artykułów oraz innych wysiłków w promowaniu wizerunku w sieci.</BigP>
        </ColumnWithImg>
      </SectionContent>
    </SkewedSection>
  );
}

const ColumnWithImg = styled.div`
  max-width: 350px;

  > img {
    max-height: 180px;
    margin: auto;
  }

  @media (max-width: 806px) {
    text-align: center;
    max-width: 500px;

    > img {
      max-height: 250px;
    }
  }
`;
