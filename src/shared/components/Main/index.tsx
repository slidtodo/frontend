interface MainProps {
  children: React.ReactNode;
}
export default function Main({ children }: MainProps) {
  return (
    <main className={`w-full py-8 px-4 md:py-12 md:px-6 lg:py-20 lg:px-[96px] transition-all duration-300`}>
      {children}
    </main>
  );
}
