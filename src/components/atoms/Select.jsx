import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Select = forwardRef(({ 
  className, 
  children, 
  placeholder,
  error,
  ...props 
}, ref) => {
  return (
    <select
      className={cn(
        "flex h-10 w-full rounded-lg border border-surface bg-secondary/50 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary disabled:cursor-not-allowed disabled:opacity-50",
        error && "border-error focus:ring-error/50 focus:border-error",
        className
      )}
      ref={ref}
      {...props}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {children}
    </select>
  );
});

Select.displayName = "Select";

export default Select;