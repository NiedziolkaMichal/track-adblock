import { ReactElement } from "react";
import styled from "styled-components";
import Image from "next/image";

//TODO use image optimization with AVIF or use <picture>
const Background = styled(Image)`
  position: absolute;
  z-index: -1;
  width: 100vw;
  height: 100vh;
  object-fit: cover;
`;

const Main = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 100px auto 0;
`;

export function getAuthSharedLayout(page: ReactElement): ReactElement {
  return (
    <>
      <Background src="/img/bg/login.webp" width={2109} height={2422} sizes="100vw" alt="" quality={100} loading="eager" priority={true} />
      <Main>{page}</Main>
    </>
  );
}
