import styled, { css } from "styled-components";
import { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";

export function SideMenu() {
  return (
    <Base>
      <ItemGroup>
        <MenuItemLink title="Statystyki" href="/account">
          <IconIndex />
        </MenuItemLink>
        <MenuItemLink title="Instalacja" href="/account/addHost" additionalPaths={["/account/install/analytics"]}>
          <IconInstallation />
        </MenuItemLink>
        <MenuItemLink title="Płatności" href="/account/payments">
          <IconPayment />
        </MenuItemLink>
        <MenuItemLink title="Profil" href="/account/profile">
          <IconProfile />
        </MenuItemLink>
      </ItemGroup>
      <MenuItemButton
        title="Wyloguj się"
        onClick={() =>
          signOut({
            callbackUrl: "/",
          })
        }
      >
        <IconLogout />
      </MenuItemButton>
    </Base>
  );
}

const Base = styled.nav`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-top: 8px;
  padding-bottom: 20px;
  background-color: ${({ theme }) => theme.background.primary};
  border-right: 1px solid ${({ theme }) => theme.border.primary};
  z-index: 1; // Placing it in foreground of the main section, when hover is active

  :hover {
    width: 240px;
  }
`;

/**
 * One group of items is placed on the top, while other is placed on the bottom
 */
const ItemGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Item = styled(Link)<{ $active: boolean }>`
  display: flex;
  height: 48px;
  width: 100%;
  color: ${(props) => props.theme.text.heading};
  position: relative;

  ${(props) =>
    props.$active &&
    css`
       {
        background-color: ${props.theme.selected.fore};
        border-top-right-radius: 25px;
        border-bottom-right-radius: 25px;

        :hover {
          background-color: ${props.theme.selected.foreHover};
        }
      }
    `}
  ${(props) =>
    !props.$active &&
    css`
      :hover {
        background-color: ${props.theme.selected.light};
        border-top-right-radius: 25px;
        border-bottom-right-radius: 25px;
      }
    `}
`;
/**
 * Blue Circle behind currently active item
 */
const ActiveItemHighlight = styled.div`
  background-color: ${({ theme }) => theme.selected.fore};
  border-radius: 50%;
  height: 36px;
  left: 9px;
  top: 9px;
  position: absolute;
  width: 36px;
  z-index: -1;
`;

const ItemIcon = styled.svg`
  height: 24px;
  width: 24px;
  min-width: 24px;
  margin: auto 15px; // 15px is (55px(side menu width) - 1px(side menu border-width) - 24px(icon width)) / 2
`;

const ItemTitle = styled.div`
  display: block;
  margin: auto 0;
  font-size: 0.875rem;
  font-weight: 600;
  overflow: hidden; //TODO handle it better way
`;

function MenuItemLink({ title, href, additionalPaths, children }: { title: string; href: string; additionalPaths?: string[]; children: ReactNode }) {
  const router = useRouter();
  const isActive = router.pathname === href || (!!additionalPaths && additionalPaths.includes(router.pathname));
  return (
    <Item href={href} $active={isActive}>
      {children}
      {isActive && <ActiveItemHighlight />}
      <ItemTitle>{title}</ItemTitle>
    </Item>
  );
}

function MenuItemButton({ title, children, ...other }: { title: string; children: ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <Item as="button" $active={false} {...other}>
      {children}
      <ItemTitle>{title}</ItemTitle>
    </Item>
  );
}

//We cannot place them in img or object elements, because their fill color is based on whether item is selected or not

function IconIndex() {
  return (
    <ItemIcon fill="currentColor" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 25.406h22.406v-1.75h-20.656v-17.063h-1.75v18.813zM3.063 21.969h19.25v-13.813l-4.063 3.719-3.781-1.375-4 4.563-4.094-1.469-3.313 3.438v4.938z"></path>
    </ItemIcon>
  );
}

function IconInstallation() {
  return (
    <ItemIcon fill="currentColor" viewBox="0 0 256 241" xmlns="http://www.w3.org/2000/svg">
      <path d="M254 188V2H2v186h111v29H75v22h106v-22h-38v-29h111zM19 19h217v151H19V19zm110.23 48.81V60.5l-7.68-1.3a22.27 22.27 0 0 0-2.9-6.98l4.52-6.34-5.18-5.18-6.35 4.51a22.28 22.28 0 0 0-6.97-2.9l-1.3-7.67h-7.33l-1.29 7.68a22.3 22.3 0 0 0-6.98 2.89l-6.34-4.51-5.18 5.18 4.51 6.34a22.27 22.27 0 0 0-2.9 6.98l-7.67 1.3v7.32l7.68 1.3a22.25 22.25 0 0 0 2.89 6.98l-4.51 6.34 5.18 5.18 6.34-4.51A22.18 22.18 0 0 0 94.75 86l1.3 7.68h7.32l1.3-7.68a22.18 22.18 0 0 0 6.97-2.9l6.35 4.52 5.18-5.18-4.51-6.34a22.25 22.25 0 0 0 2.89-6.98l7.68-1.3zM99.7 75.8a11.65 11.65 0 1 1 0-23.3 11.65 11.65 0 0 1 0 23.3zm80.53 34.03 8.95-5.56-3.76-9.17-10.27 2.32a30.1 30.1 0 0 0-7.2-7.26l2.4-10.25-9.13-3.83-5.63 8.9a30.1 30.1 0 0 0-10.22-.05l-5.55-8.95-9.17 3.76L132.97 90a30.1 30.1 0 0 0-7.25 7.2l-10.26-2.4-3.83 9.13 8.9 5.63a30.1 30.1 0 0 0-.04 10.22l-8.95 5.55 3.75 9.17 10.28-2.3a30.1 30.1 0 0 0 7.19 7.25l-2.4 10.25 9.14 3.83 5.63-8.9c3.43.6 6.88.6 10.21.04l5.56 8.95 9.17-3.75-2.31-10.28a30.1 30.1 0 0 0 7.25-7.19l10.26 2.4 3.83-9.14-8.9-5.63c.6-3.43.6-6.88.04-10.21zm-15.35 11.07a15.75 15.75 0 1 1-29.05-12.18 15.75 15.75 0 0 1 29.05 12.18zm-73.14-1.18a5.4 5.4 0 1 1-10.8 0 5.4 5.4 0 0 1 10.8 0zm14.13 2.43v-4.85l-5.08-.86a14.75 14.75 0 0 0-1.91-4.61l2.99-4.2-3.43-3.43-4.2 2.98a14.74 14.74 0 0 0-4.62-1.9l-.86-5.09h-4.85l-.85 5.08a14.76 14.76 0 0 0-4.62 1.91l-4.2-2.98-3.43 3.43 2.99 4.2a14.73 14.73 0 0 0-1.91 4.61l-5.09.86v4.85l5.09.85a14.73 14.73 0 0 0 1.9 4.62l-2.98 4.2 3.43 3.43 4.2-2.99c1.4.89 2.95 1.54 4.62 1.92l.85 5.08h4.85l.86-5.08a14.69 14.69 0 0 0 4.62-1.92l4.2 2.99 3.42-3.43-2.98-4.2a14.6 14.6 0 0 0 1.91-4.62l5.08-.85z" />;
    </ItemIcon>
  );
}

function IconPayment() {
  return (
    <ItemIcon viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect className="colored" x="3" y="6" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 10H20.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 15H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </ItemIcon>
  );
}

function IconProfile() {
  return (
    <ItemIcon width="800px" height="800px" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <path fill="currentColor" d="M39,18H35V13A11,11,0,0,0,24,2H22A11,11,0,0,0,11,13v5H7a2,2,0,0,0-2,2V44a2,2,0,0,0,2,2H39a2,2,0,0,0,2-2V20A2,2,0,0,0,39,18ZM15,13a7,7,0,0,1,7-7h2a7,7,0,0,1,7,7v5H15ZM37,42H9V22H37Z" />
      <circle fill="currentColor" cx="15" cy="32" r="3" />
      <circle fill="currentColor" cx="23" cy="32" r="3" />
      <circle fill="currentColor" cx="31" cy="32" r="3" />
    </ItemIcon>
  );
}

function IconLogout() {
  return (
    <ItemIcon fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
      <path d="M8 10.5h6.5m-2.5-3 2.5 3m-2.5 3 2.5-3m0 6.6c-.9.7-1.8 1.4-4 1.4h-3c-2.2 0-4-1.8-4-4v-8c0-2.2 1.8-4 4-4h3c2.2 0 3.2.7 4 1.9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </ItemIcon>
  );
}
