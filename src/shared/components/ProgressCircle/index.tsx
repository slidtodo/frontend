import { cn } from '@/lib/utils';

interface ProgressCircleProps {
  className?: string;
  color?: string;
  percent: number;
}

export default function ProgressCircle({ className, color = '#009D97', percent }: ProgressCircleProps) {
  const clampedPercent = Math.max(0, Math.min(100, percent));
  const size = 160;
  const strokeWidth = 28;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clampedPercent / 100);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      className={cn('aspect-square shrink-0', className)}
      role="img"
      aria-label={`진행률 ${clampedPercent}%`}
    >
      <circle cx={size / 2} cy={size / 2} r={radius} stroke={color} strokeWidth={strokeWidth} fill="none" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#ffffff"
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform={`rotate( -90 ${size / 2} ${size / 2})`}
      />
    </svg>
  );
}
