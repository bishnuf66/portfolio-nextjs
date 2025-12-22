// Service Worker registration
export const registerServiceWorker = () => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
        return;
    }

    window.addEventListener("load", async () => {
        try {
            const registration = await navigator.serviceWorker.register(
                "/sw.js",
            );

            console.log("SW registered: ", registration);

            // Update available
            registration.addEventListener("updatefound", () => {
                const newWorker = registration.installing;
                if (newWorker) {
                    newWorker.addEventListener("statechange", () => {
                        if (
                            newWorker.state === "installed" &&
                            navigator.serviceWorker.controller
                        ) {
                            // New content available, show update notification
                            if (
                                confirm(
                                    "New version available! Reload to update?",
                                )
                            ) {
                                window.location.reload();
                            }
                        }
                    });
                }
            });
        } catch (error) {
            console.log("SW registration failed: ", error);
        }
    });
};

// Unregister service worker (for development)
export const unregisterServiceWorker = async () => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
        return;
    }

    try {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
            await registration.unregister();
            console.log("SW unregistered");
        }
    } catch (error) {
        console.log("SW unregistration failed: ", error);
    }
};
