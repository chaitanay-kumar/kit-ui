import type { KitUIComponentMeta } from '../../types/component';

const meta: KitUIComponentMeta = {
  title: 'Form',
  description: 'A modular, composable form system with inputs, textareas, native selects, checkboxes, radio groups, switches, and animated validation messages.',
  category: 'Forms',
  tagline: 'Composable, accessible form primitives and controls',
  badges: ['Forms', 'Accessible', 'Spring Motion', 'Tailwind'],
  featured: true,
  createdAt: '2026-08-19',
  features: [
    'Modular layout primitives: Form, FormItem, FormLabel, FormControl, FormDescription, FormMessage',
    'Comprehensive controls: Input, Textarea, Select, Checkbox, RadioGroup, RadioGroupItem, Switch',
    'Spring-animated validation errors and password visibility toggle',
    'Tactile check, radio dot, and toggle switch spring physics',
    'Accessible ARIA semantics, required asterisks, and keyboard navigation',
    'Strict monochrome dark styling matching Kit UI surface elevation tokens',
  ],
  props: [
    { name: 'onSubmit', type: '(e: FormEvent) => void', default: 'undefined', description: 'Form submission handler' },
    { name: 'error', type: 'string | boolean', default: 'undefined', description: 'Validation error text or boolean trigger' },
    { name: 'showPasswordToggle', type: 'boolean', default: 'false', description: 'Enables eye icon toggle for password inputs' },
    { name: 'required', type: 'boolean', default: 'false', description: 'FormLabel displays an asterisk; set native control required separately' },
    { name: 'noValidate', type: 'boolean', default: 'true', description: 'Form skips native validation by default; set false to enable browser validity checks' },
    { name: 'leftIcon', type: 'React.ReactNode', default: 'undefined', description: 'Leading icon inside input fields' },
    { name: 'rightIcon', type: 'React.ReactNode', default: 'undefined', description: 'Trailing icon inside input fields' },
  ],
  accessibility: [
    'Checkbox and radio controls generate linked IDs; connect other labels with htmlFor and an input id',
    'ARIA role="alert" on animated validation messages',
    'role="switch" and role="radiogroup" with proper aria-checked attributes',
    'Theme focus rings on text fields, select controls and switch buttons',
  ],
  usageCode: `import { Form, FormItem, FormLabel, FormControl, FormDescription, FormMessage, Input } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function Demo() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
    } else {
      setError("");
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="max-w-sm">
      <FormItem>
        <FormLabel required>Email Address</FormLabel>
        <FormControl>
          <Input
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!error}
          />
        </FormControl>
        <FormDescription>We will never share your email.</FormDescription>
        <FormMessage error={error} />
      </FormItem>
      <Button type="submit" variant="primary" fullWidth>
        Submit
      </Button>
    </Form>
  );
}`,
};

export default meta;
