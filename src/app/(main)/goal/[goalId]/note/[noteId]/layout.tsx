import clsx from "clsx";

export default function NoteDetailLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={clsx(
      'fixed inset-0 z-50 bg-white overflow-y-auto',
      'lg:inset-y-0 lg:left-auto lg:right-0 lg:w-[744px] lg:animate-slide-in-right lg:shadow-[-4px_0_24px_rgba(0,0,0,0.1)] lg:rounded-l-[40px]',
    )}>
      {children}
    </div>
  );
}