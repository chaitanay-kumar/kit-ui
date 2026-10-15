# Split Button parity

Batch 19 replaces the generic async action controller with React's split-button contract: primary callback, typed options and per-option callbacks, three sizes, four variants, disabled states, automatic top/bottom placement, outside dismissal, focus restoration and menu keyboard handling.

Focused desktop/mobile checks cover primary and option callbacks, disabled menu items, keyboard selection, Escape and restored trigger focus. Angular accepts `TemplateRef` icons in place of React nodes. The React source currently rebuilds `enabledIndices` on every render, causing its effect to reset keyboard highlighting to the first option after arrow/Home/End changes; Angular retains the documented navigation behavior while shared tests avoid claiming that broken React path as parity.
