import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "md", 
  children, 
  disabled,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-black hover:shadow-lg hover:shadow-primary/25 focus:ring-primary",
    secondary: "bg-surface hover:bg-surface/80 text-white border border-primary/30 hover:border-primary/50 focus:ring-primary/50",
    accent: "bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-black hover:shadow-lg hover:shadow-accent/25 focus:ring-accent",
    outline: "border border-primary text-primary hover:bg-primary hover:text-black focus:ring-primary",
    ghost: "text-gray-300 hover:text-white hover:bg-surface/50 focus:ring-primary/50"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        disabled && "opacity-50 cursor-not-allowed hover:shadow-none",
        className
      )}
      ref={ref}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;