import styled from "styled-components";
import { useCallback, useId } from "react";

export function FileDownload({ filePath, fileName, iconSrc, className }: { filePath: string; fileName: string; iconSrc: string; className?: string }) {
  const anchorId = useId();
  const onClick = useCallback(() => {
    const a = document.getElementById(anchorId) as HTMLAnchorElement;
    a.click();
  }, [anchorId]);

  return (
    <DownloadBtn onClick={onClick}>
      <Img src={iconSrc} alt="Pobierz pliki" className={className} />
      <DownloadImg src="/img/icon/download.svg" />
      <InvisibleAnchor id={anchorId} href={filePath} download={fileName} />
    </DownloadBtn>
  );
}

const DownloadBtn = styled.button`
  position: relative;
`;

const Img = styled.img`
  display: block;
  border-radius: 8px;

  ${DownloadBtn}:hover & {
    filter: grayscale(1) blur(2px);
  }
`;

const DownloadImg = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;

  ${DownloadBtn}:hover & {
    z-index: 1;
  }
`;

/* We use invisible <a> so link to the file is not displayed on the screen */
const InvisibleAnchor = styled.a`
  display: none;
`;
