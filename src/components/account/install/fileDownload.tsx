import styled from "styled-components";
import { useCallback, useId } from "react";
import { FillImg } from "../../common";

export const FileDownloadGroup = styled.div`
  display: flex;
  gap: 10px;
  margin: 15px 0 20px;
  > button {
    width: 90px;
    height: 90px;
  }
`;

export function FileDownload({ filePath, fileName, iconSrc, className }: { filePath: string; fileName: string; iconSrc: string; className?: string }) {
  const anchorId = useId();
  const onClick = useCallback(() => {
    const a = document.getElementById(anchorId) as HTMLAnchorElement;
    a.click();
  }, [anchorId]);

  return (
    <DownloadBtn onClick={onClick}>
      <Img src={iconSrc} alt="Pobierz pliki" className={className} />
      <DownloadImg src="/img/icon/download.svg" alt="" />
      <InvisibleAnchor id={anchorId} href={filePath} download={fileName} />
    </DownloadBtn>
  );
}

const DownloadBtn = styled.button`
  position: relative;

  :focus-visible {
    outline: solid medium ${({ theme }) => theme.gradient.primary.focusVisible};
    outline-offset: 5px;
  }
`;

const Img = styled(FillImg)`
  border-radius: 8px;
  filter: drop-shadow(0 0 3px #2c2c2cb0);

  ${DownloadBtn}:hover & {
    filter: grayscale(1) blur(2px);
  }
`;

const DownloadImg = styled(FillImg)`
  z-index: -1;

  ${DownloadBtn}:hover & {
    z-index: 1;
    filter: drop-shadow(0 0 3px black);
  }
`;

/* We use invisible <a> so a URL to the file is not displayed on the screen */
const InvisibleAnchor = styled.a`
  display: none;
`;
