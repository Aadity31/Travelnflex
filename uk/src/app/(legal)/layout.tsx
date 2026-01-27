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
      {children}

      <FooterWithCredits />
    </>
  );
}
