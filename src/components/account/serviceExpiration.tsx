import { PaymentState } from "../../lib/payment/payment";
import { formatTimeToExpire } from "../../lib/util/format";
import { AlertCard } from "./card";

export function ServiceExpirationBar({ paymentState, serviceExpiration }: { paymentState: PaymentState; serviceExpiration: Date | null }) {
  return (
    <AlertCard $center={true}>
      {paymentState === "BEFORE_TRIAL" && "By rozpocząć okres próbny, zintegruj naszą usługę na swojej stronie internetowej."}
      {paymentState === "TRIAL" && `Obecnie trwa okres próbny. Jeśli jesteś zadowolny z usługi, dokonaj płatności w ciągu ${formatTimeToExpire(serviceExpiration)}.`}
      {paymentState === "PAID" && `Wszystko działa poprawnie. Następnej płatności trzeba dokonać w ciągu ${formatTimeToExpire(serviceExpiration)}.`}
      {paymentState === "EXPIRED" && `Dokonaj płatności by aktywować usługę.`}
    </AlertCard>
  );
}
