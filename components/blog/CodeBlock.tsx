import { codeToHtml } from "shiki";
import CopyButton from "./CopyButton";

/**
 * Syntax-highlighted code block. Shiki runs at build (async server component)
 * so there is zero client-side highlighting JS. The `.prose-blog pre.shiki`
 * rules in globals.css keep our brand dark frame; Shiki only colors the tokens.
 */
export default async function CodeBlock({
  code,
  lang = "text",
}: {
  code: string;
  lang?: string;
}) {
  const trimmed = code.replace(/\n+$/, "");
  const html = await codeToHtml(trimmed, {
    lang,
    theme: "one-dark-pro",
  });

  return (
    <div className="group relative">
      <CopyButton code={trimmed} />
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
