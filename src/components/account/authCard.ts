import styled from "styled-components";
import { Card } from "./card";
import { ButtonPrimary } from "./button";
import { HrWithContent } from "../hrWithContent";

export const AuthCard = styled(Card)`
  background: ${({ theme }) => theme.background.glass};
  padding: 30px 45px;
  width: 390px;

  > :last-child {
    margin-bottom: unset;
  }
`;

export const AuthCardButton = styled(ButtonPrimary)`
  width: 100%;
  margin-bottom: 15px;
  height: 50px;
`;

export const CardBaseMargin = styled.div`
  margin-bottom: 15px;
`;

export const AuthCardHrWithContent = styled(HrWithContent)`
  margin: 20px 0;
  color: ${({ theme }) => theme.text.primary};
`;
