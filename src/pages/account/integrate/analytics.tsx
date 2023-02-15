import { getAccountSharedLayout } from "../../../components/account/skeleton";
import styled from "styled-components";
import { CardH2 } from "../../../components/account/card";
import { useCallback, useEffect, useState } from "react";
import { ButtonShapeShifter } from "../../../components/account/button";
import isValidDomain from "is-valid-domain";
import { InvalidInput, Label, TextField } from "../../../components/account/input";
import { NextRouter, useRouter } from "next/router";
import { useInputWithCallback } from "../../../hooks/inputHooks";
import { H1, MeasurementCardSides, QuestionLink } from "../../../components/account/common";
import { verifyMeasurementId } from "../../../util/verifyInput";

const NEXT_PAGE = "/account/install/analytics";

export default function Page() {
  const { setDomain, setMeasurementId } = useDomainAndMeasurementId();

  return (
    <>
      <H1>Dodaj Google Analytics</H1>
      <DomainCard setDomain={setDomain} />
      <MeasurementIdCard setMeasurementId={setMeasurementId} />
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

  return { setDomain, setMeasurementId };
}

function saveDataAndRedirect(domain: string, measurementId: string, router: NextRouter) {
  router.push(NEXT_PAGE);
}

const UrlTextField = styled(TextField)`
  width: 100%;
  max-width: 400px;
  margin-bottom: 20px;
`;

function useDomainInputWithCallback(setDomain: (domain: string) => void) {
  const getValueFromInput = (input: string) => getDomainFromUrl(input);
  return useInputWithCallback(setDomain, getValueFromInput);
}

function DomainCard({ setDomain }: { setDomain: (domain: string) => void }) {
  const { fieldId, completed, invalid, onAddId } = useDomainInputWithCallback(setDomain);

  return (
    <CardH2 headingContent="Nazwa domeny" innerPadding={true}>
      <Label htmlFor={fieldId}>Adres URL witryny, dla której zostanie odblokowana analityka</Label>
      <UrlTextField id={fieldId} name="url" placeholder="https://" type="url" disabled={completed} />
      {invalid && <InvalidInputWithMargin>Przekazany adres jest nieprawidłowy</InvalidInputWithMargin>}
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

function MeasurementIdCard({ setMeasurementId }: { setMeasurementId: (id: string) => void }) {
  const { fieldId, completed, invalid, onAddId } = useMeasurementIdInputWithCallback(setMeasurementId);

  return (
    <CardH2 headingContent="Identyfikator pomiaru" innerPadding={true}>
      <MeasurementCardSides>
        <div>
          <Label htmlFor={fieldId}>Identyfikator Google Analytics w formacie &quot;G-XXXXXXXX&quot;</Label>
          <UrlTextField id={fieldId} placeholder="G-XXXXXXXX" disabled={completed} />
          {invalid && <InvalidInputWithMargin>Przekazany identyfikator jest nieprawidłowy</InvalidInputWithMargin>}
          <ButtonShapeShifter onClick={onAddId} $state={completed ? "valid" : "primary"} disabled={completed}>
            {!completed && "Dodaj identyfikator"}
            {completed && "Identyfikator dodany"}
          </ButtonShapeShifter>
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

const InvalidInputWithMargin = styled(InvalidInput)`
  margin-bottom: 10px;
  margin-top: -10px;
`;

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
