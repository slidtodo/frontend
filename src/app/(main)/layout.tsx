import { SidebarProvider } from '@/contexts/SidebarContext';
import Sidebar from '@/shared/components/Sidebar';
import Main from '@/shared/components/Main';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex flex-col bg-[#F2F2F2] md:flex-row">
        <Sidebar />
        <Main>{children}</Main>
      </div>
    </SidebarProvider>
  );
}
