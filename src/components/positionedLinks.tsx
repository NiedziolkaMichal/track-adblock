import styled, { css } from "styled-components";

export const PositionedLinkGrid = styled.div`
  width: 100%;
  max-width: 500px;
  height: 500px;
  position: relative;
  overflow: clip;
  overflow-clip-margin: 20px;
`;

const PositionedLink = styled.a<{ $x: number; $y: number }>`
  position: absolute;
  ${({ $x }) =>
    $x >= 0
      ? css`
          left: ${$x + "%"};
        `
      : css`
          right: ${-$x + "%"};
        `}
  top: ${({ $y }) => $y + "%"};

  > img {
    filter: drop-shadow(2px 2px 3px #00000090);
    transition: transform 0.5s ease-in-out;

    :hover {
      transform: scale(1.2);
    }
  }
  :focus-visible {
    outline: solid medium ${({ theme }) => theme.positionedLink.focusVisible};
    outline-offset: 5px;
  }
`;

export function PositionedImageLink({ href, src, alt, width, height, y, x }: { href: string; src: string; alt: string; width: number; height: number; y: number; x: number }) {
  return (
    <PositionedLink href={href} rel="noreferrer" target="_blank" $x={x} $y={y}>
      <img src={src} width={width} height={height} alt={alt} />
    </PositionedLink>
  );
}
