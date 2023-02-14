import { getAccountSharedLayout } from "../../components/account/skeleton";
import styled from "styled-components";
import { RequestsCard } from "../../components/account/requests/requestsCard";

const H1 = styled.h1`
  font-size: 1.25rem;
  font-weight: 500;
  color: ${({ theme }) => theme.text.heading};
  margin-bottom: 30px;
`;

export default function Page() {
  return (
    <>
      <H1>Statystyki strony: krainawiewiorek.pl</H1>
      <RequestsCard />
    </>
  );
}

Page.getSharedLayout = getAccountSharedLayout;
