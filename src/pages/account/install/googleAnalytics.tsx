import { H1, MeasurementCardSides } from "../../../components/account/common";
import { getAccountSharedLayout } from "../../../components/account/skeleton";
import { ButtonShapeShifter } from "../../../components/account/button";
import { Card, CardCodeBlock, CardH2 } from "../../../components/account/card";
import { useTheme } from "styled-components";
import { FileDownload, FileDownloadGroup } from "../../../components/account/install/fileDownload";
import React, { useState } from "react";
import { CardTab, CardTabs } from "../../../components/account/cardTabs";
import { P } from "../../../components/common";
import { getLastPathComponent } from "../../../util/format";
import { GetServerSidePropsContext } from "next/types";
import { GetServerSideProps } from "next";
import { getIntegration } from "../../../../db/query";
import { getServerSession } from "../../api/auth/[...nextauth]";
import { IntegrationType } from ".prisma/client";
import { LOGIN_REDIRECT } from "../../../util/redirects";
import { PageMetaData } from "../../../components/metadata";
import { IsItSafeToAddOurScripts, WhatAreScriptsUsedFor, WhyReplaceGoogleAnalyticsScript, WhyScriptsHaveRandomNames, WhyToFindGoogleAnalyticsScript } from "../../../components/account/questions";
import { getGTagFileUrl, getProxyFileUrl, getVerifyGTagInstallationUrl, getVerifyProxyInstallationUrl } from "../../../util/web/api";

interface Props {
  host: string;
  measurementId: string;
  jsFilePath: string;
  phpFilePath: string;
}

export const getServerSideProps: GetServerSideProps<Props> = async (context: GetServerSidePropsContext) => {
  const host = context.query.host;
  if (typeof host !== "string") {
    return LOGIN_REDIRECT;
  }

  const session = await getServerSession(context);
  const userId = session?.user.id;

  if (!userId) {
    return LOGIN_REDIRECT;
  }

  const integration = await getIntegration(userId, host, IntegrationType.googleAnalytics);

  if (!integration) {
    return LOGIN_REDIRECT;
  }

  return {
    props: {
      host,
      ...integration,
    },
  };
};

export default function Page({ host, measurementId, jsFilePath, phpFilePath }: Props) {
  return (
    <>
      <PageMetaData title="Instalacja skryptu | Track Adblock" />
      <H1 $margin="t-4px b-30px">Zainstaluj skrypt</H1>
      <DomainCard domain={host} measurementId={measurementId} />
      <FilesCard host={host} measurementId={measurementId} jsFilePath={jsFilePath} phpFilePath={phpFilePath} />
      <ScriptCard jsFilePath={jsFilePath} measurementId={measurementId} />
    </>
  );
}

function DomainCard({ domain, measurementId }: { domain: string; measurementId: string }) {
  const theme = useTheme();
  return (
    <Card $margin="b-25px">
      <CardTabs>
        <CardTab title="ADRES WITRYNY" value={domain} valueColor={theme.graph.requests.all} />
        <CardTab title="IDENTYFIKATOR POMIARU" value={measurementId} valueColor={theme.graph.requests.all} />
      </CardTabs>
    </Card>
  );
}

function FilesCard({ host, measurementId, jsFilePath, phpFilePath }: { host: string; measurementId: string; jsFilePath: string; phpFilePath: string }) {
  const [completed, setCompleted] = useState(false);

  async function onComplete() {
    const jsPromise = fetch(getVerifyGTagInstallationUrl(host, jsFilePath));
    const phpPromise = fetch(getVerifyProxyInstallationUrl(host, phpFilePath));
    const [jsResponse, phpResponse] = await Promise.all([jsPromise, phpPromise]);
    const [jsOk, phpOk] = await Promise.all([jsResponse.text(), phpResponse.text()]);
    setCompleted(jsOk === "true" && phpOk === "true");
  }

  return (
    <CardH2 $margin="b-25px" headingContent="Dodaj wymagane pliki" innerPadding={true}>
      <MeasurementCardSides>
        <div>
          <P $margin="b-10px">Dodaj podane pliki do głównego katalogu strony internetowej</P>
          <FileDownloadGroup>
            <FileDownload iconSrc="/img/icon/php.svg" filePath={getProxyFileUrl(host)} fileName={getLastPathComponent(phpFilePath) + ".php"} />
            <FileDownload iconSrc="/img/icon/javascript.svg" filePath={getGTagFileUrl(measurementId, phpFilePath)} fileName={getLastPathComponent(jsFilePath) + ".js"} />
          </FileDownloadGroup>
          <ButtonShapeShifter onClick={onComplete} $state={completed ? "valid" : "primary"} disabled={completed}>
            {!completed && "Pliki zostały dodane"}
            {completed && "Pliki są dodane prawidłowo"}
          </ButtonShapeShifter>
        </div>
        <div>
          <WhatAreScriptsUsedFor />
          <WhyScriptsHaveRandomNames />
          <IsItSafeToAddOurScripts />
        </div>
      </MeasurementCardSides>
    </CardH2>
  );
}

function ScriptCard({ jsFilePath, measurementId }: { jsFilePath: string; measurementId: string }) {
  const completed = false;
  const onComplete = undefined;

  return (
    <CardH2 headingContent="Zamień skrypt Google Analytics" innerPadding={true}>
      <MeasurementCardSides>
        <div>
          <P $margin="b-10px">Znajdź poniższy kod Google Analytics w plikach strony internetowej</P>
          <CardCodeBlock $margin="b-20px">&lt;script async src=&quot;https://www.googletagmanager.com/gtag/js?id={measurementId}&quot;&gt;&lt;/script&gt;</CardCodeBlock>
          <P $margin="b-10px">Następnie zamień go na poniższą wersję</P>
          <CardCodeBlock $margin="b-20px">&lt;script async src=&quot;/{getLastPathComponent(jsFilePath)}.js&quot;&gt;&lt;/script&gt;</CardCodeBlock>
          <ButtonShapeShifter onClick={onComplete} $state={completed ? "valid" : "primary"} disabled={completed}>
            {!completed && "Skrypt został zamieniony"}
            {completed && "Skrypt jest zamieniony prawidłowo"}
          </ButtonShapeShifter>
        </div>
        <div>
          <WhyReplaceGoogleAnalyticsScript />
          <WhyToFindGoogleAnalyticsScript />
        </div>
      </MeasurementCardSides>
    </CardH2>
  );
}

Page.getSharedLayout = getAccountSharedLayout;
