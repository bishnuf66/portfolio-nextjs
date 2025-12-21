"use client";

import React from "react";
import CustomScrollbar from "./CustomScrollbar";

interface ScrollableContainerProps {
    children: React.ReactNode;
    maxHeight?: string;
    className?: string;
    showIndicator?: boolean;
}

const ScrollableContainer: React.FC<ScrollableContainerProps> = ({
    children,
    maxHeight = "500px",
    className = "",
    showIndicator = true,
}) => {
    return (
        <CustomScrollbar
            maxHeight={maxHeight}
            showScrollIndicator={showIndicator}
            className={`enhanced-scrollbar ${className}`}
        >
            {children}
        </CustomScrollbar>
    );
};

export default ScrollableContainer;