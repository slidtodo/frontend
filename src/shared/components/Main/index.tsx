interface MainProps {
  children: React.ReactNode;
}
export default function Main({ children }: MainProps) {
  return (
    <main
      className={`w-full px-4 py-8 pt-8 pr-[16px] pl-[15px] transition-all duration-300 md:pt-12 md:pr-[26px] md:pl-6 lg:pt-20 lg:pr-[88px] lg:pl-[88px]`}
    >
      {children}
    </main>
  );
}
