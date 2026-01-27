import FooterWithCredits from "@/components/Footer";
import { ReactNode } from "react";

export const metadata = {
  robots: {
    index: true,
    follow: true,
  },
};

export default function LegalLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          {/* <h1 className="text-lg font-semibold">Legal</h1> */}
        </div>
      </header>

      {children}

      <footer className="border-t mt-16">
        {/* <div className="max-w-4xl mx-auto px-4 py-6 text-sm text-muted-foreground">
          © {new Date().getFullYear()} APS Groups Private Limited
        </div> */}
      </footer>
      <FooterWithCredits />
    </>
  );
}
