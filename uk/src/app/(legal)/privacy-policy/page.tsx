import fs from "fs";
import path from "path";
import matter from "gray-matter";
import ReactMarkdown from "react-markdown";

export const metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy of APS Groups Private Limited",
};

export default function PrivacyPolicyPage() {
  const filePath = path.join(
    process.cwd(),
    "content/legal/privacy.md"
  );

  const fileContent = fs.readFileSync(filePath, "utf8");
  const { content } = matter(fileContent);

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <article className="prose prose-neutral max-w-none">
        <ReactMarkdown>{content}</ReactMarkdown>
      </article>
    </main>
  );
}
