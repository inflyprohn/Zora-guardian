---
name: web-accessibility
description: Audit and improve web UI accessibility, responsive behavior, semantic HTML, keyboard use, forms, focus, motion, and interface consistency.
---

# Web Accessibility and Interface Audit

Use when asked to review UI, UX, accessibility, or responsive behavior.

## Audit
- Semantic landmarks, heading order, button/link semantics, and accessible names.
- Keyboard-only navigation, logical tab order, visible focus, no keyboard traps.
- Form labels, instructions, validation, and error announcements.
- Contrast, text resizing, zoom, touch target sizing, and responsive overflow.
- Images: meaningful alt text or empty alt for decorative images.
- Dialogs: focus management, Escape behavior, and return focus.
- Motion: respect prefers-reduced-motion; avoid flashing content.
- Status changes: expose dynamic updates to assistive technology.
- Layout and controls at narrow viewport widths.

## Output
Report findings by severity (critical, high, medium, low), with file and line when available, user impact, and a concrete fix. Distinguish verified defects from recommendations.

## Reference
Use the Vercel web-interface-guidelines project as an additional checklist when relevant:
https://github.com/vercel-labs/web-interface-guidelines
Do not download or execute third-party scripts as part of an audit.
