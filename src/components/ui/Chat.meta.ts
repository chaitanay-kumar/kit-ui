import type { KitUIComponentMeta } from '../../types/component';

const meta: KitUIComponentMeta = {
  title: 'Chat',
  description: 'A production-grade conversational chat component with thread history sidebar, rich message rendering, status indicators, file attachments, and auto-expanding composer.',
  category: 'Feedback',
  tagline: 'Production-ready conversation interface with history sidebar and composer',
  badges: ['Chat', 'AI', 'Messaging', 'Interactive'],
  createdAt: '2026-09-21',
  features: [
    'Complete conversational layout with optional historical threads sidebar and responsive mobile drawer',
    'Rich message components supporting user, assistant, and system roles with timestamps and avatars',
    'File and image attachment metadata with chips, sizes, and removal actions; upload transport is supplied by the application',
    'Auto-expanding multiline composer with Enter-to-send and Shift+Enter for newline shortcuts',
    'Failed and streaming message indicators; standalone ChatMessage supports an optional retry callback',
    'Accessible action triggers for copying message content and managing conversation state',
  ],
  props: [
    { name: 'messages', type: 'ChatMessageItem[]', default: 'required', description: 'Externally owned message records including role, content, author, and attachments' },
    { name: 'onSendMessage', type: '(content: string, attachments?: ChatAttachment[]) => void', default: 'required', description: 'Application send callback; the component supplies no message or upload transport' },
    { name: 'isGenerating', type: 'boolean', default: 'false', description: 'Blocks sending and shows a spinner while preserving draft editing and attachment selection' },
    { name: 'threads', type: 'ChatConversationThread[]', default: 'undefined', description: 'Optional list of historical conversations displayed in the sidebar' },
    { name: 'activeThreadId', type: 'string', default: 'undefined', description: 'ID of the currently selected conversation thread' },
    { name: 'onSelectThread', type: '(threadId: string) => void', default: 'undefined', description: 'Callback fired when a user selects a thread from the history sidebar' },
    { name: 'onNewChat', type: '() => void', default: 'undefined', description: 'Callback fired when the user clicks the New Conversation button' },
    { name: 'onClearChat', type: '() => void', default: 'undefined', description: 'Callback fired when the user clicks the clear chat history button' },
    { name: 'accentColor', type: 'string', default: 'undefined', description: 'Optional send-button background color' },
    { name: 'children', type: 'ReactNode', default: 'undefined', description: 'Custom compound layout using ChatHeader, ChatSidebar, ChatMessages and ChatComposer within the root context' },
    { name: 'className', type: 'string', default: 'undefined', description: 'Custom Tailwind class names for styling overrides' },
  ],
  accessibility: [
    'Keyboard navigable message history and composer with standard Enter and Shift+Enter keybindings',
    'Composer textarea uses a placeholder; consuming applications can supply additional accessible labeling',
    'Mobile sidebar offers native toggle, close and thread-selection buttons',
    'Send, attachment, history and message-copy actions have accessible names',
  ],
  usageCode: `import { Chat, type ChatMessageItem } from "@/components/ui/chat";

export function Demo() {
  const messages: ChatMessageItem[] = [
    { id: '1', role: 'user', content: 'Can you show me how to style Kit UI tables?', timestamp: '10:40 AM' },
    { id: '2', role: 'assistant', content: 'Certainly! Kit UI tables use the semantic --border and --surface tokens.', timestamp: '10:41 AM' },
  ];

  return (
    <Chat
      messages={messages}
      onSendMessage={(text) => console.log('Send:', text)}
    />
  );
}`,
};

export default meta;
