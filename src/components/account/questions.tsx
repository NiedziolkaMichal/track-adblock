import { QuestionBtn } from "./button";
import { QuestionWithTooltip } from "../tooltip";
import { UnStyledOl } from "../common";

export function HowToGetMeasurementId() {
  return (
    <QuestionWithTooltip
      tooltip={
        <UnStyledOl>
          <li>Zaloguj się na konto Google Analytics.</li>
          <li>Kliknij Administracja.</li>
          <li>W kolumnie Usługa kliknij Strumienie danych.</li>
          <li>Kliknij strumień danych, którego identyfikatora potrzebujesz.</li>
          <li>Użyj wartości nagłówka IDENTYFIKATOR POMIARU.</li>
        </UnStyledOl>
      }
    >
      <QuestionBtn>Gdzie znajdę identyfikator?</QuestionBtn>
    </QuestionWithTooltip>
  );
}

export function WhyWeNeedMeasurementId() {
  return (
    <QuestionWithTooltip tooltip="Potrzebujemy identyfikatora by przygotować kod JavaScript, który trzeba będzie umieścić na stronie.">
      <QuestionBtn>Dlaczego wymagamy tej informacji?</QuestionBtn>
    </QuestionWithTooltip>
  );
}

export function IsItSafeToShareMeasurementId() {
  return (
    <QuestionWithTooltip tooltip="Identyfikatory są jawnie umieszczane przez wszystkie strony używające Google Analytics. Można się dowolnie nim dzielić.">
      <QuestionBtn>Czy dzielenie się identyfikatorem jest bezpieczne?</QuestionBtn>
    </QuestionWithTooltip>
  );
}

export function WhatAreScriptsUsedFor() {
  return (
    <QuestionWithTooltip tooltip="Plik JavaScript jest tym samym plikiem który udostępnia Google Analytics, ale został lekko zmieniony by wysyłał żadania do pliku PHP. Drugi plik odbiera żądania użytkownika i przekierowuje je do naszego serwera.">
      <QuestionBtn>Do czego służą te pliki?</QuestionBtn>
    </QuestionWithTooltip>
  );
}

export function WhyScriptsHaveRandomNames() {
  return (
    <QuestionWithTooltip tooltip="AdBlocki blokują pliki na podstawie nazw. Nazwy naszych plików zostały wygenerowane losowo, by upewnić się że nie są zablokowane.">
      <QuestionBtn>Dlaczego mają nietypowe nazwy?</QuestionBtn>
    </QuestionWithTooltip>
  );
}

export function IsItSafeToAddOurScripts() {
  return (
    <QuestionWithTooltip tooltip="Kod obu plików jest jawny, można dowolnie sprawdzić co każda z funkcji robi. W razie wątpliwości, sposób działania możemy wytłumaczyć dokładniej.">
      <QuestionBtn>Dlaczego mają nietypowe nazwy?</QuestionBtn>
    </QuestionWithTooltip>
  );
}

export function WhyReplaceGoogleAnalyticsScript() {
  return (
    <QuestionWithTooltip tooltip="Domyślnie plik JavaScript wysyłający zdarzenia do Google Analytics jest pobierany z serwerów Google i jest blokowany przez AdBlocki. Ten kod sprawi że użytkownicy będą używali pliku JavaScript dodanego w poprzednim kroku.">
      <QuestionBtn>Do czego służy ta zmiana?</QuestionBtn>
    </QuestionWithTooltip>
  );
}

export function WhyToFindGoogleAnalyticsScript() {
  return (
    <QuestionWithTooltip tooltip="Niestety znalezienie tego kodu zależy do używanego systemu dostarczania treści. W razie problemów, prosimy o kontakt przez chat.">
      <QuestionBtn>Jak mogę znaleźć ten kod?</QuestionBtn>
    </QuestionWithTooltip>
  );
}
