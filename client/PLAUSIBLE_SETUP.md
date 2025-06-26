# Plausible Analytics Setup Guide

This project includes Plausible Analytics integration for privacy-friendly website analytics.

## Configuration

### 1. Environment Variables

Create a `.env` file in the client directory with the following variables:

```env
# Plausible Analytics Configuration
VITE_PLAUSIBLE_DOMAIN=your-domain.com
VITE_PLAUSIBLE_URL=https://plausible.io/js/script.js
VITE_ANALYTICS_ENABLED=true

# API Configuration
VITE_API_BASE_URL=http://localhost:7001/api

# App Configuration
VITE_APP_NAME=MF Auth App
VITE_APP_VERSION=1.0.0
```

### 2. Update HTML Configuration

In `client/index.html`, update the Plausible script tag:

```html
<!-- Replace 'your-domain.com' with your actual domain -->
<script
  defer
  data-domain="your-domain.com"
  src="https://plausible.io/js/script.js"
></script>
```

## Features

### Automatic Tracking

- Page views are automatically tracked
- Route changes are monitored and logged

### Custom Events

The following events are tracked:

#### Authentication Events

- `login` - User login attempts and successes
- `logout` - User logout actions
- `register` - User registration
- `mfa_setup` - MFA setup initiation
- `mfa_verify` - MFA verification attempts
- `password_reset` - Password reset requests

#### User Interaction Events

- `button_click` - Button interactions
- `form_submit` - Form submissions
- `error_occurred` - Error tracking

### Usage in Components

```javascript
import { useAnalytics } from '../hooks/useAnalytics.js';

const MyComponent = () => {
  const { trackAuth, trackButtonClick, trackFormSubmit } = useAnalytics();

  const handleLogin = () => {
    trackAuth('login', { method: 'email' });
  };

  const handleButtonClick = () => {
    trackButtonClick('submit_button', { page: 'login' });
  };

  const handleFormSubmit = () => {
    trackFormSubmit('contact_form', { form_type: 'contact' });
  };

  return (
    // Your component JSX
  );
};
```

## Privacy Features

- No cookies are used
- No personal data is collected
- GDPR compliant
- Respects Do Not Track settings
- Data is processed in the EU

## Self-Hosting Option

If you want to self-host Plausible:

1. Update the script URL in `index.html`:

```html
<script
  defer
  data-domain="your-domain.com"
  src="https://your-plausible-domain.com/js/script.js"
></script>
```

2. Update the environment variable:

```env
VITE_PLAUSIBLE_URL=https://your-plausible-domain.com/js/script.js
```

## Testing

Analytics are only enabled in production by default. To test in development:

1. Set `VITE_ANALYTICS_ENABLED=true` in your `.env` file
2. Check the browser console for analytics events
3. Verify events appear in your Plausible dashboard

## Troubleshooting

### Events not appearing

1. Check that the domain is correctly configured
2. Verify the script is loading (check Network tab)
3. Ensure analytics are enabled for your environment

### Script not loading

1. Check your internet connection
2. Verify the Plausible URL is correct
3. Check for any ad blockers or privacy extensions

## More Information

- [Plausible Analytics Documentation](https://plausible.io/docs)
- [Privacy Policy](https://plausible.io/privacy-focused-web-analytics)
- [Self-Hosting Guide](https://plausible.io/docs/self-hosting)
