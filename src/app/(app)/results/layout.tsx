import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Results",
  description: "See your quiz attempt results and progress.",
  robots: { index: false, follow: false },
};

export default function ResultsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
