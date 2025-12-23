import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg";
  shadow?: boolean;
  onClick?: () => void;
}

export default function Card({
  children,
  className = "",
  padding = "md",
  shadow = true,
  onClick,
}: CardProps) {
  const paddingClasses = {
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
  };

  const shadowClass = shadow ? "shadow-sm" : "";
  const cursorClass = onClick ? "cursor-pointer" : "";

  return (
    <div
      className={`bg-white rounded-16 ${paddingClasses[padding]} ${shadowClass} ${cursorClass} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
