import fs from "fs";
import path from "path";

const HTML_DIR = path.join(process.cwd(), "html");

export type LandingHtml = {
  filename: string;
  title: string;
  description?: string;
  links: Array<Record<string, string>>;
  styles: string;
  bodyHtml: string;
};

function parseAttributes(tag: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  for (const match of tag.matchAll(/([\w:-]+)=["']([^"']*)["']/g)) {
    attrs[match[1]] = match[2];
  }
  return attrs;
}

function getHtmlFilename(): string {
  const files = fs
    .readdirSync(HTML_DIR)
    .filter((file) => file.endsWith(".html"))
    .sort();

  if (files.length === 0) {
    throw new Error("No HTML file found in html/ directory");
  }

  return files[0];
}

export function getLandingHtml(): LandingHtml {
  const filename = getHtmlFilename();
  const raw = fs.readFileSync(path.join(HTML_DIR, filename), "utf-8");

  const titleMatch = raw.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const descriptionMatch = raw.match(
    /<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i,
  );
  const headMatch = raw.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  const bodyMatch = raw.match(/<body[^>]*>([\s\S]*?)<\/body>/i);

  const headContent = headMatch?.[1] ?? "";

  const styles = [...headContent.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)]
    .map((match) => match[1])
    .join("\n");

  const links = [...headContent.matchAll(/<link([^>]*)>/gi)].map((match) =>
    parseAttributes(match[1]),
  );

  return {
    filename,
    title: titleMatch?.[1]?.trim() ?? "Landing",
    description: descriptionMatch?.[1]?.trim(),
    links,
    styles,
    bodyHtml: bodyMatch?.[1]?.trim() ?? raw,
  };
}
