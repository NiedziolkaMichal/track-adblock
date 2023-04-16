import { getAccountSharedLayout } from "../../components/account/skeleton";
import { GetServerSidePropsContext } from "next/types";
import { ACCOUNT_REDIRECT, LOGIN_REDIRECT } from "../../lib/web/redirects";
import { getServerSession } from "../api/auth/[...nextauth]";
import { getPaymentFields, PaymentFields } from "../../lib/payment/payu";
import { PRICES } from "../../lib/payment/prices";
import { GetServerSideProps } from "next";
import { useRef } from "react";
import { PricingCardPurchase } from "../../components/pricingCard";
import styled from "styled-components";
import { H1 } from "../../components/account/common";
import { getExpirationDetails } from "../../lib/db/query";
import { ServiceExpirationBar } from "../../components/account/serviceExpiration";
import { getPaymentState, PaymentState } from "../../lib/payment/payment";
import { PageMetaData } from "../../components/metadata";
import { logError } from "../../lib/util/log";

interface Props {
  products: PropsProduct[];
  paymentState: PaymentState;
  serviceExpiration: string | null;
}

interface PropsProduct {
  productId: number;
  paymentFields: PaymentFields;
}

export const getServerSideProps: GetServerSideProps<Props> = async (context: GetServerSidePropsContext) => {
  const session = await getServerSession(context);
  const userId = session?.user.id;
  const email = session?.user.email;
  if (!userId || typeof email !== "string") {
    return LOGIN_REDIRECT;
  }

  const expiration = await getExpirationDetails(userId);
  if (!expiration) {
    logError("User is missing service expiration data");
    return ACCOUNT_REDIRECT;
  }
  const paymentState = getPaymentState(expiration.trial, expiration.serviceExpiration);

  try {
    const products = PRICES.map((p) => ({ productId: p.productId, paymentFields: getPaymentFields(email, p, context) }));
    return {
      props: {
        products,
        paymentState,
        serviceExpiration: expiration.serviceExpiration?.toISOString() || null,
      },
    };
  } catch (e) {
    logError(e as Error);
    return ACCOUNT_REDIRECT;
  }
};

export default function Page({ products, paymentState, serviceExpiration }: Props) {
  return (
    <>
      <PageMetaData title="Płatności | Track Adblock" />
      <H1 $center={true} $margin="b-40px">
        Wykup usługę
      </H1>
      <ServiceExpirationBar paymentState={paymentState} serviceExpiration={serviceExpiration ? new Date(serviceExpiration) : null} />
      <CardsContainer>
        {products.map(({ productId, paymentFields }) => (
          <CardPurchase key={productId} productId={productId} paymentFields={paymentFields} />
        ))}
      </CardsContainer>
    </>
  );
}

const CardsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;

  @media (max-width: calc(62.5rem + 420px)) {
    flex-flow: column wrap;
  }
`;

function CardPurchase({ productId, paymentFields }: PropsProduct) {
  const formRef = useRef<HTMLFormElement>(null);
  const productPrice = PRICES.find((p) => p.productId === productId);
  if (!productPrice) {
    return <></>;
  }

  function submit() {
    formRef.current?.submit();
  }

  return (
    <>
      <PricingCardPurchase productPrice={productPrice} onClick={submit}>
        <form ref={formRef} key={productId} method="POST" action="https://secure.payu.com/api/v2_1/orders">
          {Object.entries(paymentFields).map(([key, value]) => (
            <input key={productId} type="hidden" name={key} value={value} />
          ))}
        </form>
      </PricingCardPurchase>
    </>
  );
}

Page.getSharedLayout = getAccountSharedLayout;
