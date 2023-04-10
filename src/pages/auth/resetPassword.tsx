import { NegligibleLink } from "../../components/account/button";
import { ErrorInline, H1 } from "../../components/account/common";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useId, useState } from "react";
import { Label, TextField } from "../../components/account/input";
import { getAuthSharedLayout } from "../../components/auth";
import { AuthCard, AuthCardButton, AuthCardContent } from "../../components/account/authCard";
import { PageMetaData } from "../../components/metadata";
import { getConfirmResetPasswordBody, getConfirmResetPasswordUrl } from "../../lib/web/api";
import { getPasswordWarning, verifyPassword, VerifyPasswordResult } from "../../lib/util/verifyInput";
import { P } from "../../components/common";
import Link from "next/link";
import styled from "styled-components";

export default function Page() {
  const router = useRouter();
  const code = router.query.code;
  const [pageError, setPageError] = useState("");

  useEffect(() => {
    router.prefetch("/account");
  }, [router]);

  return (
    <>
      <PageMetaData title="Resetowanie hasła | Track Adblock" />
      <H1 $margin="b-30px">Ustaw nowe hasło</H1>
      <AuthCard>
        <AuthCardContent>
          {pageError === "" && <PasswordPrompt code={code} setPageError={setPageError} />}
          {pageError !== "" && <ErrorPage message={pageError} />}
        </AuthCardContent>
      </AuthCard>
      <NegligibleLink href="/" $margin="bl-20px">
        Powrót do strony głównej
      </NegligibleLink>
    </>
  );
}

function PasswordPrompt({ code, setPageError }: { code: string | string[] | undefined; setPageError: (error: string) => void }) {
  const passwordId = useId();
  const [passwordState, setPasswordState] = useState<VerifyPasswordResult>("ok");

  function changePassword() {
    const password = (document.getElementById(passwordId) as HTMLInputElement).value;
    const passwordState = verifyPassword(password);
    if (typeof code !== "string") {
      setPageError("Token zmiany hasła jest przestarzały, reset hasła musi być wykonany od początku.");
    } else if (passwordState === "ok") {
      confirmResetPassword(code, password, setPageError);
    } else {
      setPasswordState(passwordState);
    }
  }

  return (
    <>
      <Label $margin="b-15px" $light={true} htmlFor={passwordId}>
        Nowe Hasło {passwordState !== "ok" && <ErrorInline>- {getPasswordWarning(passwordState)}</ErrorInline>}
      </Label>
      <TextField $margin="b-15px" id={passwordId} name="password" type="password" />
      <AuthCardButton onClick={changePassword}>Zmień hasło</AuthCardButton>
    </>
  );
}

async function confirmResetPassword(code: string, password: string, setPageError: (error: string) => void) {
  const response = await fetch(getConfirmResetPasswordUrl(), {
    method: "POST",
    body: getConfirmResetPasswordBody(code, password),
  });

  const jsonResponse = await response.json();
  const status = jsonResponse?.status;
  const email = jsonResponse?.email;

  if (status === "INVALID_TOKEN") {
    setPageError("Token zmiany hasła jest przestarzały, reset hasła musi być wykonany od początku.");
  } else if (status !== "ok" || typeof email !== "string") {
    setPageError("Resetowanie hasła nie przebiegło pomyślnie. Prosimy o kontakt z pomocą techniczną jeśli problem się powtarza.");
  } else {
    signIn("credentials", {
      callbackUrl: "/account",
      email,
      password,
    });
  }
}

function ErrorPage({ message }: { message: string }) {
  return (
    <>
      <P $margin="b-30px">{message}</P>
      <AuthCardButton as={StyledLink} href="/auth/login">
        Rozpocznij od nowa
      </AuthCardButton>
    </>
  );
}

const StyledLink = styled(Link)``;

Page.getSharedLayout = getAuthSharedLayout;
