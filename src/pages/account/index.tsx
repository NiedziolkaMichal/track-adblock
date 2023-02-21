import { getAccountSharedLayout } from "../../components/account/skeleton";
import { RequestsCard } from "../../components/account/requests/requestsCard";
import { LinkPrimary } from "../../components/account/button";
import { H1 } from "../../components/account/common";

export default function Page() {
  return (
    <>
      <H1 $margin="b-30px">Statystyki strony: krainawiewiorek.pl</H1>
      <RequestsCard $margin="b-15px" />
      <LinkPrimary href={"/account/integrate/analytics"}>Dodaj kolejną domenę</LinkPrimary>
    </>
  );
}

Page.getSharedLayout = getAccountSharedLayout;
