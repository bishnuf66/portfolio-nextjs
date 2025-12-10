/**
 * Smoothly scrolls to an element with the given ID
 * @param elementId - The ID of the element to scroll to
 * @param offset - Optional offset from the top (default: 80px for header)
 */
export const scrollToElement = (elementId: string, offset: number = 80) => {
    const element = document.getElementById(elementId);
    if (element) {
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
        });
    }
};

/**
 * Scrolls to the top of the page
 */
export const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });
};

/**
 * Creates a click handler for smooth scrolling to an element
 * @param elementId - The ID of the element to scroll to
 * @param offset - Optional offset from the top
 * @returns Click event handler
 */
export const createScrollHandler = (elementId: string, offset?: number) => {
    return (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        scrollToElement(elementId, offset);
    };
};

/**
 * Creates a navigation handler that works across pages
 * @param sectionId - The ID of the section to navigate to
 * @param router - Next.js router instance
 * @param pathname - Current pathname
 * @param offset - Optional offset from the top
 * @returns Click event handler
 */
export const createCrossPageNavigationHandler = (
    sectionId: string,
    router: any,
    pathname: string,
    offset: number = 80,
) => {
    return (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        if (pathname === "/") {
            // Already on home page, just scroll to section
            scrollToElement(sectionId, offset);
        } else {
            // Navigate to home page with section hash
            router.push(`/#${sectionId}`);
        }
    };
};

/**
 * Checks if an element is in the viewport
 * @param elementId - The ID of the element to check
 * @returns Boolean indicating if element is visible
 */
export const isElementInViewport = (elementId: string): boolean => {
    const element = document.getElementById(elementId);
    if (!element) return false;

    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <=
            (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <=
            (window.innerWidth || document.documentElement.clientWidth)
    );
};

/**
 * Gets the current active section based on scroll position
 * @param sectionIds - Array of section IDs to check
 * @param offset - Offset for determining active section
 * @returns The ID of the currently active section
 */
export const getActiveSection = (
    sectionIds: string[],
    offset: number = 100,
): string | null => {
    const scrollPosition = window.scrollY + offset;

    for (let i = sectionIds.length - 1; i >= 0; i--) {
        const element = document.getElementById(sectionIds[i]);
        if (element && element.offsetTop <= scrollPosition) {
            return sectionIds[i];
        }
    }

    return sectionIds[0] || null;
};
