# SlidePagination parity

Batch 18 replaces the two-way `totalPages` placeholder API with React's controlled/uncontrolled contract: required `pageCount`, optional `page`, `defaultPage`, `siblingCount`, `onChange`, `showControls`, class customization and the same boundary/ellipsis range algorithm.

Focused desktop/mobile checks cover controlled callbacks, visible ranges, active-page semantics and hidden controls. Angular uses a CSS active indicator rather than React's shared-layout sliding animation.
