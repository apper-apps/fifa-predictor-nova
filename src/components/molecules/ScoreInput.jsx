import React from "react";
import Input from "@/components/atoms/Input";
import { cn } from "@/utils/cn";

const ScoreInput = ({ 
  value, 
  onChange, 
  placeholder = "0-0", 
  className,
  error 
}) => {
const handleChange = (e) => {
    const score = e.target.value;
    // Enhanced validation for score format (e.g., "2-1", "0-0")
    // Allow empty string or valid score format (1-2 digits, dash, 1-2 digits)
    if (score === "" || /^\d{1,2}-\d{1,2}$/.test(score)) {
      onChange(score);
    }
  };

  return (
    <Input
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      className={cn("text-center font-mono", className)}
      error={error}
    />
  );
};

export default ScoreInput;