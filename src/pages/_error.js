import * as Sentry from "@sentry/nextjs";
import NextErrorComponent from "next/error";

const CustomErrorComponent = (props) => {
  Sentry.captureUnderscoreErrorException(props);

  return <NextErrorComponent statusCode={props.statusCode} />;
};

CustomErrorComponent.getInitialProps = async (contextData) => {
  await Sentry.captureUnderscoreErrorException(contextData);

  // This will contain the status code of the response
  return NextErrorComponent.getInitialProps(contextData);
};

export default CustomErrorComponent;
