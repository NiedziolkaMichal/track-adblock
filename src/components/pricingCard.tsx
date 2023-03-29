import styled from "styled-components";
import { Margin, MarginValue } from "./margin";
import { WaistedHeading } from "./waistedHeading";
import { ShortSpace, TransparentBorderGradient } from "./common";
import { BaseLink, GradientLink } from "./button";
import { ProductPrice } from "../payment/prices";
import { MouseEventHandler, ReactNode } from "react";

export function PricingCardTrial({ productPrice }: { productPrice: ProductPrice }) {
  const Link = productPrice.topOffer ? SpecialCardLink : GradientLink;
  return (
    <PricingCard productPrice={productPrice}>
      <OrdinaryText>3-dniowy okres próbny</OrdinaryText>
      <Link $margin="t-1.5rem in-auto b-50px" href="/auth/register">
        Wypróbuj za darmo
      </Link>
    </PricingCard>
  );
}

export function PricingCardPurchase({ productPrice, onClick, children }: { productPrice: ProductPrice; onClick: MouseEventHandler; children?: ReactNode }) {
  const Link = productPrice.topOffer ? SpecialCardLink : GradientLink;
  return (
    <PricingCard productPrice={productPrice}>
      {children}
      <Link as="button" $margin="t-1.5rem in-auto b-50px" onClick={onClick}>
        Wykup pakiet
      </Link>
    </PricingCard>
  );
}

export function PricingCard({ productPrice, children }: { productPrice: ProductPrice; children: ReactNode }) {
  const Card = productPrice.topOffer ? CardSpecial : CardOrdinary;
  return (
    <Card>
      {!productPrice.topOffer && <TransparentBorderGradient />}
      <WaistedHeading $margin="t-50px in-auto">{productPrice.periodInMonths === 1 ? "1 miesiąc" : `${productPrice.periodInMonths} miesięcy`}</WaistedHeading>
      <FullPriceText $margin="t-20px in-30px">
        <LightText $special={productPrice.topOffer}>{productPrice.currency}</LightText> <Price>{productPrice.fullPrice / productPrice.periodInMonths}.00</Price>
        <LightText $special={productPrice.topOffer}>
          /<ShortSpace />
          miesiąc
        </LightText>
      </FullPriceText>
      <LightText $special={productPrice.topOffer}>{productPrice.savings === 0 ? "Brak oszczędności" : `Oszczędzasz ${productPrice.savings} złotych`}</LightText>
      {children}
    </Card>
  );
}

const AbstractCard = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  height: fit-content;
  transition: transform 0.2s ease-in-out;

  --border-radius: 7px;
  border-radius: var(--border-radius);

  :hover {
    transform: scale(1.03);
  }

  @media (max-width: calc(17.25rem + 136px)) {
    width: 100%;
  }
`;

export const CardOrdinary = styled(AbstractCard)`
  background-color: ${({ theme }) => theme.pricingCard.ordinary.background};
  color: ${({ theme }) => theme.pricingCard.ordinary.text};

  position: relative;
`;

const CardSpecial = styled(AbstractCard)`
  background-image: ${({ theme }) => theme.gradient.primary.image};
  color: ${({ theme }) => theme.pricingCard.special.text};

  padding-block: 1rem;
`;

const FullPriceText = styled.div<{ $margin: MarginValue }>`
  display: grid;
  grid-template-columns: 1fr max-content 1fr;
  justify-content: center;
  align-items: center;
  gap: 5px;
  ${Margin};

  @media (max-width: calc(17.25rem + 136px)) {
    grid-template-columns: initial;
    margin-bottom: 20px;
    margin-inline: 0;
  }
`;

const Price = styled.strong`
  font-size: 4rem;
`;

const LightText = styled.span<{ $special: boolean }>`
  font-weight: 580;
  color: ${({ theme, $special }) => ($special ? theme.pricingCard.special.lightText : theme.pricingCard.ordinary.lightText)};
`;

const OrdinaryText = styled.div`
  margin-top: 27px;
  font-weight: 580;
  font-size: 1.17em;
`;

const SpecialCardLink = styled(BaseLink)`
  color: ${({ theme }) => theme.pricingCard.special.link.text};
  background-color: ${({ theme }) => theme.pricingCard.special.link.bg};

  :hover {
    background-color: ${({ theme }) => theme.pricingCard.special.link.bgHover};
  }
  :focus-visible {
    outline: solid medium ${({ theme }) => theme.pricingCard.special.link.focusVisible};
    outline-offset: 5px;
  }
`;
