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
    let score = e.target.value;
    
    // Auto-format: if user types numbers, add dash automatically
    if (score.length === 1 && /^\d$/.test(score)) {
      // Don't auto-add dash yet, wait for next character
    } else if (score.length === 2 && /^\d\d$/.test(score)) {
      score = score[0] + '-' + score[1];
    }
    
    // Validate final format or allow partial input
    if (score === "" || /^\d{1,2}$/.test(score) || /^\d{1,2}-$/.test(score) || /^\d{1,2}-\d{1,2}$/.test(score)) {
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