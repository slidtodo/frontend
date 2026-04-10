export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center gap-1">
      <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-white [animation-delay:-0.3s]" />
      <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-white [animation-delay:-0.15s]" />
      <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-white" />
    </div>
  );
}
