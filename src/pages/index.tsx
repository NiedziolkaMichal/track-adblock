import Head from "next/head";
import styled from "styled-components";
import { BigP, FullSizeImg } from "../components/common";
import { Header } from "../components/header";
import { SectionContent, SkewedSection, SkewedSectionHeading, SkewedSectionsJoiner } from "../components/section";
import { PositionedImageLink, PositionedLinkGrid } from "../components/positionedLinks";
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
        <SkewedSectionsJoiner $bgColor={(theme) => theme.section.explanation.bg} />
        <AdBlocksSection />
      </main>
    </>
  );
}

function ExplanationSection() {
  return (
    <SkewedSection $bgColor={(theme) => theme.section.explanation.bg} $skew="-2deg">
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

function AdBlocksSection() {
  return (
    <SkewedSection $bgColor={(theme) => theme.section.adBlocks.bg} $skew="2deg">
      <SectionContent $margin="t-60px b-60px" $gap="0 50px">
        <PositionedLinkGrid>
          <PositionedImageLink href="https://adblockplus.org" src="/img/icon/adblock-plus.svg" alt="AdBlock Plus" width={85} height={85} y={2} x={9} />
          <PositionedImageLink href="https://getadblock.com" src="/img/icon/adblock.svg" alt="AltBlock" width={66} height={66} y={12} x={-1} />
          <PositionedImageLink href="https://duckduckgo.com" src="/img/icon/duckduckgo.svg" alt="DuckDuckGo" width={47} height={47} y={30} x={45} />
          <PositionedImageLink href="https://www.ghostery.com" src="/img/icon/ghostery.svg" alt="Ghostery" width={60} height={60} y={39} x={70} />
          <PositionedImageLink href="https://www.mozilla.org/en-US/firefox/browsers/mobile/focus/" src="/img/icon/firefox-focus.svg" alt="Firefox Focus" width={66} height={66} y={35} x={15} />
          <PositionedImageLink href="https://ublockorigin.com" src="/img/icon/ublock-origin.svg" alt="uBlock Origin" width={66} height={66} y={60} x={50} />
          <PositionedImageLink href="https://www.opera.com" src="/img/icon/opera.svg" alt="Opera" width={90} height={90} y={60} x={0} />
          <PositionedImageLink href="https://adguard.com/pl/welcome.html" src="/img/icon/adguard.svg" alt="AdGuard" width={60} height={60} y={85} x={25} />
          <PositionedImageLink href="https://adlock.com" src="/img/icon/adlock.svg" alt="AdLock" width={90} height={90} y={80} x={70} />
        </PositionedLinkGrid>
        <SkewedSectionHeading $color={(theme) => theme.section.adBlocks.text} $skew="2deg">
          Nasza wtyczka
          <br /> przesyła dane do
          <br /> Google Analytics
          <br /> mimo AdBlocka!
        </SkewedSectionHeading>
      </SectionContent>
    </SkewedSection>
  );
}
