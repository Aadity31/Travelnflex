import fs from "fs";
import path from "path";
import matter from "gray-matter";
import ReactMarkdown from "react-markdown";

export const metadata = {
  title: "Terms & Conditions",
  description: "Terms and Conditions of APS Groups Private Limited",
};

export default function TermsPage() {
  const filePath = path.join(
    process.cwd(),
    "content/legal/terms.md"
  );

  const fileContent = fs.readFileSync(filePath, "utf8");
  const { content } = matter(fileContent);

  return (
    <article className="prose prose-neutral max-w-none">
      <ReactMarkdown>{content}</ReactMarkdown>
    </article>
  );
}
