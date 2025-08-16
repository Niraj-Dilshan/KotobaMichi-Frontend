import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile",
  description: "Your account and learning preferences.",
  robots: { index: false, follow: false },
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return children;
}
