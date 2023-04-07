import { getAccountSharedLayout } from "../../components/account/skeleton";
import { RequestsCard } from "../../components/account/requests/requestsCard";
import { LinkPrimary } from "../../components/account/button";
import { H1 } from "../../components/account/common";
import { GetServerSideProps } from "next";
import { GetServerSidePropsContext } from "next/types";
import { getServerSession } from "../api/auth/[...nextauth]";
import { getHosts } from "../../lib/db/query";
import { LOGIN_REDIRECT } from "../../lib/web/redirects";
import React from "react";
import { MAX_HOSTS_PER_USER } from "../../lib/util/verifyInput";
import { PageMetaData } from "../../components/metadata";
import { AlertCard } from "../../components/account/card";

interface Props {
  hosts: { host: string }[];
}

export const getServerSideProps: GetServerSideProps<Props> = async (context: GetServerSidePropsContext) => {
  const session = await getServerSession(context);
  const userId = session?.user.id;

  if (!userId) {
    return LOGIN_REDIRECT;
  }

  const hosts = await getHosts(userId);

  return {
    props: {
      hosts,
    },
  };
};

export default function Page({ hosts }: Props) {
  return (
    <>
      <PageMetaData title="Panel użytkownika | Track Adblock" />
      {hosts.length === 0 && (
        <>
          <H1 $margin="t-4px b-30px">Statystyki strony</H1>
          <AlertCard>Zainstaluj naszą usługę by zobaczyć statystyki odblokowanych zdarzeń.</AlertCard>
        </>
      )}
      {hosts.length > 0 &&
        hosts
          .map((host) => host.host)
          .map((host, index) => (
            <React.Fragment key={host}>
              <H1 $margin={`t-${index === 0 ? 4 : 50}px b-30px`}>Statystyki strony: {host}</H1>
              <RequestsCard $margin="b-15px" host={host} />
            </React.Fragment>
          ))}
      {hosts.length < MAX_HOSTS_PER_USER && (
        <LinkPrimary $margin="b-15px" href={"/account/addHost"}>
          {hosts.length === 0 ? "Dodaj domenę" : "Dodaj kolejną domenę"}
        </LinkPrimary>
      )}
    </>
  );
}

Page.getSharedLayout = getAccountSharedLayout;
