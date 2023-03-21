import { getAccountSharedLayout } from "../../components/account/skeleton";
import { RequestsCard } from "../../components/account/requests/requestsCard";
import { LinkPrimary } from "../../components/account/button";
import { H1 } from "../../components/account/common";
import { GetServerSideProps } from "next";
import { GetServerSidePropsContext } from "next/types";
import { getServerSession } from "../api/auth/[...nextauth]";
import { getHosts } from "../../../db/query";
import { ADD_HOST_REDIRECT, LOGIN_REDIRECT } from "../../util/redirects";
import React from "react";
import { MAX_HOSTS_PER_USER } from "../../util/verifyInput";

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
  if (hosts.length === 0) {
    return ADD_HOST_REDIRECT;
  }

  return {
    props: {
      session,
      hosts,
    },
  };
};

export default function Page({ hosts }: Props) {
  return (
    <>
      {hosts
        .map((host) => host.host)
        .map((host, index) => (
          <React.Fragment key={host}>
            <H1 $margin={`t-${index === 0 ? 4 : 50}px b-30px`}>Statystyki strony: {host}</H1>
            <RequestsCard $margin="b-15px" host={host} />
          </React.Fragment>
        ))}
      {hosts.length < MAX_HOSTS_PER_USER && (
        <LinkPrimary $margin="b-15px" href={"/account/addHost"}>
          Dodaj kolejną domenę
        </LinkPrimary>
      )}
    </>
  );
}

Page.getSharedLayout = getAccountSharedLayout;
