# Notification Bell parity

React's `NotificationBell` is the reference. Angular now requires notifications and a mark-read callback, derives unread counts and accessible labels, caps the visible count at `99+`, supports count or dot badges, mark-all, empty state, timestamps, controlled panel state, outside dismissal and listener/timer cleanup. The former dismiss/restore collection API has been removed.

The controlled-state rule matches React exactly: when `onOpenChange` is supplied, interactions report the requested value and the bound owner must update `isOpen`; without it, the component manages its own panel state. The optional `Notification.action` field remains part of the shared data type but is not invoked because the React reference does not invoke it.

Focused validation covers unread/read data, badge modes, item and bulk callbacks, empty state, controlled ownership and outside requests in rendered React and Angular consumers on desktop/mobile. Angular uses CSS for the panel entrance and 600 ms bell shake; exact Framer Motion frames are not claimed.
