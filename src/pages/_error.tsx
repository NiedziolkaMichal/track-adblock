import * as Sentry from "@sentry/nextjs";
import NextErrorComponent from "next/error";
import { NextPageContext } from "next";
import { ErrorProps } from "next/dist/pages/_error";
import { initSentry } from "../lib/util/log";

const CustomErrorComponent = (props: ErrorProps) => {
  initSentry();
  Sentry.captureUnderscoreErrorException(props);

  return <NextErrorComponent statusCode={props.statusCode} />;
};

CustomErrorComponent.getInitialProps = async (context: NextPageContext) => {
  initSentry();
  await Sentry.captureUnderscoreErrorException(context);
  // This will contain the status code of the response
  return NextErrorComponent.getInitialProps(context);
};

export default CustomErrorComponent;
