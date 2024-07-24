import { type ReactNode } from "react";

function PageHeader({ children }: { children: ReactNode }) {
  return <h1 className="text-4xl mb-4">{children}</h1>;
}

export default PageHeader;
