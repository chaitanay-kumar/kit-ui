import type { KitUIComponentMeta } from '../../types/component';

const meta: KitUIComponentMeta = {
  title: 'Login',
  description: 'A configurable authentication card built with the Kit UI form system, featuring password show/hide, remember me, validation states, and social login callbacks.',
  category: 'Auth',
  tagline: 'Refined authentication card with validation & social SSO',
  badges: ['Authentication', 'Forms', 'Responsive', 'Accessible'],
  featured: true,
  createdAt: '2026-08-19',
  features: [
    'Built with Kit UI Form & Button architecture',
    'Interactive password visibility toggle with Lucide icons',
    'Form validation for required fields & email regex format',
    'Spring-animated error banners and inline field alerts',
    'Configurable social SSO buttons (GitHub & Google)',
    'Remember me checkbox and "Forgot password?" callback hooks',
    'Responsive mobile/desktop dimensions with atmospheric glow header',
  ],
  props: [
    { name: 'title', type: 'string', default: "'Welcome back'", description: 'Primary card title text' },
    { name: 'description', type: 'string', default: "'Sign in to access your Kit UI workspace'", description: 'Subtitle description below the title' },
    { name: 'logo', type: 'React.ReactNode', default: '<SparklesIcon />', description: 'Brand badge or logo displayed at the top' },
    { name: 'error', type: 'string | null', default: 'undefined', description: 'Server-side or authentication error banner message' },
    { name: 'isLoading', type: 'boolean', default: 'false', description: 'External submit-button loading state; fields and other actions remain usable' },
    { name: 'onSubmit', type: '(data: LoginFormData) => void | Promise<void>', default: 'undefined', description: 'Called after validation with email, password and rememberMe; returned promises are not awaited' },
    { name: 'onForgotPassword', type: '() => void', default: 'undefined', description: 'Callback when forgot password link is clicked' },
    { name: 'onSignUpClick', type: '() => void', default: 'undefined', description: 'Callback for secondary sign up switch action' },
    { name: 'showSocialLogins', type: 'boolean', default: 'true', description: 'Toggles GitHub and Google SSO buttons' },
    { name: 'onSocialLogin', type: "(provider: 'github' | 'google' | 'apple') => void", default: 'undefined', description: 'Callback when social login button is pressed' },
    { name: 'signUpText', type: 'string', default: '"Don\'t have an account? Sign up"', description: 'Text for the optional secondary sign-up action' },
  ],
  accessibility: [
    'Visible email/password labels and autocomplete hints; labels are not linked with htmlFor',
    'Inline validation messages use alert roles; the server error banner uses visible text',
    'Proper form submission handling with Enter key activation',
    'Theme focus rings on text fields and action buttons',
  ],
  usageCode: `import { Login } from "@/components/ui/login";

export function Demo() {
  const handleLogin = async (data: { email: string; password: string; rememberMe: boolean }) => {
    console.log("Authenticating:", data);
  };

  return (
    <div className="py-8 flex justify-center">
      <Login
        onSubmit={handleLogin}
        onForgotPassword={() => alert("Redirect to forgot password")}
        onSignUpClick={() => alert("Redirect to sign up")}
      />
    </div>
  );
}`,
};

export default meta;
