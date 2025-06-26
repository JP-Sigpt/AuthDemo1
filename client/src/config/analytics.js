// Analytics configuration for Plausible
export const ANALYTICS_CONFIG = {
  // Replace with your actual domain
  domain: import.meta.env.VITE_PLAUSIBLE_DOMAIN || "your-domain.com",

  // Plausible script URL (use self-hosted if needed)
  scriptUrl:
    import.meta.env.VITE_PLAUSIBLE_URL || "https://plausible.io/js/script.js",

  // Enable/disable analytics
  enabled:
    import.meta.env.MODE === "production" &&
    import.meta.env.VITE_ANALYTICS_ENABLED !== "false",

  // Custom events configuration
  events: {
    // Authentication events
    login: "login",
    logout: "logout",
    register: "register",
    mfaSetup: "mfa_setup",
    mfaVerify: "mfa_verify",
    passwordReset: "password_reset",

    // Page navigation events
    pageView: "page_view",

    // User interaction events
    buttonClick: "button_click",
    formSubmit: "form_submit",
    errorOccurred: "error_occurred",
  },
};

// Function to track custom events
export const trackEvent = (eventName, props = {}) => {
  if (
    typeof window !== "undefined" &&
    window.plausible &&
    ANALYTICS_CONFIG.enabled
  ) {
    window.plausible(eventName, { props });
  }
};

// Function to track page views
export const trackPageView = (url = window.location.pathname) => {
  if (
    typeof window !== "undefined" &&
    window.plausible &&
    ANALYTICS_CONFIG.enabled
  ) {
    window.plausible("page_view", { props: { url } });
  }
};

// Function to track authentication events
export const trackAuthEvent = (eventType, additionalProps = {}) => {
  const eventName = ANALYTICS_CONFIG.events[eventType];
  if (eventName) {
    trackEvent(eventName, {
      timestamp: new Date().toISOString(),
      ...additionalProps,
    });
  }
};

// Function to track errors
export const trackError = (error, context = {}) => {
  trackEvent(ANALYTICS_CONFIG.events.errorOccurred, {
    error_message: error.message || "Unknown error",
    error_stack: error.stack,
    context: JSON.stringify(context),
    timestamp: new Date().toISOString(),
  });
};
