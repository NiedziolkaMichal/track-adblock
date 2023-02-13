import { getAccountSharedLayout } from "../../components/account/shared";
import styled from "styled-components";
import { RequestsCard } from "../../components/account/requests/requestsCard";

const Main = styled.main`
  padding: 2rem 40px 0;
  // RequestsChart required fixed width in order to be resized correctly with the viewport
  width: calc(100vw - 55px); // 55px is width of a side menu defined in shared.tsx
  max-width: 1280px;
  margin: 0 auto;
`;

const H1 = styled.h1`
  font-size: 1.25rem;
  font-weight: 500;
  color: ${({ theme }) => theme.text.heading};
  margin-bottom: 30px;
`;

export default function Page() {
  return (
    <Main>
      <H1>Statystyki strony: krainawiewiorek.pl</H1>
      <RequestsCard />
    </Main>
  );
}

Page.getSharedLayout = getAccountSharedLayout;
