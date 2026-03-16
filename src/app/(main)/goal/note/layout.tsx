interface NoteLayoutProps {
  children: React.ReactNode;
}

export default function NoteLayout({ children }: NoteLayoutProps) {
  return <div className="flex h-screen flex-col bg-gray-50">{children}</div>;
}
