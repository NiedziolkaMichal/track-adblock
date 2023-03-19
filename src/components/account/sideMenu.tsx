import styled, { css } from "styled-components";
import { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";

export function SideMenu() {
  return (
    <Base>
      <ItemGroup>
        <MenuItemLink title="Strona główna" href="/account">
          <IconIndex />
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

function MenuItemLink({ title, href, children }: { title: string; href: string; children: ReactNode }) {
  const router = useRouter();
  const isActive = router.pathname === href;
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
