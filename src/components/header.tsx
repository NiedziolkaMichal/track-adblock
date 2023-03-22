import styled from "styled-components";
import Link from "next/link";
import { MouseEvent, MutableRefObject, RefObject, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { getSideMenuItems, MenuItemButton, MenuItemLink } from "./account/sideMenu";
import { convertRemToPixels } from "../util/dom";

export function Header() {
  const mobileNavBgRef = useRef<HTMLDivElement>(null);
  const hamburgerIconRef = useRef<HTMLObjectElement>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  useHideMobileNavOnResize(hamburgerIconRef, mobileNavBgRef, mobileNavOpen, setMobileNavOpen);

  return (
    <StyledHeader>
      <DesktopNav>
        <NavLinks mobileNav={false} />
      </DesktopNav>
      <HamburgerParent>
        <object ref={hamburgerIconRef} data="/img/icon/hamburgerMenu.svg" type="image/svg+xml" width={50} height={50} />
        <HamburgerButton onClick={() => openOrCloseMobileNav(hamburgerIconRef, mobileNavBgRef, mobileNavOpen, setMobileNavOpen)}></HamburgerButton>
      </HamburgerParent>
      <MobileNavBackground onClick={(e) => onMobileNavClick(e, hamburgerIconRef, mobileNavBgRef, mobileNavOpen, setMobileNavOpen)} ref={mobileNavBgRef}>
        <MobileNav>
          <NavLinks mobileNav={true} />
        </MobileNav>
      </MobileNavBackground>
    </StyledHeader>
  );
}

function useHideMobileNavOnResize(iconRef: RefObject<HTMLObjectElement>, mobileNavRef: RefObject<HTMLElement>, opened: boolean, setOpened: (opened: boolean) => void) {
  useEffect(() => {
    const listener = () => {
      if (opened && window.innerWidth >= convertRemToPixels(29) + 86) {
        openOrCloseMobileNav(iconRef, mobileNavRef, opened, setOpened, true);
      }
    };
    addEventListener("resize", listener);
    return () => removeEventListener("resize", listener);
  }, [iconRef, mobileNavRef, opened, setOpened]);
}

function NavLinks({ mobileNav }: { mobileNav: boolean }) {
  const router = useRouter();
  const pageHasSideMenu = router.pathname.startsWith("/account");
  const includeSideMenuItems = pageHasSideMenu && mobileNav;

  return (
    <>
      <NavLink href="/">Start</NavLink>
      <NavLink href="/#how-it-works">Jak to działa</NavLink>
      <NavLink href="/#pricing">Cennik</NavLink>
      {!includeSideMenuItems && <NavLink href="/auth/login">Panel klienta</NavLink>}
      {includeSideMenuItems && getSideMenuItems().map((i) => <MobileNavLink key={i.title} item={i} />)}
    </>
  );
}

function MobileNavLink({ item }: { item: MenuItemButton | MenuItemLink }) {
  if (item.type === "button") {
    return (
      <NavButton as="button" onClick={item.onClick}>
        {item.title}
      </NavButton>
    );
  }
  return <NavLink href={item.href}>{item.title}</NavLink>;
}

function openOrCloseMobileNav(iconRef: RefObject<HTMLObjectElement>, mobileNavRef: RefObject<HTMLElement>, opened: boolean, setOpened: (opened: boolean) => void, forceClose?: boolean) {
  if (forceClose && !opened) {
    return;
  }

  const svgElement = iconRef.current?.contentDocument?.documentElement;
  const mobileNav = (mobileNavRef as MutableRefObject<HTMLElement>)?.current;

  if (svgElement && mobileNav) {
    if (opened) {
      closeMobileNav(svgElement, mobileNav);
    } else {
      openMobileNav(svgElement, mobileNav);
    }
    setOpened(!opened);
  }
}

function closeMobileNav(svgElement: HTMLElement, mobileNav: HTMLElement) {
  svgElement.classList.remove("opened");
  mobileNav.dataset.opened = "false";
  document.documentElement.style.overflow = "visible";
}

function openMobileNav(svgElement: HTMLElement, mobileNav: HTMLElement) {
  svgElement.classList.add("opened");
  mobileNav.dataset.opened = "true"; // We don't want to add class in here, because Styled Components can override it
  document.documentElement.style.overflow = "hidden";
  window.scroll({
    top: 0,
  });
}

function onMobileNavClick(e: MouseEvent<HTMLElement>, iconRef: RefObject<HTMLObjectElement>, mobileNavRef: RefObject<HTMLElement>, opened: boolean, setOpened: (opened: boolean) => void) {
  if (e.target instanceof HTMLAnchorElement) {
    openOrCloseMobileNav(iconRef, mobileNavRef, opened, setOpened, true);
  }
}

const HamburgerParent = styled.div`
  position: relative;
  z-index: 1000;

  @media (min-width: calc(29rem + 86px)) {
    display: none;
  }
`;
const HamburgerButton = styled.button`
  position: absolute;
  inset: 0;
  width: 100%; // Setting width & height is required to make it work on firefox
  height: 100%;
`;

const StyledHeader = styled.header`
  display: flex;
  justify-content: end;
  align-items: center;
  height: 6.5rem;
  width: 100%;
  max-width: 1300px;
  padding-inline: 30px;
  margin: auto;
`;

const DesktopNav = styled.nav`
  display: flex;
  gap: 2.5rem;
  background-image: linear-gradient(to right, ${({ theme }) => theme.gradient.primary.color_1}, ${({ theme }) => theme.gradient.primary.color_2});
  -webkit-background-clip: text;

  @media (max-width: calc(29rem + 85px)) {
    display: none;
  }
`;

const MobileNavBackground = styled.div`
  position: fixed;
  z-index: 999;
  inset: 0;
  padding-left: 25px;
  background: var(--body-bg);
  transform: translateY(100vh);
  transition: transform ease-out 0.3s;
  &[data-opened="true"] {
    transform: translateY(0vh);
  }

  > :first-child {
    margin-top: 6.5rem;
  }

  @media (min-width: calc(29rem + 86px)) {
    display: none;
  }
`;

const MobileNav = styled.nav`
  display: flex;
  flex-direction: column;
  background-image: linear-gradient(to bottom, ${({ theme }) => theme.gradient.primary.color_1}, ${({ theme }) => theme.gradient.primary.color_2});
  -webkit-background-clip: text;

  > :not(:last-child)::after {
    content: "";
    display: block;
    width: 100%;
    height: 0;
    transform: translateY(20px);
    border-bottom: 1px solid ${({ theme }) => theme.mobileMenuHr};
  }
`;

const NavLink = styled(Link)`
  padding: 20px 0;

  color: transparent;
  font-size: 1.1rem;
  font-weight: 600;

  :focus-visible {
    outline-color: ${({ theme }) => theme.gradient.primary.focusVisible};
    outline-offset: 5px;
  }
  :hover {
    text-shadow: 0 0 0 rgb(0, 0, 0, 0.3);
  }
`;

const NavButton = styled(NavLink)`
  display: flex;
`;
