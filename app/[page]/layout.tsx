// export default function Layout({ children }: { children: React.ReactNode }) {
//   return (
//     <>
//       <div className="w-full">
//         <div className="mx-8 max-w-2xl py-20 sm:mx-auto">{children}</div>
//       </div>
//     </>
//   );
// }
import { ReactNode } from "react";

interface PageLayoutProps {
  children: ReactNode;
  params: { page: string } | Promise<{ page: string }>;
}

export default async function PageLayout({
  children,
  params,
}: PageLayoutProps) {
  const { page } = await params;

  const isExhibition = page === "exhibition";

  return (
    <div className="w-full">
      <div className={isExhibition ? "" : "mx-8 max-w-2xl py-20 sm:mx-auto"}>
        {children}
      </div>
    </div>
  );
}
