import { useEffect, useId, useState } from "react";
import { NextRouter, useRouter } from "next/router";
import { ErrorBox, ErrorInline, H1 } from "../../components/account/common";
import { AuthCard, AuthCardButton, AuthCardContent, AuthCardHrWithContent } from "../../components/account/authCard";
import { getAuthSharedLayout } from "../../components/auth";
import { GitHubButton, GoogleButton, NegligibleLink, StyledLink, TrackAdBlockButton } from "../../components/account/button";
import { signIn } from "next-auth/react";
import { Label, TextField } from "../../components/account/input";
import { FullSizeImg, P } from "../../components/common";
import { BuiltInProviderType } from "next-auth/providers";
import { getPasswordWarning, verifyEmail, verifyPassword, VerifyPasswordResult } from "../../util/verifyInput";
import { SignInOptions } from "next-auth/react/types";
import { PageMetaData } from "../../components/metadata";

export default function Page() {
  return (
    <>
      <PageMetaData title="Załóż nowe konto | Track Adblock" />
      <H1 $margin="b-30px">Załóż nowe konto</H1>
      <AuthCard>
        <AuthCardContent $center={true}>
          <RegisterDescription />
        </AuthCardContent>
        <AuthCardContent>
          <RegisterContent />
        </AuthCardContent>
      </AuthCard>
      <NegligibleLink href="/" $margin="bl-20px">
        Powrót do strony głównej
      </NegligibleLink>
    </>
  );
}

function RegisterDescription() {
  return (
    <>
      <FullSizeImg src="/img/illustration/cooperation.svg" alt="" width={430} height={270} />
      <P $margin="bl-20px">
        Sprawdź jak zachowują się użytkownicy AdBlocka przez <strong>3 dni za darmo</strong>!
      </P>
      <P $margin="b-20px">Zakładając konto, godzisz się na nasze warunki usługi oraz politykę prywatności.</P>
      <StyledLink href="/auth/login">Mam już konto</StyledLink>
    </>
  );
}

// Same list exists in login.tsc
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
  SessionRequired: "Zarejestruj się, by uzyskać dostęp do tej strony.",
  default: "Nie udało się zarejestrować.",
  // Error page errors
  Configuration: "Wystąpił problem z konfiguracją serwera.",
  AccessDenied: "Dane rejestracji są nieprawidłowe.",
  Verification: "Link do logowania stracił ważność.",
  Default: "Wystąpił problem z rejestracją",
  // Errors thrown by `authorize` in [...nextauth]
  MissingData: "Proszę spróbować ponownie",
  AccountCreatedByOAuth: "Do tego konta można się zalogować poprzez Google lub GitHub",
  InvalidPassword: "Konto o podanym adresie email już istnieje",
  CannotRegister: "Przed zalogowniem, trzeba dokonać rejestracji",
};

function RegisterContent() {
  const emailId = useId();
  const [incorrectEmail, setIncorrectEmail] = useState(false);
  const passwordId = useId();
  const [passwordState, setPasswordState] = useState<VerifyPasswordResult>("ok");
  const router = useRouter();
  const [errorMsgCode, setErrorMsgCode] = useState("");
  const errorMsg = errorMsgCode ? errors[errorMsgCode] || errorMsgCode : ""; //TODO handle "|| error" in a better way

  useEffect(() => {
    router.prefetch("/account");
  }, [router]);

  function tryRegister() {
    const email = (document.getElementById(emailId) as HTMLInputElement).value;
    const emailValid = verifyEmail(email);
    const password = (document.getElementById(passwordId) as HTMLInputElement).value;
    const passwordState = verifyPassword(password);

    if (emailValid && passwordState === "ok") {
      trySignIn("credentials", {
        email,
        password,
        canRegister: "1",
      });
    } else {
      setIncorrectEmail(!emailValid);
      setPasswordState(passwordState);
    }
  }

  async function trySignIn(provider: BuiltInProviderType, params?: Record<string, string>) {
    const result = await signInWithCredentials(provider, router, params);
    if (result !== "ok") {
      setErrorMsgCode(result);
    }
  }

  return (
    <>
      {errorMsg && <ErrorBox $margin="b-15px">{errorMsg}</ErrorBox>}
      <AuthCardButton as={GoogleButton} onClick={() => signIn("google", SIGN_IN_CALLBACK)}>
        Użyj konta Google
      </AuthCardButton>
      <AuthCardButton as={GitHubButton} onClick={() => signIn("github", SIGN_IN_CALLBACK)}>
        Użyj konta GitHub
      </AuthCardButton>
      <AuthCardHrWithContent>lub</AuthCardHrWithContent>
      <Label $margin="b-15px" $light={true} htmlFor={emailId}>
        Email {incorrectEmail && <ErrorInline>- Niepoprawny adres</ErrorInline>}
      </Label>
      <TextField $margin="b-15px" id={emailId} name="email" type="email" />
      <Label $margin="b-15px" $light={true} htmlFor={passwordId}>
        Hasło {passwordState !== "ok" && <ErrorInline>- {getPasswordWarning(passwordState)}</ErrorInline>}
      </Label>
      <TextField $margin="b-15px" id={passwordId} name="password" type="password" />
      <AuthCardButton as={TrackAdBlockButton} onClick={tryRegister}>
        Załóż nowe konto
      </AuthCardButton>
    </>
  );
}

const signInWithCredentials = async (provider: BuiltInProviderType, router: NextRouter, params?: Record<string, string>): Promise<string> => {
  //We don't use redirect: false for OAuth, because it doesn't work(always empty result is returned)
  const result = await signIn(provider, {
    redirect: false,
    ...params,
  });

  if (result?.ok) {
    router.push(SIGN_IN_CALLBACK.callbackUrl);
    return "ok";
  } else {
    return result?.error || "Default";
  }
};

const SIGN_IN_CALLBACK = {
  callbackUrl: "/account/addHost",
} satisfies SignInOptions;

Page.getSharedLayout = getAuthSharedLayout;
