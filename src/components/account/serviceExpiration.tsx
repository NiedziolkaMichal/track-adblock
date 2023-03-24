import styled from "styled-components";
import { PaymentState } from "../../payment/payment";
import { formatTimeToExpire } from "../../util/format";

export function ServiceExpirationBar({ paymentState, serviceExpiration }: { paymentState: PaymentState; serviceExpiration: Date | null }) {
  return (
    <Base>
      {paymentState === "BEFORE_TRIAL" && "By rozpocząć okres próbny, zintegruj naszą usługę na swojej stronie internetowej."}
      {paymentState === "TRIAL" && `Obecnie trwa okres próbny. Jeśli jesteś zadowolny z usługi, dokonaj płatności w ciągu ${formatTimeToExpire(serviceExpiration)}.`}
      {paymentState === "PAID" && `Wszystko działa poprawnie. Następnej płatności trzeba dokonać w ciągu ${formatTimeToExpire(serviceExpiration)}.`}
      {paymentState === "EXPIRED" && `Dokonaj płatności by aktywować usługę.`}
    </Base>
  );
}

const Base = styled.div<{ $state?: PaymentState }>`
  background: ${({ theme }) => theme.card.glass};
  border: 1px solid ${({ theme }) => theme.border.primary};
  border-radius: 8px;
  color: ${({ theme }) => theme.text.heading};
  font-weight: 520;
  text-align: center;
  padding: 20px;
  margin-bottom: 45px;
`;
