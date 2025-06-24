import { useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import {
  trackEvent,
  trackPageView,
  trackAuthEvent,
  trackError,
} from "../config/analytics.js";

export const useAnalytics = () => {
  const location = useLocation();

  // Track page views automatically
  useEffect(() => {
    trackPageView(location.pathname);
  }, [location.pathname]);

  // Track custom events
  const trackCustomEvent = useCallback((eventName, props = {}) => {
    trackEvent(eventName, props);
  }, []);

  // Track authentication events
  const trackAuth = useCallback((eventType, additionalProps = {}) => {
    trackAuthEvent(eventType, additionalProps);
  }, []);

  // Track errors
  const trackErrorEvent = useCallback((error, context = {}) => {
    trackError(error, context);
  }, []);

  // Track button clicks
  const trackButtonClick = useCallback((buttonName, additionalProps = {}) => {
    trackEvent("button_click", {
      button_name: buttonName,
      ...additionalProps,
    });
  }, []);

  // Track form submissions
  const trackFormSubmit = useCallback((formName, additionalProps = {}) => {
    trackEvent("form_submit", {
      form_name: formName,
      ...additionalProps,
    });
  }, []);

  return {
    trackCustomEvent,
    trackAuth,
    trackError: trackErrorEvent,
    trackButtonClick,
    trackFormSubmit,
    trackPageView,
  };
};
