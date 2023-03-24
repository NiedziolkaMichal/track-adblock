import { GitHubButton, GoogleButton, LinkPrimary, NegligibleLink, StyledLink, TrackAdBlockButton } from "../../components/account/button";
import { ErrorBox, H1 } from "../../components/account/common";
import { signIn } from "next-auth/react";
import { NextRouter, useRouter } from "next/router";
import { Dispatch, SetStateAction, useEffect, useId, useState } from "react";
import { Label, TextField } from "../../components/account/input";
import { getAuthSharedLayout } from "../../components/auth";
import { GetServerSideProps } from "next";
import { getServerSession } from "../api/auth/[...nextauth]";
import { GetServerSidePropsContext } from "next/types";
import { AuthCard, AuthCardButton, AuthCardContent, AuthCardHrWithContent } from "../../components/account/authCard";
import { SignInOptions } from "next-auth/react/types";
import { ACCOUNT_REDIRECT } from "../../util/redirects";
import { PageMetaData } from "../../components/metadata";

export const getServerSideProps: GetServerSideProps<object> = async (context: GetServerSidePropsContext) => {
  const session = await getServerSession(context);

  if (session) {
    return ACCOUNT_REDIRECT;
  }

  return {
    props: {},
  };
};

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

type PageType = "LoginMethods" | "LoginWithPassword" | "ResetPassword";

export default function Page() {
  const [pageType, setPageType] = useState<PageType>("LoginMethods");
  const router = useRouter();
  const error = router.query.error;
  const errorMsg = typeof error === "string" ? errors[error] || error : ""; //TODO handle "|| error" in a better way

  const adjustedPageType = error === "CredentialsSignin" ? "LoginWithPassword" : pageType;

  useEffect(() => {
    router.prefetch("/account");
  });

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
      <StyledLink as="button" onClick={() => (clearUrlParameters(router), setPageType("ResetPassword"))}>
        Nie pamiętam hasła
      </StyledLink>

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
  return (
    <>
      <Label $margin="b-15px" $light={true} htmlFor={emailId}>
        Email
      </Label>
      <TextField $margin="b-15px" id={emailId} />
      <AuthCardButton>Zresetuj hasło</AuthCardButton>

      <AuthCardHrWithContent>lub</AuthCardHrWithContent>

      <NegligibleLink as="button" $centered={true} onClick={() => setPageType("LoginMethods")}>
        Zmień sposób logowania
      </NegligibleLink>
    </>
  );
}
