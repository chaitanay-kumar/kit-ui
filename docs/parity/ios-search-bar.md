# iOS Search Bar parity review

React's `IOSSearchBar` is the reference. The Angular component is a native controlled search input; it no longer renders a collection of filterable results.

## Contract and migration

- Supply required `value: string` and `onChange: (value: string) => void` inputs. The application owns the value. Replace the former collection `items`, `query`, selection, loading, error and action bindings with application-side filtering if needed.
- Optional `onSubmit` receives the current untrimmed value on Enter and prevents native form submission. Without it, Enter retains native form behavior.
- Clear calls `onChange('')`, then optional `onClear`, then focuses the input. The clear button has `type="button"`. As in React, disabling the input does not disable a visible clear button; a disabled input cannot receive focus.
- Defaults match React: `placeholder='Search...'`, `disabled=false`, `autoFocus=false`, `collapsedWidth='220px'`, `expandedWidth='340px'`, and empty `className`. Explicit undefined optional bindings retain these defaults. Autofocus runs on mount, not whenever the option changes.
- Focus or a nonempty value expands the control. Programmatic blur retains expansion for nonempty values. Escape blurs the input; Chromium's subsequent native search `change` event clears its value and is forwarded once. Ordinary blur must not duplicate callbacks already delivered through `input`.
- Accepted edits preserve the caret when typing in the middle of a query. Rejected edits are restored only after parent bindings settle, so controlled-state restoration does not move the cursor to the end on every keystroke.
- `className` applies to the outer width wrapper. Numeric widths are pixels; CSS strings support responsive widths relative to the containing block. As with React, the caller must choose widths appropriate to available space.
- The idle command-key hint is decorative; neither component installs a global Cmd/Ctrl+K shortcut. Direct Angular `formControl` integration and SSR are not validated.

```ts
import {Component, signal} from '@angular/core';
import {KitIosSearchBarComponent} from 'kit-ui-angular';
@Component({
  selector: 'app-search', imports: [KitIosSearchBarComponent],
  template: `<kit-ios-search-bar [value]="query()" [onChange]="change" [onSubmit]="submit"/>`,
})
export class SearchComponent {
  readonly query = signal('');
  readonly change = (value: string) => this.query.set(value);
  readonly submit = (value: string) => { console.log(value); };
}
```

## Rendering and motion

The 40px pill, 14px horizontal padding, search/clear/command SVGs, 16px input text, dark palette, focus border/shadow, clear-button focus ring and 640px hint breakpoint follow React. The website showcase uses the same telemetry placeholder, caption, state and panel geometry; demo typography follows the React documentation shell.

Angular uses a native requestAnimationFrame width spring with the reference stiffness/damping/mass of 200/28/0.85 and retained velocity on interruption. Clear controls enter/exit over 150ms. ResizeObserver resolves CSS widths when the containing block changes. Destruction cancels animation frames, Web Animations, resize observation and motion-preference listeners.

Angular intentionally disables width, clear and CSS transition motion for reduced motion, including a preference change during animation. React currently keeps its spring motion under that preference. This is a documented accessibility difference; frame-for-frame spring equivalence across engines is not claimed.

## Validation — 2026-10-13

Validated locally on `feat/angular-ios-search-parity`, based on `e85d06d`, using Node 22.23.3 and Microsoft Edge/Chromium on Windows. This branch is not merged; independent maintainer review and full user QA remain pending.

- All 30 focused desktop/mobile browser cases pass, including caret preservation and native Escape synchronization.
- All 26 catalog/framework-tab regression cases pass, including 432 native port mounts across both themes and device profiles, source dependencies and source-request retry.
- All 117 unit tests across 14 files pass. Expected inherited JSDOM canvas messages remain.
- Production build passes strict TypeScript, Angular library/demo compilation, 116 registry entries, 136 prerendered routes and all 289 SEO audit checks.
- Packaged controlled API verification passes. Installed strict-template consumers compile all 116 selectors under Angular 20.0.0, 20.3.33, 21.2.25 and 22.2.1, including optional bindings for the new search API.
- Lint passes with the same 21 inherited warnings; no new warnings. Documentation links and `git diff --check` pass.

| Captured control | React | Angular |
| --- | --- | --- |
| Desktop, light | [Screenshot](screenshots/ios-search-bar-react-desktop-light.png) | [Screenshot](screenshots/ios-search-bar-angular-desktop-light.png) |
| Desktop, dark | [Screenshot](screenshots/ios-search-bar-react-desktop-dark.png) | [Screenshot](screenshots/ios-search-bar-angular-desktop-dark.png) |
| Mobile, light | [Screenshot](screenshots/ios-search-bar-react-mobile-light.png) | [Screenshot](screenshots/ios-search-bar-angular-mobile-light.png) |
| Mobile, dark | [Screenshot](screenshots/ios-search-bar-react-mobile-dark.png) | [Screenshot](screenshots/ios-search-bar-angular-mobile-dark.png) |

Reproduction (Node 22.22.3+ within Node 22, or another supported Node version):

```sh
npm run component:sync
npm run angular:sync
npm run lint
npm test -- --maxWorkers=2
npm run build
npm run test:ios-search
npm run test:angular-package
npx playwright test --config playwright.ios-search.config.ts
npm run test:browser -- e2e/angular-catalog.spec.ts e2e/framework-tabs.spec.ts
```

Set `PLAYWRIGHT_CHANNEL=msedge` to use installed Microsoft Edge on Windows. Browser fixtures import the built Angular package; rebuild it before running tests after source changes. The suite checks desktop/mobile controlled-state consumers, optional defaults, native form/Escape behavior, callbacks, clear/refocus, autofocus, parent updates, responsive widths, both themes, settled painted geometry, interrupted motion, reduced motion and disposal. Spring trajectory comparisons allow 18px for scheduling differences at intermediate samples; settled widths allow less than 0.5px. Invisible zero-width borders/shadows are normalized when comparing painted geometry. Screenshots are written to Playwright's ignored test results directory.

Physical-device, Firefox, Safari, assistive-technology and SSR verification remain outside this baseline. Final user QA of the full catalog is still outstanding.
