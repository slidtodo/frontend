import { SidebarProvider } from '@/contexts/SidebarContext';
import Sidebar from '@/shared/components/Sidebar';
import Main from '@/shared/components/Main';

interface MainLayoutProps {
  children: React.ReactNode;
}
// TODO: 해당 레이아웃에 로그인 여부에 따른 접근 제어 추가
export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex h-full min-h-screen flex-col bg-[#F2F2F2] md:flex-row">
        <Sidebar />
        <div id="mobile-toolbar-slot" className="md:hidden" />
        <Main>{children}</Main>
      </div>
    </SidebarProvider>
  );
}
