import styled from "styled-components";
import { Margin, MarginValue } from "./margin";
import { Section, SectionContent } from "./section";
import { GradientBorderLink, GradientLink } from "./button";
import { ReactNode } from "react";
import { ButtonList } from "./common";

export function HeroSection({ heading, paragraph, buttons, children }: { heading: string; paragraph: string; buttons?: boolean; children: ReactNode }) {
  return (
    <Section $margin="t-80px in-auto b-120px">
      <SectionContent $wrapReverse={true}>
        <HeroContent>
          <HeroHeading content={heading} />
          <HeroParagraph $margin="b-30px">{paragraph}</HeroParagraph>
          {buttons && (
            <HeroButtonList>
              <GradientLink href="#how-it-works">Jak to działa?</GradientLink>
              <GradientBorderLink href="/auth/register">Wypróbuj za darmo</GradientBorderLink>
            </HeroButtonList>
          )}
        </HeroContent>
        {children}
      </SectionContent>
    </Section>
  );
}

const StyledHeading = styled.div`
  margin-block: 40px;
`;

function HeroHeading({ content }: { content: string }) {
  const headingComponents = content.split(" ").flatMap((w, i) => [i > 0 ? <br key={i * 2} /> : undefined, <HeroHeadingWord key={i * 2 + 1}>{w}</HeroHeadingWord>]);
  return <StyledHeading>{headingComponents}</StyledHeading>;
}

const HeroContent = styled.div`
  @media (max-width: 1306px) {
    text-align: center;

    > * {
      margin-inline: auto;
    }
  }
`;

const HeroHeadingWord = styled.b`
  -webkit-background-clip: text;
  color: transparent;
  font-size: min(10vw, 2.9rem);
  font-weight: 700;

  :nth-of-type(1) {
    background-image: linear-gradient(to right, ${({ theme }) => theme.hero.wordColors[0]}, ${({ theme }) => theme.hero.wordColors[1]});
  }
  :nth-of-type(2) {
    background-image: linear-gradient(to right, ${({ theme }) => theme.hero.wordColors[2]}, ${({ theme }) => theme.hero.wordColors[3]});
  }
  :nth-of-type(3) {
    background-image: linear-gradient(to right, ${({ theme }) => theme.hero.wordColors[4]}, ${({ theme }) => theme.hero.wordColors[5]});
  }
`;

const HeroParagraph = styled.p<{ $margin?: MarginValue }>`
  font-size: 1.5rem;
  line-height: 1.5;
  font-weight: 510;
  max-width: 550px;
  color: ${({ theme }) => theme.text.heading};
  ${Margin}
`;

export const HeroImage = styled.img`
  max-width: 100%;
  height: auto;
`;

const HeroButtonList = styled(ButtonList)`
  @media (max-width: 1306px) {
    flex-wrap: wrap;
    justify-content: center;
  }
`;
