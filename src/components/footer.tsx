import styled from "styled-components";
import { SectionContent } from "./section";

export function Footer() {
  return (
    <StyledFooter>
      <FooterContent>
        <div>Copyright © Track Analytics. Wszelkie prawa zastrzeżone.</div>
        <nav>Warunki Usługi | Polityka Prywatności</nav>
      </FooterContent>
    </StyledFooter>
  );
}

const StyledFooter = styled.footer`
  background-color: ${({ theme }) => theme.footer.background};
  color: white;
`;

const FooterContent = styled(SectionContent)`
  padding: 25px 20px 20px;
  justify-content: space-between;

  font-size: 0.8rem;
  color: ${({ theme }) => theme.footer.text};

  > :last-child {
    text-align: right;
  }

  @media (max-width: 450px) {
    padding-inline: 10px;
  }
`;
