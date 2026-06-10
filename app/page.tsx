import type { Metadata } from "next";
import { getLandingHtml } from "@/lib/landing-html";

export function generateMetadata(): Metadata {
  const { title, description } = getLandingHtml();
  return {
    title,
    ...(description ? { description } : {}),
  };
}

export default function Home() {
  const { links, styles, bodyHtml } = getLandingHtml();

  return (
    <>
      {links.map((attrs, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <link key={index} {...attrs} />
      ))}
      {styles ? (
        <style dangerouslySetInnerHTML={{ __html: styles }} />
      ) : null}
      <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />
    </>
  );
}
