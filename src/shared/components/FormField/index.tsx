interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}

export default function FormField({ label, required, error, children }: FormFieldProps) {
  return (
    <div className="flex w-full flex-col gap-1">
      <label className="text-base font-medium text-[#333333]">
        {label}
        {required && <span className="ml-0.5 text-[#FF8442]">*</span>}
      </label>
      {children}
      {error && <p className="px-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
