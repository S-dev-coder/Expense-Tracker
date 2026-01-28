import React from "react";

interface LayoutWrapperProps {
    children: React.ReactNode;
    columns?: 1 | 2;
    className?: string;
}

/**
 * Standardized wrapper for page content.
 * Supports 1 or 2 equal-width columns on desktop.
 * Stacks vertically on mobile.
 */
export const LayoutWrapper: React.FC<LayoutWrapperProps> = ({
    children,
    columns = 1,
    className = ""
}) => {
    return (
        <div className={`grid gap-6 ${columns === 2 ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"} ${className}`}>
            {children}
        </div>
    );
};
