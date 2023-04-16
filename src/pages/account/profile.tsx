import { getAccountSharedLayout } from "../../components/account/skeleton";
import { PageMetaData } from "../../components/metadata";
import { ErrorInline, H1 } from "../../components/account/common";
import { CardH2 } from "../../components/account/card";
import { InvalidInput, Label, TextField } from "../../components/account/input";
import { ButtonPrimary, ButtonShapeShifter } from "../../components/account/button";
import { useId, useState } from "react";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { GetServerSidePropsContext } from "next/types";
import { getServerSession } from "../api/auth/[...nextauth]";
import { LOGIN_REDIRECT } from "../../lib/web/redirects";
import { usingOAuth } from "../../lib/db/query";
import { getChangePasswordBody, getChangePasswordUrl, getDeleteAccountUrl } from "../../lib/web/api";
import { signOut } from "next-auth/react";
import { getPasswordWarning, verifyPassword, VerifyPasswordResult } from "../../lib/util/verifyInput";

interface Props {
  oauth: boolean;
}

export const getServerSideProps: GetServerSideProps<Props> = async (context: GetServerSidePropsContext) => {
  const session = await getServerSession(context);
  const userId = session?.user.id;

  if (!userId) {
    return LOGIN_REDIRECT;
  }

  const oauth = await usingOAuth(userId);

  return {
    props: {
      oauth,
    },
  };
};

export default function Page({ oauth }: Props) {
  return (
    <>
      <PageMetaData title="Profil | Track Adblock" />
      <H1>Profil użytkownika</H1>
      {!oauth && <ChangePasswordCard />}
      <DeleteAccount oauth={oauth} />
    </>
  );
}

Page.getSharedLayout = getAccountSharedLayout;

function ChangePasswordCard() {
  const currentPasswordId = useId();
  const [currentPasswordState, setCurrentPasswordState] = useState<"ok" | "missing">("ok");
  const newPasswordId = useId();
  const [newPasswordState, setNewPasswordState] = useState<VerifyPasswordResult>("ok");
  const [completed, setCompleted] = useState(false);
  const [usesOAuth, setUsesOAuth] = useState(false);
  const router = useRouter();

  async function tryChangePassword() {
    const { currentPassword, newPassword } = getInputValues();
    if (!verifyInputs(currentPassword, newPassword) || usesOAuth) {
      return;
    }
    const response = await fetch(getChangePasswordUrl(), {
      method: "POST",
      body: getChangePasswordBody(currentPassword, newPassword),
    });
    console.log("response", response, response.status);
    if (response.status === 200) {
      // Success
      setCompleted(true);
      setTimeout(() => {
        router.push("/account");
      }, 2000);
    } else if (response.status === 409) {
      // OAuth
      setUsesOAuth(true);
    } else {
      // Password incorrect or something went wrong
      signOut();
    }
  }

  function verifyInputs(currentPassword: string, newPassword: string) {
    let inputsCorrect = true;
    // Checking if current password input is not empty
    if (!currentPassword) {
      setCurrentPasswordState("missing");
      inputsCorrect = false;
    } else if (currentPasswordState !== "ok") {
      setCurrentPasswordState("ok");
    }

    //Checking if new password input meets all requirements
    const passwordState = verifyPassword(newPassword);
    if (passwordState !== "ok") {
      setNewPasswordState(passwordState);
      inputsCorrect = false;
    } else if (newPasswordState !== "ok") {
      setNewPasswordState("ok");
    }
    return inputsCorrect;
  }

  function getInputValues() {
    return {
      currentPassword: (document.getElementById(currentPasswordId) as HTMLInputElement).value,
      newPassword: (document.getElementById(newPasswordId) as HTMLInputElement).value,
    };
  }

  return (
    <CardH2 $margin="b-25px" headingContent="Zmiana hasła" innerPadding={true}>
      <Label $margin="b-10px" htmlFor={currentPasswordId}>
        Aktualne hasło {currentPasswordState !== "ok" && <ErrorInline>- Nie może być puste</ErrorInline>}
      </Label>
      <TextField $margin="b-20px" id={currentPasswordId} name="password_old" type="password" />
      <Label $margin="b-10px" htmlFor={newPasswordId}>
        Nowe hasło {newPasswordState !== "ok" && <ErrorInline>- {getPasswordWarning(newPasswordState)}</ErrorInline>}
      </Label>
      <TextField $margin={usesOAuth ? "b-10px" : "b-20px"} id={newPasswordId} name="password_new" type="password" />
      {usesOAuth && <InvalidInput $margin="b-10px">Twoje konto używa logowania OAuth, nie można zmienić hasła</InvalidInput>}
      <ButtonShapeShifter onClick={tryChangePassword} $state={completed ? "valid" : "primary"} disabled={completed}>
        {!completed && "Zmień hasło"}
        {completed && "Hasło zostało zmienione"}
      </ButtonShapeShifter>
    </CardH2>
  );
}

function DeleteAccount({ oauth }: { oauth: boolean }) {
  const passwordId = useId();
  const [passwordState, setPasswordState] = useState<"ok" | "missing">("ok");
  const [paid, setPaid] = useState(false);

  async function tryDeleteAccount() {
    const password = oauth ? "" : (document.getElementById(passwordId) as HTMLInputElement).value;
    if (!oauth && !password) {
      setPasswordState("missing");
      return;
    }
    setPasswordState("ok");

    const response = await fetch(getDeleteAccountUrl(), {
      method: "DELETE",
      body: password,
    });
    if (response.status === 403) {
      setPaid(true);
    } else {
      signOut({
        callbackUrl: response.status === 200 ? "/" : "/auth/login",
      });
    }
  }

  return (
    <CardH2 $margin="b-25px" headingContent="Usunięcie konta" innerPadding={true}>
      <p style={{ marginBottom: "20px" }}>
        Konto zostanie usunięte natychmiastowo. <strong>Tej akcji nie można cofnąć!</strong>
      </p>
      {!oauth && (
        <Label $margin="b-10px" htmlFor={passwordId}>
          Aktualne hasło {passwordState !== "ok" && <ErrorInline>- Nie może być puste</ErrorInline>}
        </Label>
      )}
      {!oauth && <TextField $margin={paid ? "b-10px" : "b-20px"} id={passwordId} name="password_old" type="password" />}
      {paid && <InvalidInput $margin="b-10px">Nie można usunąć konta które ma opłaconą usługę</InvalidInput>}
      <ButtonPrimary onClick={tryDeleteAccount}>Usuń konto</ButtonPrimary>
    </CardH2>
  );
}
