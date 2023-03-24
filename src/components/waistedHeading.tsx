import styled from "styled-components";
import { Margin, MarginValue } from "./margin";
import { ReactNode } from "react";

export function WaistedHeading({ className, $margin, children }: { className?: string; $margin?: MarginValue; children: ReactNode }) {
  return (
    <Right $margin={$margin}>
      <Left className={className}>{children}</Left>
    </Right>
  );
}

const Right = styled.div<{ $margin?: MarginValue }>`
  position: relative;
  --bg-color: ${({ theme }) => theme.pricingCard.waistedHeading.bg};
  background: var(--bg-color);

  ${Margin};

  ::before,
  ::after {
    content: "";
    position: absolute;
    border-style: solid;
    border-color: transparent;
    width: 0;
    height: 0;
    z-index: 2;
  }

  ::before {
    border-width: 21px 8px 0 0;
    border-top-color: var(--bg-color);
    right: -8px;
    top: 0;
  }
  ::after {
    border-style: solid;
    border-width: 21px 0 0 8px;
    border-left-color: var(--bg-color);
    right: -8px;
    top: 20px;
  }
`;

const Left = styled.h3`
  margin: 0;
  font-weight: 580;
  padding: 11px 10px;
  font-size: 19px; //TODO maybe JS code can properly adjust border-width, so we can use REM?
  line-height: 1;

  position: relative;

  ::before,
  ::after {
    content: "";
    position: absolute;
    border-style: solid;
    border-color: transparent;
  }
  ::before {
    left: -8px;
    top: 0;
    border-width: 0 8px 21px 0;
    border-right-color: var(--bg-color);
  }

  ::after {
    left: -8px;
    top: 20px;
    border-width: 0 0 21px 8px;
    border-bottom-color: var(--bg-color);
  }
`;
