import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" data-theme="light">
      <Head />
      <body className="bg-landing bg-cover bg-no-repeat">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
