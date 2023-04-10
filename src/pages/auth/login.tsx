import { GitHubButton, GoogleButton, LinkPrimary, NegligibleLink, OrdinaryLink, TrackAdBlockButton } from "../../components/account/button";
import { ErrorBox, ErrorInline, H1 } from "../../components/account/common";
import { signIn } from "next-auth/react";
import { NextRouter, useRouter } from "next/router";
import { Dispatch, SetStateAction, useEffect, useId, useState } from "react";
import { Label, TextField } from "../../components/account/input";
import { getAuthSharedLayout } from "../../components/auth";
import { AuthCard, AuthCardButton, AuthCardContent, AuthCardHrWithContent } from "../../components/account/authCard";
import { SignInOptions } from "next-auth/react/types";
import { PageMetaData } from "../../components/metadata";
import { getAskResetPasswordUrl } from "../../lib/web/api";
import { verifyEmail } from "../../lib/util/verifyInput";
import { P } from "../../components/common";
import styled from "styled-components";

// Same list exists in register.tsx
const errors: Record<string, string> = {
  // Sign-in page errors
  Signin: "Spróbuj zalogować się z innego konta.",
  OAuthSignin: "Spróbuj zalogować się z innego konta.",
  OAuthCallback: "Spróbuj zalogować się z innego konta.",
  OAuthCreateAccount: "Spróbuj zalogować się z innego konta.",
  EmailCreateAccount: "Spróbuj zalogować się z innego konta.",
  Callback: "Spróbuj zalogować się z innego konta.",
  OAuthAccountNotLinked: "Zaloguj się poprzez to samo konto co ostatnio.",
  EmailSignin: "Email nie mógł zostac wysłany.",
  CredentialsSignin: "Email bądź hasło jest niepoprawne.",
  SessionRequired: "Zaloguj się, by uzyskać dostęp do tej strony.",
  default: "Nie udało się zalogować.",
  // Error page errors
  Configuration: "Wystąpił problem z konfiguracją serwera.",
  AccessDenied: "Dane logowania są nieprawidłowe.",
  Verification: "Link do logowania stracił ważność.",
  Default: "Wystąpił problem z logowaniem",
  // Errors thrown by `authorize` in [...nextauth]
  MissingData: "Proszę spróbować ponownie",
  AccountCreatedByOAuth: "Do tego konta można się zalogować poprzez Google lub GitHub",
  InvalidPassword: "Hasło jest niepoprawne",
  CannotRegister: "Przed zalogowniem, trzeba dokonać rejestracji",
};

type PageType = "LoginMethods" | "LoginWithPassword" | "ResetPassword" | "AskedResetPassword";

export default function Page() {
  const [pageType, setPageType] = useState<PageType>("LoginMethods");
  const router = useRouter();
  const error = router.query.error;
  const errorMsg = typeof error === "string" ? errors[error] || error : ""; //TODO handle "|| error" in a better way

  const adjustedPageType = error === "CredentialsSignin" ? "LoginWithPassword" : pageType;

  useEffect(() => {
    router.prefetch("/account");
  }, [router]);

  return (
    <>
      <PageMetaData title="Zaloguj się | Track Adblock" />
      <H1 $margin="b-30px">Przejdź do panelu użytkownika</H1>
      <AuthCard>
        <AuthCardContent>
          {errorMsg && <ErrorBox $margin="b-15px">{errorMsg}</ErrorBox>}
          {adjustedPageType === "LoginMethods" && <LoginMethods setPageType={setPageType} />}
          {adjustedPageType === "LoginWithPassword" && <LoginWithPassword setPageType={setPageType} />}
          {adjustedPageType === "ResetPassword" && <ResetPassword setPageType={setPageType} />}
          {adjustedPageType === "AskedResetPassword" && <AskedResetPassword />}
        </AuthCardContent>
      </AuthCard>
      <NegligibleLink href="/" $margin="bl-20px">
        Powrót do strony głównej
      </NegligibleLink>
    </>
  );
}

Page.getSharedLayout = getAuthSharedLayout;

function LoginMethods({ setPageType }: { setPageType: Dispatch<SetStateAction<PageType>> }) {
  return (
    <>
      <AuthCardButton as={GoogleButton} onClick={() => signIn("google", SIGN_IN_CALLBACK)}>
        Zaloguj się z Google
      </AuthCardButton>
      <AuthCardButton as={GitHubButton} onClick={() => signIn("github", SIGN_IN_CALLBACK)}>
        Zaloguj się z GitHub
      </AuthCardButton>
      <AuthCardButton as={TrackAdBlockButton} onClick={() => setPageType("LoginWithPassword")}>
        Zaloguj się z Track AdBlock
      </AuthCardButton>
      <AuthCardHrWithContent>lub</AuthCardHrWithContent>
      <AuthCardButton as={LinkPrimary} href="/auth/register">
        Załóż nowe konto
      </AuthCardButton>
    </>
  );
}

function LoginWithPassword({ setPageType }: { setPageType: Dispatch<SetStateAction<PageType>> }) {
  const emailId = useId();
  const [email, setEmail] = useState("");
  const passwordId = useId();
  const [password, setPassword] = useState("");
  const router = useRouter();

  return (
    <>
      <Label $margin="b-15px" $light={true} htmlFor={emailId}>
        Email
      </Label>
      <TextField $margin="b-15px" id={emailId} name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Label $margin="b-15px" $light={true} htmlFor={passwordId}>
        Hasło
      </Label>
      <TextField $margin="b-15px" id={passwordId} name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <AuthCardButton
        onClick={() =>
          signIn("credentials", {
            ...SIGN_IN_CALLBACK,
            email,
            password,
          })
        }
      >
        Zaloguj się
      </AuthCardButton>
      <OrdinaryLink as="button" onClick={() => (clearUrlParameters(router), setPageType("ResetPassword"))}>
        Nie pamiętam hasła
      </OrdinaryLink>

      <AuthCardHrWithContent>lub</AuthCardHrWithContent>

      <NegligibleLink as="button" $centered={true} onClick={() => (clearUrlParameters(router), setPageType("LoginMethods"))}>
        Zmień sposób logowania
      </NegligibleLink>
    </>
  );
}

function clearUrlParameters(router: NextRouter) {
  router.replace({
    query: {},
  });
}

const SIGN_IN_CALLBACK: SignInOptions = {
  callbackUrl: "/account",
};

function ResetPassword({ setPageType }: { setPageType: Dispatch<SetStateAction<PageType>> }) {
  const emailId = useId();
  const [incorrectEmail, setIncorrectEmail] = useState(false);

  async function requestResetPassword() {
    const email = (document.getElementById(emailId) as HTMLInputElement).value;
    if (!verifyEmail(email)) {
      setIncorrectEmail(true);
    } else {
      setIncorrectEmail(false);
      await fetch(getAskResetPasswordUrl(), {
        method: "POST",
        body: email,
      });
      setPageType("AskedResetPassword");
    }
  }

  return (
    <>
      <Label $margin="b-15px" $light={true} htmlFor={emailId}>
        Email {incorrectEmail && <ErrorInline>- Niepoprawny adres</ErrorInline>}
      </Label>
      <TextField $margin="b-15px" id={emailId} name="email" />
      <AuthCardButton onClick={requestResetPassword}>Zresetuj hasło</AuthCardButton>

      <AuthCardHrWithContent>lub</AuthCardHrWithContent>

      <NegligibleLink as="button" $centered={true} onClick={() => setPageType("LoginMethods")}>
        Zmień sposób logowania
      </NegligibleLink>
    </>
  );
}

function AskedResetPassword() {
  return (
    <JustifiedDiv>
      <img src="/img/icon/email.svg" width={111} height={100} alt="" />
      <P>Jeśli podany adres jest zarejestrowany w naszym serwisie, w ciągu kilku minut zostanie dostarczona wiadomość email z linkem do resetu hasła.</P>
    </JustifiedDiv>
  );
}

const JustifiedDiv = styled.div`
  display: grid;
  justify-items: center;
  text-align: justify;
  gap: 20px;
`;
