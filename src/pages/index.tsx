import Head from "next/head";
import styled from "styled-components";
import { BigOrderedList, BigP, FullSizeImg } from "../components/common";
import { Header } from "../components/header";
import { BaseSectionHeading, Section, SectionContent, SkewedSection, SkewedSectionHeading, SkewedSectionsJoiner } from "../components/section";
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
        <HowItWorksSection />
        <CompatibilitySection />
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

function HowItWorksSection() {
  return (
    <Section $margin="t-140px b-140px">
      <BaseSectionHeading $color={(theme) => theme.section.howItWorks.text} $margin="b-50px" id="how-it-works">
        Jak to działa?
      </BaseSectionHeading>
      <SectionContent $gap="50px">
        <HowItWorksImg src="/img/illustration/laptop.svg" width={600} height={420} alt="" />
        <HowItWorksList $color={(theme) => theme.section.howItWorks.liMarkerColor} $borderColor={(theme) => theme.section.howItWorks.liMarkerBorder}>
          <li>
            <BigP>AdBlocki działają poprzez blokowanie adresów URL które zostały dodane do czarnej listy</BigP>
          </li>
          <li>
            <BigP>Nasza wtyczka tworzy plik o losowej nazwie, który będzie przekierowywał analitykę</BigP>
          </li>
          <li>
            <BigP>Dodatkowo codziennie skanujemy czarne listy, upewniając się że wszystko działa poprawnie</BigP>
          </li>
        </HowItWorksList>
      </SectionContent>
    </Section>
  );
}

const HowItWorksImg = styled(FullSizeImg)`
  max-width: 31rem;
`;

export const HowItWorksList = styled(BigOrderedList).attrs(() => ({
  $size: "4rem",
  $weight: 900,
}))`
  > li {
    max-width: 27rem;
    margin-bottom: 30px;

    @media (max-width: 15rem) {
      grid-template-columns: initial;
      text-align: center;
    }
  }

  > li::before {
    @media (max-width: 15rem) {
      margin: auto;
    }
  }
`;

function CompatibilitySection() {
  return (
    <SkewedSection $bgColor={(theme) => theme.section.compatibility.bg} $skew="-2deg">
      <SectionContent $margin="t-60px b-60px" $gap="0 50px" $wrapReverse={true}>
        <div>
          <SkewedSectionHeading $color={(theme) => theme.section.compatibility.text} $skew="-2deg" $margin="l-auto">
            Nasza wtyczka
            <br /> zadziała na
            <br /> każdej stronie
            <br /> internetowej!
          </SkewedSectionHeading>
        </div>
        <PositionedLinkGrid>
          <PositionedImageLink href="https://wordpress.org" src="/img/icon/wordpress.svg" alt="WordPress" width={122} height={122} y={2} x={5} />
          <PositionedImageLink href="https://www.shopify.com" src="/img/icon/shopify.svg" alt="Shopify" width={61} height={61} y={12} x={70} />
          <PositionedImageLink href="https://typo3.org" src="/img/icon/typo3.svg" alt="TYPO3" width={99} height={99} y={32} x={-1} />
          <PositionedImageLink href="https://www.blogger.com" src="/img/icon/blogger.svg" alt="Blogger" width={62} height={62} y={30} x={40} />
          <PositionedImageLink href="https://www.drupal.org" src="/img/icon/drupal.svg" alt="Drupal" width={166} height={44} y={50} x={0} />
          <PositionedImageLink href="https://www.hubspot.com" src="/img/icon/hubspot.svg" alt="HubSpot" width={106} height={31} y={65} x={15} />
          <PositionedImageLink href="https://www.joomla.org" src="/img/icon/joomla.svg" alt="Joomla" width={80} height={80} y={78} x={0} />
          <PositionedImageLink href="https://business.adobe.com/pl/products/magento/magento-commerce.html" src="/img/icon/magento.svg" alt="Magento" width={91} height={91} y={85} x={35} />
          <PositionedImageLink href="https://pl.wix.com" src="/img/icon/wix.svg" alt="Wix" width={64} height={64} y={60} x={60} />
          <PositionedImageLink href="https://woocommerce.com/" src="/img/icon/woocommerce.svg" alt="WooCommerce" width={85} height={51} y={80} x={-1} />
        </PositionedLinkGrid>
      </SectionContent>
    </SkewedSection>
  );
}
