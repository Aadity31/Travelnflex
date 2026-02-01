import fs from "fs";
import path from "path";
import matter from "gray-matter";
import ReactMarkdown from "react-markdown";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Refund Policy | APS Groups",
  description:
    "Refund and cancellation policy of APS Groups Private Limited. Learn how refunds, cancellations, and disputes are handled under Indian law.",
};

function getRefundContent() {
  try {
    const filePath = path.join(
      process.cwd(),
      "content/legal/refund.md"
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

export default function RefundPolicyPage() {
  const data = getRefundContent();
  if (!data) return notFound();

  const { content, data: frontmatter } = data;
  const toc = generateTOC(content);

  return (
    <main className="bg-neutral-50 min-h-screen">
      <section className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Main Content */}
        <article className="lg:col-span-3 bg-white rounded-2xl shadow-sm border p-8">
          {/* Header */}
          <header className="mb-10">
            <h1 className="text-2xl font-semibold leading-tight text-neutral-900 mb-2">
              Refund & Cancellation Policy
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
          <div className="prose prose-neutral max-w-none prose-headings:leading-snug prose-headings:mt-6 prose-headings:mb-2">
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
                      className="scroll-mt-24 border-b pb-1 mt-6 mb-2 leading-snug"
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

        {/* Sidebar TOC */}
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
