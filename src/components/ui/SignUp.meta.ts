import type { KitUIComponentMeta } from '../../types/component';

const meta: KitUIComponentMeta = {
  title: 'Sign Up',
  description: 'A comprehensive registration card with live password strength metrics, password confirmation matching, terms validation, and social onboarding.',
  category: 'Auth',
  tagline: 'Registration with password strength and terms validation',
  badges: ['Registration', 'Forms', 'Password Strength'],
  featured: true,
  createdAt: '2026-08-19',
  features: [
    'Integrated live 4-tier password strength indicator bar',
    'Password confirmation matching validation',
    'Interactive eye icons for show/hide password visibility',
    'Terms of service and privacy agreement checkbox validation',
    'Customizable social onboarding SSO buttons (GitHub & Google)',
    'Submitting state with monochrome button spinner',
    'Responsive layout with atmospheric glow and dark slate tokens',
  ],
  props: [
    { name: 'title', type: 'string', default: "'Create an account'", description: 'Primary card title text' },
    { name: 'description', type: 'string', default: "'Join Kit UI to access components and templates'", description: 'Subtitle description below the title' },
    { name: 'logo', type: 'React.ReactNode', default: '<SparklesIcon />', description: 'Brand badge or logo displayed at the top' },
    { name: 'error', type: 'string | null', default: 'undefined', description: 'Server-side registration error banner message' },
    { name: 'isLoading', type: 'boolean', default: 'false', description: 'External loading state; disables the submit button while fields and social actions remain active' },
    { name: 'onSubmit', type: '(data: SignUpFormData) => void | Promise<void>', default: 'undefined', description: 'Callback receives name, email, password, confirmPassword and agreeToTerms; returned promises do not control loading' },
    { name: 'onSignInClick', type: '() => void', default: 'undefined', description: 'Callback for switching to login view' },
    { name: 'showSocialSignUp', type: 'boolean', default: 'true', description: 'Toggles GitHub and Google SSO buttons' },
    { name: 'onSocialSignUp', type: "(provider: 'github' | 'google') => void", description: 'Social action callback; consumer owns authentication' },
    { name: 'signInText', type: 'string', default: "'Already have an account? Sign in'", description: 'Text for the optional sign-in action' },
    { name: 'requireConfirmPassword', type: 'boolean', default: 'true', description: 'Includes confirmation password field and checks match' },
    { name: 'termsText', type: 'React.ReactNode', default: 'Default Terms & Privacy links', description: 'Custom agreement label text or JSX' },
  ],
  accessibility: [
    'Visible required labels and autocomplete values; labels are not programmatically linked to inputs',
    'Role="alert" for validation errors with smooth Framer Motion spring entrances',
    'Keyboard navigable form submission and checkbox selection',
    'Native field and checkbox keyboard access; password visibility buttons have tabIndex -1',
    'Server error banner is not a live alert; component spring animations do not bypass reduced motion',
  ],
  usageCode: `import { SignUp, type SignUpFormData } from "@/components/ui/sign-up";

export function Demo() {
  const handleSignUp = async (data: SignUpFormData) => {
    // Supply application registration and manage isLoading/error outside the card.
    void data;
  };

  return (
    <div className="py-8 flex justify-center">
      <SignUp
        onSubmit={handleSignUp}
        onSignInClick={() => alert("Redirect to sign in")}
      />
    </div>
  );
}`,
};

export default meta;
