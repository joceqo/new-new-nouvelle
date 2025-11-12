# Design System Documentation Plan

## Overview

This plan outlines the systematic documentation of our design system components using `.spec.md` files alongside each component. We'll follow a dependency-first approach, starting with foundational components and working up to complex compositions.

## Documentation Convention

### File Structure

```
ComponentName/
├── ComponentName.tsx
├── ComponentName.spec.md
├── ComponentName.stories.tsx (if exists)
└── ComponentName.test.tsx (if exists)
```

### Spec Template Format

Each `.spec.md` follows this structure:

```md
# Component: ComponentName

Status: draft|stable|deprecated
Intent: Brief description of component purpose

## Props Contract

## Behavior Rules

## Visual & Styling

## Accessibility

## Dependencies

## Edge Cases

## Usage Examples

## Performance Notes

## Future Improvements
```

---

## Phase 1: Foundation Components (Typography & Primitives)

### 1.1 Typography Components ⭐ START HERE

- [ ] `Text.tsx` → `Text.spec.md`
- [ ] `Heading.tsx` → `Heading.spec.md`

**Priority**: These are Radix wrappers, simple to document, used everywhere

### 1.2 Core Utilities

- [ ] `IconWrapper.tsx` → `IconWrapper.spec.md`
- [ ] `ThemeProvider.tsx` → `ThemeProvider.spec.md`

---

## Phase 2: Shadcn/UI Base Components

### 2.1 Interactive Primitives

- [ ] `Button.tsx` → `Button.spec.md`
- [ ] `Input.tsx` → `Input.spec.md`
- [ ] `Label.tsx` → `Label.spec.md`

### 2.2 Feedback Components

- [ ] `Badge.tsx` → `Badge.spec.md`
- [ ] `Avatar.tsx` → `Avatar.spec.md`
- [ ] `Alert.tsx` → `Alert.spec.md`

### 2.3 Layout Components

- [ ] `Card.tsx` → `Card.spec.md`
- [ ] `Sheet.tsx` → `Sheet.spec.md`
- [ ] `Resizable.tsx` → `Resizable.spec.md`

### 2.4 Overlay Components

- [ ] `Dialog.tsx` → `Dialog.spec.md`
- [ ] `DropdownMenu.tsx` → `DropdownMenu.spec.md`
- [ ] `Command.tsx` → `Command.spec.md`
- [ ] `Select.tsx` → `Select.spec.md`

### 2.5 Specialized Inputs

- [ ] `InputOTP.tsx` → `InputOTP.spec.md`

---

## Phase 3: Composite Application Components

### 3.1 Workspace Components

- [ ] `WorkspaceIcon.tsx` → `WorkspaceIcon.spec.md`
- [ ] `WorkspaceHeader.tsx` → `WorkspaceHeader.spec.md`
- [ ] `WorkspaceSwitcher.tsx` → `WorkspaceSwitcher.spec.md`
- [ ] `AccountInfo.tsx` → `AccountInfo.spec.md`
- [ ] `Preferences.tsx` → `Preferences.spec.md`

### 3.2 Dialog Components

- [ ] `SettingsDialog.tsx` → `SettingsDialog.spec.md`
- [ ] `CreateWorkspaceDialog.tsx` → `CreateWorkspaceDialog.spec.md`
- [ ] `InviteMembersDialog.tsx` → `InviteMembersDialog.spec.md`
- [ ] `WorkspaceSettingsDialog.tsx` → `WorkspaceSettingsDialog.spec.md`

### 3.3 Navigation Components

- [ ] `PageTreeItem.tsx` → `PageTreeItem.spec.md` ⭐ (Already discussed)
- [ ] `PageTree.tsx` → `PageTree.spec.md`
- [ ] `SidebarItem.tsx` → `SidebarItem.spec.md`
- [ ] `InlineInbox.tsx` → `InlineInbox.spec.md`
- [ ] `Sidebar.tsx` → `Sidebar.spec.md`

### 3.4 Page Components

- [ ] `Home.tsx` → `Home.spec.md`

---

## Phase 4: Quality & Maintenance

### 4.1 Validation Scripts

- [ ] Create `scripts/validate-specs.js` to ensure every `.tsx` has a `.spec.md`
- [ ] Add pre-commit hook to check spec files are updated
- [ ] Create `scripts/generate-spec-template.js` for new components

### 4.2 Documentation Site

- [ ] Generate component gallery from spec files
- [ ] Create dependency graph visualization
- [ ] Add search functionality for specs

---

## Implementation Strategy

### Week 1: Foundation (Typography + IconWrapper)

```bash
# Start with simple components
packages/ui/src/components/design_system/Typography/
├── Text.spec.md
├── Heading.spec.md
packages/ui/src/components/IconWrapper/
├── IconWrapper.spec.md
```

### Week 2: Core Shadcn Components (Button, Input, Card, Dialog, DropdownMenu)

Focus on most-used components that others depend on.

### Week 3: Application Components (Workspace, Navigation)

Document the complex, business-logic components.

### Week 4: Tooling & Maintenance

Build validation scripts and documentation generation.

---

## Success Criteria

### Per Component

- [ ] Spec file exists and follows template
- [ ] Props interface is documented and matches code
- [ ] All dependencies are listed
- [ ] Edge cases are identified
- [ ] Usage example is provided
- [ ] Accessibility concerns are noted

### Overall System

- [ ] 100% component coverage
- [ ] Dependency graph is clear and acyclic
- [ ] Breaking changes process is defined
- [ ] New component checklist includes spec creation
- [ ] Team adoption >80%

---

## Next Steps

1. **Start with Text.tsx** (simplest component)
2. **Create first spec template**
3. **Document IconWrapper** (widely used utility)
4. **Iterate on template** based on learnings
5. **Scale to remaining components**

Would you like me to begin with creating the `Text.spec.md` file?
