import Head from "next/head";

export function SharedMetaData() {
  const description = "Wtyczka pozwalająca śledzić użytkowników AdBlocka i zbierać dane do Google Analytics";
  return (
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="preload" href="/font/Montserrat.woff2" as="font" crossOrigin="" />
      <link rel="apple-touch-icon" href="/favicon/favicon-180.png" />
      <link rel="icon" href="/favicon/favicon.svg" />
      <link rel="icon" href="/favicon/favicon-32.png" sizes="any" />
      <meta name="theme-color" content="#f5effe" />
      <meta key="description" name="description" content={description} />
      <meta key="twitter:description" name="twitter:description" content={description} />
      <meta property="og:image" content={process.env.NEXTAUTH_URL + "/og-image.webp"} />
      <meta name="twitter:card" content="summary" />
    </Head>
  );
}

export function PageMetaData({ title, socialTitle = title }: { title: string; socialTitle?: string }) {
  return (
    <Head>
      <title>{title}</title>
      <meta key="og:title" property="og:title" content={socialTitle} />
      <meta key="twitter:title" name="twitter:title" content={socialTitle} />
    </Head>
  );
}
