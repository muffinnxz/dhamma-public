import { MainNav } from "./main-nav";
import { SiteFooter } from "./site-footer";

interface LayoutProps {
  children: React.ReactNode;
}

export default function HomeLayout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <MainNav/>
      <main className="flex-1">{children}</main>
      <SiteFooter/>
    </div>
  );
}
