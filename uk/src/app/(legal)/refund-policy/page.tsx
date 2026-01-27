import fs from "fs";
import path from "path";
import matter from "gray-matter";
import ReactMarkdown from "react-markdown";

export const metadata = {
  title: "Refund Policy",
  description: "Refund Policy of APS Groups Private Limited",
};

export default function RefundPolicyPage() {
  const filePath = path.join(
    process.cwd(),
    "content/legal/refund.md"
  );

  const fileContent = fs.readFileSync(filePath, "utf8");
  const { content } = matter(fileContent);

  return (
    <article className="prose prose-neutral max-w-none">
      <ReactMarkdown>{content}</ReactMarkdown>
    </article>
  );
}
