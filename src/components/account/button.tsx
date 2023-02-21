import Link from "next/link";
import styled, { css } from "styled-components";
import { ReactNode } from "react";

const stylePrimary = css`
  display: flex;
  width: fit-content;
  padding: 10px 18px;
  background-color: ${({ theme }) => theme.button.primary.background};
  color: ${({ theme }) => theme.button.primary.text};
  border-radius: 4px;
  font-weight: 480;
  font-size: 0.9rem;
  place-content: center;
  place-items: center;

  :hover {
    background-color: ${({ theme }) => theme.button.primary.backgroundHover};
  }
`;

export const LinkPrimary = styled(Link)`
  ${stylePrimary}
`;

export const ButtonPrimary = styled.button`
  ${stylePrimary}
`;

const styleSecondary = css`
  display: block;
  width: fit-content;
  padding: 10px 18px;
  color: ${({ theme }) => theme.button.secondary.text};
  font-weight: 480;
  font-size: 0.9rem;

  :hover {
    background-color: ${({ theme }) => theme.button.secondary.backgroundHover};
    color: ${({ theme }) => theme.button.secondary.textHover};
  }
`;

export const LinkSecondary = styled(Link)`
  ${styleSecondary}
`;

export const ButtonSecondary = styled.button`
  ${styleSecondary}
`;

export const StyledLink = styled(Link)`
  color: ${({ theme }) => theme.button.secondary.text};
  font-weight: 480;
  font-size: 0.9rem;

  :hover {
    color: ${({ theme }) => theme.button.secondary.textHover};
  }
`;

export const NegligibleLink = styled(Link)<{ $centered?: boolean }>`
  color: ${({ theme }) => theme.button.negligible.text};
  font-weight: 480;
  font-size: 0.9rem;

  ${({ $centered }) =>
    $centered &&
    css`
      display: block;
      margin: auto;
    `}

  :hover {
    color: ${({ theme }) => theme.button.negligible.textHover};
  }
`;

const styleValid = css<{ disabled?: boolean }>`
  display: block;
  width: fit-content;
  padding: 10px 18px;
  background-color: ${({ theme }) => theme.button.valid.background};
  color: ${({ theme }) => theme.button.valid.text};
  border-radius: 4px;
  font-weight: 480;
  font-size: 0.9rem;

  ${({ disabled }) =>
    disabled &&
    css`
      cursor: default;
    `}

  :hover {
    background-color: ${({ theme }) => theme.button.valid.backgroundHover};
  }
`;

export const LinkValid = styled(Link)`
  ${styleValid}
`;

export const ButtonValid = styled.button`
  ${styleValid}
`;

export const ButtonShapeShifter = styled.button<{ $state: "primary" | "valid" }>`
  ${({ $state }) => $state === "primary" && stylePrimary};
  ${({ $state }) => $state === "valid" && styleValid};

  transition: all cubic-bezier(0, 1, 0.5, 1) 0.5s;
`;

export const ButtonWithIcon = styled.button`
  display: flex;
  align-items: center;
  justify-content: start;
  padding: 10px 18px;
  border-radius: 4px;
  font-weight: 480;
  font-size: 0.9rem;
`;
const ButtonIcon = styled.img`
  margin-right: 20px;
`;

const ButtonGitHub = styled(ButtonWithIcon)`
  background-color: ${({ theme }) => theme.button.gitHub.background};
  color: ${({ theme }) => theme.button.gitHub.text};
  :hover {
    background-color: ${({ theme }) => theme.button.gitHub.backgroundHover};
  }
  :focus-visible {
    outline-color: ${({ theme }) => theme.button.gitHub.focusVisibleOutline};
  }
`;
export function GitHubButton({ className, children, ...rest }: { className?: string; children: ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <ButtonGitHub className={className} {...rest}>
      <ButtonIcon src="/img/icon/github-dark.svg" width={24} height={24} />
      {children}
    </ButtonGitHub>
  );
}

const ButtonGoogle = styled(ButtonWithIcon)`
  background-color: ${({ theme }) => theme.button.google.background};
  color: ${({ theme }) => theme.button.google.text};
  border: 1px solid ${({ theme }) => theme.border.primary};
  :hover {
    background-color: ${({ theme }) => theme.button.google.backgroundHover};
  }
`;
export function GoogleButton({ className, children, ...rest }: { className?: string; children: ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <ButtonGoogle className={className} {...rest}>
      <ButtonIcon src="/img/icon/google.svg" width={24} height={24} />
      {children}
    </ButtonGoogle>
  );
}

const ButtonTrackAdBlock = styled(ButtonWithIcon)`
  background-color: ${({ theme }) => theme.button.trackAdBlock.background};
  color: ${({ theme }) => theme.button.trackAdBlock.text};
  :hover {
    background-color: ${({ theme }) => theme.button.trackAdBlock.backgroundHover};
  }
`;
export function TrackAdBlockButton({ className, children, ...rest }: { className?: string; children: ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <ButtonTrackAdBlock className={className} {...rest}>
      <ButtonIcon src="/favicon.svg" width={24} height={24} />
      {children}
    </ButtonTrackAdBlock>
  );
}
