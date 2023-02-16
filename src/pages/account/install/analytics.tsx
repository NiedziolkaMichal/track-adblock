import { H1, MeasurementCardSides, QuestionLink } from "../../../components/account/common";
import { getAccountSharedLayout } from "../../../components/account/skeleton";
import { ButtonShapeShifter, LinkSecondary } from "../../../components/account/button";
import { CardCodeBlock, CardH2, CardP } from "../../../components/account/card";
import styled from "styled-components";
import { FileDownload } from "../../../components/account/install/fileDownload";

export default function Page() {
  const jsFileName = "sddsuadksa";
  const phpFileName = "dsjkdsnjasd";
  const measurementId = "G-XXXXXX";
  return (
    <>
      <H1>Zainstaluj skrypt</H1>
      <FilesCard jsFileName={jsFileName} phpFileName={phpFileName} />
      <ScriptCard jsFileName={jsFileName} measurementId={measurementId} />
    </>
  );
}

function FilesCard({ jsFileName, phpFileName }: { jsFileName: string; phpFileName: string }) {
  const completed = false;
  const onComplete = undefined;

  return (
    <CardH2 headingContent="Dodaj wymagane pliki" innerPadding={true}>
      <MeasurementCardSides>
        <div>
          <CardP>Dodaj podane pliki do głównego katalogu strony internetowej</CardP>
          <FilesContainer>
            <StyledFileDownload iconSrc="/img/icon/php.svg" filePath="/img/icon/php.svg" fileName={phpFileName + ".php"} />
            <StyledFileDownload iconSrc="/img/icon/javascript.svg" filePath="/img/icon/php.svg" fileName={jsFileName + ".js"} />
          </FilesContainer>
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

const FilesContainer = styled.div`
  display: flex;
  gap: 10px;
  margin: 15px 0 20px;
`;

const StyledFileDownload = styled(FileDownload)`
  width: 90px;
  height: 90px;
`;

function ScriptCard({ jsFileName, measurementId }: { jsFileName: string; measurementId: string }) {
  const completed = false;
  const onComplete = undefined;

  return (
    <CardH2 headingContent="Zamień skrypt Google Analytics" innerPadding={true}>
      <MeasurementCardSides>
        <div>
          <CardP>Znajdź poniższy kod Google Analytics w plikach strony internetowej</CardP>
          <CodeBlockWithMargin>&lt;script async src=&quot;https://www.googletagmanager.com/gtag/js?id={measurementId}&quot;&gt;&lt;/script&gt;</CodeBlockWithMargin>
          <CardP>Następnie zamień go na poniższą wersję</CardP>
          <CodeBlockWithMargin>&lt;script async src=&quot;/{jsFileName}.js&quot;&gt;&lt;/script&gt;</CodeBlockWithMargin>
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

const CodeBlockWithMargin = styled(CardCodeBlock)`
  margin-bottom: 20px;
`;

Page.getSharedLayout = getAccountSharedLayout;
