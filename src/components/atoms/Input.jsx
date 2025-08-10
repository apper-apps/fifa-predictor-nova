import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ 
  className, 
  type = "text", 
  placeholder,
  error,
  ...props 
}, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-lg border border-surface bg-secondary/50 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary disabled:cursor-not-allowed disabled:opacity-50",
        error && "border-error focus:ring-error/50 focus:border-error",
        className
      )}
      placeholder={placeholder}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;