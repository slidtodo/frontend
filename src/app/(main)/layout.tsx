import { SidebarProvider } from '@/contexts/SidebarContext';
import Sidebar from '@/features/dashboard/components/Sidebar';
import Main from '@/features/dashboard/components/Main';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <SidebarProvider>
      <div className="h-screen flex bg-gray-50">
        <Sidebar />
        <Main>{children}</Main>
      </div>
    </SidebarProvider>
  );
}
