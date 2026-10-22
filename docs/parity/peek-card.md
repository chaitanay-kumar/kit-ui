# Peek Card parity

Batch 17 replaces the generic disclosed collection with the React contract: projected trigger content, structured payment/customer metadata, optional action callbacks, delayed hover, focus and tap opening, top/bottom/automatic placement, loading skeleton, custom `TemplateRef` content, email copy feedback and outside-click cleanup.

Focused checks cover delayed hover/leave, tap loading state and fixed placement on desktop and mobile. Angular gives the loading skeleton an accessible status label; the React source currently exposes only visual skeleton blocks. Angular custom content uses `TemplateRef` in place of React's render function.

Hosted QA follow-up supplies the source payment trigger and explanatory caption, and aligns the native responsive panel width, payment typography, customer badge and copy/status vectors. Current validation and unresolved raster/animation review are tracked in `hosted-qa.md`.

The hosted source and native examples reserve a 600 px stage so the above-trigger panel fits completely. A smaller stage clipped the source's top placement and made the iframe choose a clipped bottom placement; this demo-space correction does not change standalone auto-placement.
