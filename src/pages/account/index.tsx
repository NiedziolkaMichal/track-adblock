import { getAccountSharedLayout } from "../../components/account/skeleton";
import styled from "styled-components";
import { RequestsCard } from "../../components/account/requests/requestsCard";
import { LinkPrimary } from "../../components/account/button";
import { H1 } from "../../components/account/common";

const ResizedRequestsCard = styled(RequestsCard)`
  margin: 15px 0;
`;

export default function Page() {
  return (
    <>
      <H1>Statystyki strony: krainawiewiorek.pl</H1>
      <ResizedRequestsCard />
      <LinkPrimary href={"/account/integrate/analytics"}>Dodaj kolejną domenę</LinkPrimary>
    </>
  );
}

Page.getSharedLayout = getAccountSharedLayout;
