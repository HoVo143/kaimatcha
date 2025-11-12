import { ReactNode } from "react";

interface PageLayoutProps {
  children: ReactNode;
  params: { page: string }; // dynamic segment
}

export default function PageLayout({ children, params }: PageLayoutProps) {
  const { page } = params;

  // Nếu là exhibition → full-width
  const isExhibition = page === "exhibition";

  return (
    <div className="w-full">
      <div className={isExhibition ? "" : "mx-8 max-w-2xl py-20 sm:mx-auto"}>
        {children}
      </div>
    </div>
  );
}
