import { getAccountSharedLayout } from "../../components/account/skeleton";
import { RequestsCard } from "../../components/account/requests/requestsCard";
import { LinkPrimary } from "../../components/account/button";
import { H1 } from "../../components/account/common";
import { GetServerSideProps } from "next";
import { GetServerSidePropsContext } from "next/types";
import { getServerSession } from "../api/auth/[...nextauth]";
import { getHosts } from "../../../db/query";
import { ADD_HOST_REDIRECT, LOGIN_REDIRECT } from "../../util/redirects";

interface Props {
  hosts: { host: string }[];
}

export const getServerSideProps: GetServerSideProps<Props> = async (context: GetServerSidePropsContext) => {
  const session = await getServerSession(context);

  if (!session) {
    return LOGIN_REDIRECT;
  }

  const hosts = session.user?.email ? await getHosts(session.user.email) : [];
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
  const host = hosts[0].host;
  return (
    <>
      <H1 $margin="b-30px">Statystyki strony: {host}</H1>
      <RequestsCard $margin="b-15px" host={host} />
      <LinkPrimary href={"/account/addHost"}>Dodaj kolejną domenę</LinkPrimary>
    </>
  );
}

Page.getSharedLayout = getAccountSharedLayout;
