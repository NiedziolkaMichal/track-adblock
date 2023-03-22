import { getAccountSharedLayout } from "../../components/account/skeleton";
import styled from "styled-components";
import { CardH2 } from "../../components/account/card";
import { useCallback, useEffect, useRef, useState } from "react";
import { ButtonShapeShifter, LinkSecondary, QuestionLink } from "../../components/account/button";
import isValidDomain from "is-valid-domain";
import { InvalidInput, Label, TextField } from "../../components/account/input";
import { NextRouter, useRouter } from "next/router";
import { useInputWithCallback } from "../../hooks/inputHooks";
import { H1, MeasurementCardSides } from "../../components/account/common";
import { MAX_HOSTS_PER_USER, verifyMeasurementId } from "../../util/verifyInput";
import { MarginValue } from "../../components/margin";
import { fetchAnalyticsId } from "../../hooks/apiHooks";
import { GetServerSideProps } from "next";
import { GetServerSidePropsContext } from "next/types";
import { getServerSession } from "../api/auth/[...nextauth]";
import { ACCOUNT_REDIRECT, LOGIN_REDIRECT } from "../../util/redirects";
import { fullEncodeUriComponent } from "../../util/format";
import { getHosts } from "../../../db/query";
import { ButtonList } from "../../components/common";

const NEXT_PAGE = "/account/install/analytics";

export const getServerSideProps: GetServerSideProps<object> = async (context: GetServerSidePropsContext) => {
  const session = await getServerSession(context);
  const userId = session?.user.id;

  if (!userId) {
    return LOGIN_REDIRECT;
  }

  const hosts = await getHosts(userId);
  if (hosts.length >= MAX_HOSTS_PER_USER) {
    return ACCOUNT_REDIRECT;
  }

  return {
    props: {},
  };
};

export default function Page() {
  const { domain, setDomain, setMeasurementId } = useDomainAndMeasurementId();

  return (
    <>
      <H1 $margin="t-4px b-30px">Dodaj Google Analytics</H1>
      <DomainCard setDomain={setDomain} />
      <MeasurementIdCard domain={domain} setMeasurementId={setMeasurementId} />
    </>
  );
}

function useDomainAndMeasurementId() {
  const [domain, setDomainState] = useState<string | undefined>(undefined);
  const [measurementId, setMeasurementIdState] = useState<string | undefined>(undefined);
  const router = useRouter();

  useEffect(() => {
    router.prefetch(NEXT_PAGE);
  });

  const setDomain = useCallback(
    (domain: string) => {
      setDomainState(domain);
      if (measurementId) {
        saveDataAndRedirect(domain, measurementId, router);
      }
    },
    [measurementId, router]
  );

  const setMeasurementId = useCallback(
    (measurementId: string) => {
      setMeasurementIdState(domain);
      if (domain) {
        saveDataAndRedirect(domain, measurementId, router);
      }
    },
    [domain, router]
  );

  return { domain, setDomain, setMeasurementId };
}

async function saveDataAndRedirect(domain: string, measurementId: string, router: NextRouter) {
  const response = await fetch(`/api/host/${fullEncodeUriComponent(domain)}/analytics?measurementId=${fullEncodeUriComponent(measurementId)}`, {
    method: "PUT",
  });
  const text = await response.text();
  if (text === "OK") {
    router.push(`${NEXT_PAGE}?host=${fullEncodeUriComponent(domain)}`);
  } else {
    router.push("/account");
  }
}

const UrlTextField = styled(TextField)<{ $margin?: MarginValue }>`
  max-width: 400px;
`;

function useDomainInputWithCallback(setDomain: (domain: string) => void) {
  const inputWithScheme = (input: string) => (input.startsWith("http:") || input.startsWith("https:") ? input : `https://${input}`);
  const getValueFromInput = (input: string) => getDomainFromUrl(inputWithScheme(input));
  return useInputWithCallback(setDomain, getValueFromInput);
}

function DomainCard({ setDomain }: { setDomain: (domain: string) => void }) {
  const { fieldId, completed, invalid, onAddId } = useDomainInputWithCallback(setDomain);

  return (
    <CardH2 $margin="b-25px" headingContent="Nazwa domeny" innerPadding={true}>
      <Label $margin="b-10px" htmlFor={fieldId}>
        Adres URL witryny, dla której zostanie odblokowana analityka
      </Label>
      <UrlTextField $margin={invalid ? "b-10px" : "b-20px"} id={fieldId} name="url" placeholder="https://" type="url" disabled={completed} />
      {invalid && <InvalidInput $margin="b-10px">Przekazany adres jest nieprawidłowy</InvalidInput>}
      <ButtonShapeShifter onClick={onAddId} $state={completed ? "valid" : "primary"} disabled={completed}>
        {!completed && "Dodaj domenę"}
        {completed && "Domena dodana"}
      </ButtonShapeShifter>
    </CardH2>
  );
}

function useMeasurementIdInputWithCallback(setMeasurementId: (id: string) => void) {
  const getValueFromInput = (input: string) => (verifyMeasurementId(input) ? input : undefined);
  return useInputWithCallback(setMeasurementId, getValueFromInput);
}

function MeasurementIdCard({ setMeasurementId, domain }: { setMeasurementId: (id: string) => void; domain: string | undefined }) {
  const textFieldRef = useRef<HTMLInputElement>(null);
  const { fieldId, completed, invalid, onAddId, setInvalid } = useMeasurementIdInputWithCallback(setMeasurementId);

  async function onClickDetectId() {
    if (!domain) {
      setInvalid("DOMAIN");
      return;
    }
    const measurementId = await fetchAnalyticsId(`https://${domain}`);
    if (!measurementId) {
      setInvalid("ANALYTICS_MISSING");
      return;
    }
    if (textFieldRef.current) {
      textFieldRef.current.value = measurementId;
    }
  }

  return (
    <CardH2 headingContent="Identyfikator pomiaru" innerPadding={true}>
      <MeasurementCardSides>
        <div>
          <Label $margin="b-10px" htmlFor={fieldId}>
            Identyfikator Google Analytics w formacie &quot;G-XXXXXXXX&quot;
          </Label>
          <UrlTextField $margin={invalid ? "b-10px" : "b-20px"} id={fieldId} ref={textFieldRef} placeholder="G-XXXXXXXX" disabled={completed} />
          {invalid === "VALUE" && <InvalidInput $margin="b-10px">Przekazany identyfikator jest nieprawidłowy</InvalidInput>}
          {invalid === "DOMAIN" && <InvalidInput $margin="b-10px">Pierwsze dodaj domenę</InvalidInput>}
          {invalid === "ANALYTICS_MISSING" && <InvalidInput $margin="b-10px">Nie wykryto identyfikatora</InvalidInput>}
          <ButtonList>
            <ButtonShapeShifter onClick={onAddId} $state={completed ? "valid" : "primary"} disabled={completed}>
              {!completed && "Dodaj identyfikator"}
              {completed && "Identyfikator dodany"}
            </ButtonShapeShifter>
            <LinkSecondary as="button" onClick={onClickDetectId}>
              Wykryj identyfikator
            </LinkSecondary>
          </ButtonList>
        </div>
        <div>
          <QuestionLink href="">Gdzie znajdę identyfikator?</QuestionLink>
          <QuestionLink href="">Dlaczego wymagamy tej informacji?</QuestionLink>
          <QuestionLink href="">Czy dzielenie się identyfikatorem jest bezpieczne?</QuestionLink>
        </div>
      </MeasurementCardSides>
    </CardH2>
  );
}

function getDomainFromUrl(url: string) {
  try {
    const parsed = new URL(url);
    const domain = parsed.hostname;
    return isValidDomain(domain) ? domain : undefined;
  } catch (e) {
    return undefined;
  }
}

Page.getSharedLayout = getAccountSharedLayout;
