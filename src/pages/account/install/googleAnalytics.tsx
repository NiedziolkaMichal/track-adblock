import { H1, MeasurementCardSides } from "../../../components/account/common";
import { getAccountSharedLayout } from "../../../components/account/skeleton";
import { ButtonShapeShifter, QuestionLink } from "../../../components/account/button";
import { Card, CardCodeBlock, CardH2 } from "../../../components/account/card";
import { useTheme } from "styled-components";
import { FileDownload, FileDownloadGroup } from "../../../components/account/install/fileDownload";
import React from "react";
import { CardTab, CardTabs } from "../../../components/account/cardTabs";
import { P } from "../../../components/common";
import { fullEncodeUriComponent, getLastPathComponent } from "../../../util/format";
import { GetServerSidePropsContext } from "next/types";
import { GetServerSideProps } from "next";
import { getIntegration } from "../../../../db/query";
import { getServerSession } from "../../api/auth/[...nextauth]";
import { IntegrationType } from ".prisma/client";
import { LOGIN_REDIRECT } from "../../../util/redirects";
import { PageMetaData } from "../../../components/metadata";

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
  const jsFileName = getLastPathComponent(jsFilePath);
  const phpFileName = getLastPathComponent(phpFilePath);
  const phpFileUrl = `/api/file/proxy?host=${fullEncodeUriComponent(host)}`;
  const jsFileUrl = `/api/file/gtag?measurementId=${fullEncodeUriComponent(measurementId)}&redirectPath=${encodeURIComponent(phpFilePath)}`;

  return (
    <>
      <PageMetaData title="Instalacja skryptu | Track Adblock" />
      <H1 $margin="t-4px b-30px">Zainstaluj skrypt</H1>
      <DomainCard domain={host} measurementId={measurementId} />
      <FilesCard jsFileName={jsFileName} jsFileUrl={jsFileUrl} phpFileName={phpFileName} phpFileUrl={phpFileUrl} />
      <ScriptCard jsFileName={jsFileName} measurementId={measurementId} />
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

function FilesCard({ jsFileName, jsFileUrl, phpFileName, phpFileUrl }: { jsFileName: string; jsFileUrl: string; phpFileName: string; phpFileUrl: string }) {
  const completed = false;
  const onComplete = undefined;

  return (
    <CardH2 $margin="b-25px" headingContent="Dodaj wymagane pliki" innerPadding={true}>
      <MeasurementCardSides>
        <div>
          <P $margin="b-10px">Dodaj podane pliki do głównego katalogu strony internetowej</P>
          <FileDownloadGroup>
            <FileDownload iconSrc="/img/icon/php.svg" filePath={phpFileUrl} fileName={phpFileName + ".php"} />
            <FileDownload iconSrc="/img/icon/javascript.svg" filePath={jsFileUrl} fileName={jsFileName + ".js"} />
          </FileDownloadGroup>
          <ButtonShapeShifter onClick={onComplete} $state={completed ? "valid" : "primary"} disabled={completed}>
            {!completed && "Pliki zostały dodane"}
            {completed && "Pliki są dodane prawidłowo"}
          </ButtonShapeShifter>
        </div>
        <div>
          <QuestionLink href="">Do czego służą te pliki?</QuestionLink>
          <QuestionLink href="">Dlaczego mają nietypowe nazwy?</QuestionLink>
          <QuestionLink href="">Czy dodanie tych plików jest bezpieczne?</QuestionLink>
        </div>
      </MeasurementCardSides>
    </CardH2>
  );
}

function ScriptCard({ jsFileName, measurementId }: { jsFileName: string; measurementId: string }) {
  const completed = false;
  const onComplete = undefined;

  return (
    <CardH2 headingContent="Zamień skrypt Google Analytics" innerPadding={true}>
      <MeasurementCardSides>
        <div>
          <P $margin="b-10px">Znajdź poniższy kod Google Analytics w plikach strony internetowej</P>
          <CardCodeBlock $margin="b-20px">&lt;script async src=&quot;https://www.googletagmanager.com/gtag/js?id={measurementId}&quot;&gt;&lt;/script&gt;</CardCodeBlock>
          <P $margin="b-10px">Następnie zamień go na poniższą wersję</P>
          <CardCodeBlock $margin="b-20px">&lt;script async src=&quot;/{jsFileName}.js&quot;&gt;&lt;/script&gt;</CardCodeBlock>
          <ButtonShapeShifter onClick={onComplete} $state={completed ? "valid" : "primary"} disabled={completed}>
            {!completed && "Skrypt został zamieniony"}
            {completed && "Skrypt jest zamieniony prawidłowo"}
          </ButtonShapeShifter>
        </div>
        <div>
          <QuestionLink href="">Do czego służy ta zmiana?</QuestionLink>
          <QuestionLink href="">Jak mogę znaleźć ten kod?</QuestionLink>
          <QuestionLink href="">Czy jest to bezpieczne?</QuestionLink>
        </div>
      </MeasurementCardSides>
    </CardH2>
  );
}

Page.getSharedLayout = getAccountSharedLayout;