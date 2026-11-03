import Script from "next/script";

const MEASUREMENT_ID_PATTERN = /^G-[A-Z0-9]+$/;

export function GoogleAnalytics() {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();

  if (!measurementId) {
    return null;
  }

  if (!MEASUREMENT_ID_PATTERN.test(measurementId)) {
    console.warn(
      "NEXT_PUBLIC_GA_MEASUREMENT_ID must look like G-XXXXXXXX. Google Analytics was not loaded.",
    );
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}');
        `}
      </Script>
    </>
  );
}
