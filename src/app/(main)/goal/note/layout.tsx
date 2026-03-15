{
  /** @TODO  이 컴포넌트는 main 레이아웃이므로 추후 삭제  */
}

interface NoteLayoutProps {
  children: React.ReactNode;
}

export default function NoteLayout({ children }: NoteLayoutProps) {
  return <div className="flex h-screen flex-col bg-gray-50 md:flex-row">{children}</div>;
}
