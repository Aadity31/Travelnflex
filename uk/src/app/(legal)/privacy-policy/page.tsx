import fs from "fs";
import path from "path";
import matter from "gray-matter";
import ReactMarkdown from "react-markdown";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Privacy Policy | APS Groups",
  description:
    "Privacy Policy of APS Groups Private Limited. Learn how we collect, use, and protect your personal data under Indian law.",
};

function getPrivacyContent() {
  try {
    const filePath = path.join(
      process.cwd(),
      "content/legal/privacy.md"
    );

    const file = fs.readFileSync(filePath, "utf8");
    return matter(file);
  } catch {
    return null;
  }
}

function generateTOC(markdown: string) {
  return markdown
    .split("\n")
    .filter((line) => line.startsWith("## "))
    .map((line) => {
      const text = line.replace("## ", "").trim();
      const id = text
        .toLowerCase()
        .replace(/[^\w]+/g, "-")
        .replace(/(^-|-$)/g, "");
      return { text, id };
    });
}

export default function PrivacyPolicyPage() {
  const data = getPrivacyContent();
  if (!data) return notFound();

  const { content, data: frontmatter } = data;
  const toc = generateTOC(content);

  return (
    <main className="bg-neutral-50 min-h-screen">
      <section className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Content */}
        <article className="lg:col-span-3 bg-white rounded-2xl shadow-sm border p-8">
          {/* Header */}
          <header className="mb-10">
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
              Privacy Policy
            </h1>

            <div className="mt-3 flex flex-wrap gap-3 text-sm">
              <span className="px-3 py-1 rounded-full bg-neutral-100 text-neutral-700">
                Company: APS Groups Private Limited
              </span>
              <span className="px-3 py-1 rounded-full bg-neutral-100 text-neutral-700">
                Jurisdiction: India
              </span>
              {frontmatter?.lastUpdated && (
                <span className="px-3 py-1 rounded-full bg-neutral-100 text-neutral-700">
                  Last Updated: {frontmatter.lastUpdated}
                </span>
              )}
            </div>
          </header>

          {/* Markdown */}
          <div className="prose prose-neutral max-w-none">
            <ReactMarkdown
              components={{
                h2: ({ node: _node, ...props }) => {
                  const text = String(props.children);
                  const id = text
                    .toLowerCase()
                    .replace(/[^\w]+/g, "-")
                    .replace(/(^-|-$)/g, "");
                  return (
                    <h2
                      id={id}
                      className="scroll-mt-24 border-b pb-2"
                      {...props}
                    />
                  );
                },
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        </article>

        {/* TOC */}
        <aside className="hidden lg:block sticky top-24 h-fit">
          <div className="bg-white border rounded-2xl p-6 shadow-sm">
            <h3 className="font-semibold text-sm text-neutral-500 uppercase tracking-wide mb-4">
              On this page
            </h3>
            <ul className="space-y-2 text-sm">
              {toc.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="text-neutral-700 hover:text-neutral-900 transition"
                  >
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </section>
    </main>
  );
}
