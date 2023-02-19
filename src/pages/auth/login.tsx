import { GitHubButton, GoogleButton, NegligibleLink, StyledLink, TrackAdBlockButton } from "../../components/account/button";
import { ErrorBox, H1 } from "../../components/account/common";
import { signIn } from "next-auth/react";
import { NextRouter, useRouter } from "next/router";
import { Dispatch, SetStateAction, useId, useState } from "react";
import { Label, TextField } from "../../components/account/input";
import { getAuthSharedLayout } from "../../components/auth";
import { GetServerSideProps } from "next";
import { getServerSession } from "../api/auth/[...nextauth]";
import { GetServerSidePropsContext } from "next/types";
import { AuthCard, AuthCardButton, AuthCardHrWithContent, CardBaseMargin } from "../../components/account/authCard";

export const getServerSideProps: GetServerSideProps<object> = async (context: GetServerSidePropsContext) => {
  const session = await getServerSession(context);

  if (session) {
    return {
      redirect: {
        destination: "/account",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

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
  AccessDenied: "Dane logowania są nieprawidłowe.", // Occurs when user tries to log in to oauth, without prior registering an account
  Verification: "Link do logowania stracił ważność.",
  Default: "Wystąpił problem z logowaniem",
};

type PageType = "LoginMethods" | "LoginWithPassword" | "ResetPassword";

export default function Page() {
  const [pageType, setPageType] = useState<PageType>("LoginMethods");
  const router = useRouter();
  const error = router.query.error;
  const errorMsg = typeof error === "string" ? errors[error] || error : undefined; //TODO handle "|| error" in a better way

  const adjustedPageType = error === "CredentialsSignin" ? "LoginWithPassword" : pageType;

  return (
    <>
      <H1>Przejdź do panelu użytkownika</H1>
      <AuthCard>
        {errorMsg && (
          <CardBaseMargin>
            <ErrorBox>{errorMsg}</ErrorBox>
          </CardBaseMargin>
        )}
        {adjustedPageType === "LoginMethods" && <LoginMethods setPageType={setPageType} />}
        {adjustedPageType === "LoginWithPassword" && <LoginWithPassword setPageType={setPageType} />}
        {adjustedPageType === "ResetPassword" && <ResetPassword setPageType={setPageType} />}
      </AuthCard>
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
      <AuthCardButton>Załóż nowe konto</AuthCardButton>
    </>
  );
}

function LoginWithPassword({ setPageType }: { setPageType: Dispatch<SetStateAction<PageType>> }) {
  const emailId = useId();
  const passwordId = useId();
  const router = useRouter();
  return (
    <>
      <Label htmlFor={emailId} $light={true}>
        Email
      </Label>
      <CardBaseMargin>
        <TextField id={emailId} />
      </CardBaseMargin>
      <Label htmlFor={passwordId} $light={true}>
        Hasło
      </Label>
      <CardBaseMargin>
        <TextField id={passwordId} />
      </CardBaseMargin>
      <AuthCardButton onClick={() => signIn("credentials", SIGN_IN_CALLBACK)}>Zaloguj się</AuthCardButton>
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

const SIGN_IN_CALLBACK = {
  callbackUrl: "/account",
};

function ResetPassword({ setPageType }: { setPageType: Dispatch<SetStateAction<PageType>> }) {
  const emailId = useId();
  return (
    <>
      <Label htmlFor={emailId} $light={true}>
        Email
      </Label>
      <CardBaseMargin>
        <TextField id={emailId} />
      </CardBaseMargin>
      <AuthCardButton>Zresetuj hasło</AuthCardButton>

      <AuthCardHrWithContent>lub</AuthCardHrWithContent>

      <NegligibleLink as="button" $centered={true} onClick={() => setPageType("LoginMethods")}>
        Zmień sposób logowania
      </NegligibleLink>
    </>
  );
}
