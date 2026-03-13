import { ReactNode } from 'react';

interface PageSubTitleProps {
  icons?: ReactNode;
  subTitle: string;
  actions?: ReactNode;
}

export default function PageSubTitle({ icons, subTitle, actions }: PageSubTitleProps) {
  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex items-center gap-3">
        {icons && <div>{icons}</div>}
        <h2 className="text-base font-medium transition-all duration-300 lg:text-lg">{subTitle}</h2>
      </div>
      {actions && <div>{actions}</div>}
    </div>
  );
}
