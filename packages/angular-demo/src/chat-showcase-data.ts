// Same-data contract: React ChatLiveShowcase in NewComponentsShowcase.tsx.
import type {ChatMessageItem,ChatConversationThread} from 'kit-ui-angular';
export const INITIAL_CHAT_MESSAGES: ChatMessageItem[] = [
  {
    id: 'msg-1',
    role: 'user',
    content: 'Can you show me how to compose an accessible data table in Kit UI?',
    author: 'Alex',
    timestamp: '10:41 AM',
    status: 'delivered',
  },
  {
    id: 'msg-2',
    role: 'assistant',
    content: `Certainly! Kit UI provides a fully compound \`<DataTable>\` component with sorting, searching, selection, and responsive pagination:

\`\`\`tsx
<DataTable data={users} columns={columns}>
  <DataTableToolbar title="Team Directory" />
  <DataTableFilters />
  <DataTableContent />
  <DataTablePagination />
</DataTable>
\`\`\`

It adheres to strict monochromatic styling and supports full keyboard navigation out of the box.`,
    author: 'Kit AI Assistant',
    timestamp: '10:42 AM',
    status: 'delivered',
  },
];

export const INITIAL_THREADS: ChatConversationThread[] = [
  { id: 't-1', title: 'Data Table Architecture', timestamp: '10:40 AM', group: 'Today' },
  { id: 't-2', title: 'Framer Motion Spring Tokens', timestamp: 'Yesterday', group: 'Yesterday' },
  { id: 't-3', title: 'Accessibility (WCAG) Audit', timestamp: '2 days ago', group: 'Previous' },
];

