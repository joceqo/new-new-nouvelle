# Nouvelle: Ecosystem-First Roadmap

## 🎯 Philosophy

Build all the features **around** the editor first. This lets you:

- Test your multi-tenant architecture at scale
- Get real user feedback before the hardest feature (editor)
- Build a mature, collaborative ecosystem that makes the eventual editor more powerful
- Launch and onboard users much earlier

---

## ✅ Phase 1: Foundation (COMPLETED)

### Authentication & Multi-tenancy

- ✅ Magic link auth with OTP
- ✅ User management
- ✅ Workspace creation and switching
- ✅ Workspace members and roles
- ✅ Workspace invitations
- ✅ Session management

### Page System (JUST COMPLETED)

- ✅ Hierarchical pages with unlimited nesting
- ✅ Page CRUD operations
- ✅ Page metadata (favorites, archived, pinned)
- ✅ Recently opened tracking
- ✅ Visibility controls (private/workspace/public)
- ✅ PageTree UI component
- ✅ PageView route and component

---

## 🚧 Phase 2: Navigation & Discovery

### Priority: HIGH | Est: 1-2 weeks

### 2.1 Search System

**What**: Full-text search across pages
**Why**: Users need to find content quickly
**Implementation**:

- Convex full-text search index on page titles
- Search results with highlighting
- Search within workspace vs. all accessible pages
- Recent searches tracking

**Files to create**:

```
packages/convex/convex/search.ts (queries)
packages/ui/src/components/Search/SearchBar.tsx
packages/ui/src/components/Search/SearchResults.tsx
packages/router/src/lib/search-context.tsx
```

### 2.2 Command Palette

**What**: `Cmd+K` quick actions and navigation
**Why**: Power users expect keyboard-first workflows
**Implementation**:

- Global keyboard shortcut handler
- Fuzzy search for commands and pages
- Recent pages, favorites shortcuts
- Quick actions (new page, settings, logout)

**Libraries**:

```bash
pnpm add cmdk  # Vercel's command menu component
```

**Files to create**:

```
packages/ui/src/components/CommandPalette/CommandPalette.tsx
packages/ui/src/components/CommandPalette/CommandGroup.tsx
packages/router/src/hooks/useCommandPalette.ts
```

### 2.3 Breadcrumbs & Navigation

**What**: Show page hierarchy, easy ancestor navigation
**Why**: Users need context of where they are
**Implementation**:

- Breadcrumb component showing parent pages
- Click to navigate to any ancestor
- Responsive (collapse on mobile)

**Files to create**:

```
packages/ui/src/components/Breadcrumbs/Breadcrumbs.tsx
packages/convex/convex/pages.ts (add getAncestors query)
```

### 2.4 Sidebar Enhancements

**What**: Favorites section, recent pages, drag & drop
**Why**: Make navigation more intuitive
**Implementation**:

- Dedicated favorites section at top
- Recent pages section (last 5 opened)
- Drag & drop to reorder and move pages
- Collapse/expand sections

**Libraries**:

```bash
pnpm add @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

---

## 🚧 Phase 3: Collaboration Features

### Priority: HIGH | Est: 2-3 weeks

### 3.1 Comments System

**What**: Comment on pages (not blocks, since no editor yet)
**Why**: Essential for team collaboration
**Implementation**:

- Comments table in Convex
- Comment thread UI component
- Real-time comment updates
- Mentions (`@username`)
- Comment reactions (👍, ❤️, etc.)

**Schema**:

```typescript
comments: {
  pageId: Id<"pages">,
  userId: Id<"users">,
  content: string,
  parentCommentId?: Id<"comments">, // for threading
  createdAt: number,
  updatedAt: number,
  isResolved?: boolean,
}
```

**Files to create**:

```
packages/convex/convex/comments.ts
packages/ui/src/components/Comments/CommentThread.tsx
packages/ui/src/components/Comments/CommentInput.tsx
packages/ui/src/components/Comments/Comment.tsx
packages/router/src/lib/comments-context.tsx
```

### 3.2 Activity Feed

**What**: Track and display workspace activity
**Why**: Team awareness and audit trail
**Implementation**:

- Activity events table
- Activity types: page created, edited, commented, shared, etc.
- Activity feed component (sidebar or dedicated page)
- Filter by user, page, action type
- Real-time updates

**Schema**:

```typescript
activities: {
  workspaceId: Id<"workspaces">,
  userId: Id<"users">,
  action: string, // "page.created", "page.edited", "comment.added"
  targetType: string, // "page", "comment", "workspace"
  targetId: string,
  metadata: object, // flexible JSON for action details
  createdAt: number,
}
```

### 3.3 Presence Indicators

**What**: Show who's online and viewing pages
**Why**: Real-time collaboration awareness
**Implementation**:

- Convex presence system (ephemeral data)
- Avatar stack showing active users
- "X is viewing this page" indicator
- Cursor/highlight when multiple users on same page

**Libraries**:

```bash
# Convex has built-in presence support
```

**Files to create**:

```
packages/convex/convex/presence.ts
packages/ui/src/components/Presence/PresenceStack.tsx
packages/ui/src/components/Presence/UserCursor.tsx
```

### 3.4 Notifications System

**What**: In-app and email notifications
**Why**: Keep users informed of activity
**Implementation**:

- Notifications table in Convex
- Notification types: mentions, comments, page updates, invites
- Bell icon with unread count
- Mark as read/unread
- Notification preferences per user

**Schema**:

```typescript
notifications: {
  userId: Id<"users">,
  type: string, // "mention", "comment", "page_shared"
  title: string,
  message: string,
  actionUrl?: string,
  isRead: boolean,
  createdAt: number,
}
```

**Files to create**:

```
packages/convex/convex/notifications.ts
packages/ui/src/components/Notifications/NotificationCenter.tsx
packages/ui/src/components/Notifications/NotificationItem.tsx
packages/router/src/lib/notifications-context.tsx
```

---

## 🚧 Phase 4: Page Management & Utilities

### Priority: MEDIUM | Est: 1-2 weeks

### 4.1 Page Templates

**What**: Predefined page structures
**Why**: Speed up common workflows
**Implementation**:

- Template gallery
- Common templates: meeting notes, project plan, task list, etc.
- Create page from template
- Save custom templates
- Template marketplace (later)

**Schema**:

```typescript
templates: {
  workspaceId?: Id<"workspaces">, // null for global templates
  name: string,
  description: string,
  icon: string,
  category: string,
  isPublic: boolean,
  createdBy: Id<"users">,
  content: object, // Template structure (will have blocks later)
  createdAt: number,
}
```

### 4.2 Trash & Recovery

**What**: Soft-delete pages with recovery
**Why**: Safety net for accidental deletions
**Implementation**:

- Trash view (shows archived pages)
- Restore page from trash
- Permanent delete after 30 days (scheduled function)
- Bulk operations (restore all, delete all)

**Files to update**:

```
packages/convex/convex/pages.ts (add trash queries)
packages/router/src/pages/trash/TrashView.tsx
```

### 4.3 Version History

**What**: Track page changes over time
**Why**: Audit trail and ability to revert
**Implementation**:

- Snapshots table storing page state
- Timeline view of changes
- Compare versions (diff view)
- Restore to previous version
- Automatic snapshots on significant changes

**Schema**:

```typescript
pageVersions: {
  pageId: Id<"pages">,
  title: string,
  content: object, // Page content snapshot
  createdBy: Id<"users">,
  createdAt: number,
  changeDescription?: string,
}
```

### 4.4 Page Duplication & Templates

**What**: Duplicate pages, create templates from pages
**Why**: Reuse page structures
**Implementation**:

- Duplicate page (with or without children)
- Save page as template
- Template variables (e.g., `{{project_name}}`)

---

## 🚧 Phase 5: Sharing & Permissions

### Priority: MEDIUM | Est: 1-2 weeks

### 5.1 Public Sharing

**What**: Share pages publicly via link
**Why**: External collaboration and publishing
**Implementation**:

- Generate public share links
- Share settings (anyone with link, specific domain)
- Password protection
- Expiring links
- Public page view (no sidebar, no auth)

**Schema**:

```typescript
pageShares: {
  pageId: Id<"pages">,
  token: string, // unique share token
  createdBy: Id<"users">,
  expiresAt?: number,
  password?: string, // hashed
  allowComments: boolean,
  allowDuplication: boolean,
  createdAt: number,
}
```

**Routes**:

```
/share/:token (public page view)
```

### 5.2 Granular Permissions

**What**: Per-page access controls
**Why**: Fine-grained security
**Implementation**:

- Permission levels: can view, can comment, can edit, is owner
- Inherit permissions from parent pages
- Share with specific users or workspace roles
- Permission UI in page settings

**Schema**:

```typescript
pagePermissions: {
  pageId: Id<"pages">,
  userId?: Id<"users">,
  role?: string, // workspace role for bulk permissions
  permission: string, // "view", "comment", "edit", "owner"
  grantedBy: Id<"users">,
  createdAt: number,
}
```

---

## 🚧 Phase 6: UX Polish & Performance

### Priority: MEDIUM | Est: 1-2 weeks

### 6.1 Keyboard Shortcuts

**What**: Comprehensive keyboard navigation
**Why**: Power user productivity
**Shortcuts**:

- `Cmd+K`: Command palette
- `Cmd+P`: Quick page search
- `Cmd+N`: New page
- `Cmd+Shift+N`: New page in current context
- `Cmd+E`: Edit page settings
- `Cmd+D`: Duplicate page
- `Cmd+Shift+L`: Toggle sidebar
- `Cmd+B`: Toggle bookmark/favorite
- Arrow keys: Navigate sidebar tree

### 6.2 Loading States & Skeletons

**What**: Smooth loading experience
**Why**: Perceived performance
**Implementation**:

- Skeleton components for pages, sidebar, comments
- Optimistic UI updates
- Loading indicators for slow operations
- Error boundaries with retry

### 6.3 Animations & Transitions

**What**: Polished micro-interactions
**Why**: Professional feel
**Implementation**:

- Page transitions (Framer Motion)
- Sidebar expand/collapse animations
- Dropdown and modal animations
- Drag & drop visual feedback
- Hover states and button presses

**Libraries**:

```bash
pnpm add framer-motion
```

### 6.4 Responsive Design

**What**: Mobile and tablet support
**Why**: Access anywhere
**Implementation**:

- Mobile sidebar (drawer)
- Touch gestures for navigation
- Responsive layouts
- Mobile-optimized page view

---

## 🚧 Phase 7: Advanced Features (Optional Before Editor)

### Priority: LOW | Est: 2-3 weeks

### 7.1 Workspace Settings

- Custom domains
- Branding (logo, colors)
- SSO integration
- Billing and plans
- Usage analytics

### 7.2 Integrations

- Slack notifications
- GitHub/GitLab integration
- Calendar integration (meetings)
- Email to page (create pages via email)
- API access

### 7.3 Workspace Analytics

- Page views and engagement
- User activity metrics
- Popular pages
- Search analytics
- Collaboration metrics

---

## 🎨 Phase 8: Block Editor (FINAL)

### Priority: HIGH | Est: 4-8 weeks

Only after all the above features are mature, implement the block editor:

### 8.1 Block System

- Basic blocks: text, heading, list, quote, code
- Media blocks: image, video, embed
- Database blocks: table, board, calendar
- Advanced blocks: toggle, callout, equation

### 8.2 Editor Features

- Drag & drop blocks
- Slash commands
- Inline formatting
- Block references and linking
- Synced blocks
- AI writing assistant

### 8.3 Real-time Editing

- Operational transforms or CRDT
- Conflict resolution
- Cursor positions
- Selection highlighting

---

## 📊 Suggested Implementation Order

### Immediate Next Steps (Week 1-2)

1. ✅ Complete page system integration (connect Convex to UI)
2. 🔄 Search system
3. 🔄 Command palette

### Short Term (Week 3-6)

4. Comments system
5. Activity feed
6. Notifications

### Medium Term (Week 7-12)

7. Presence indicators
8. Page templates
9. Trash & recovery
10. Public sharing

### Long Term (Week 13+)

11. Version history
12. Granular permissions
13. UX polish
14. **Block Editor**

---

## 🎯 Success Metrics

Before building the editor, you should be able to:

- ✅ Create and organize pages hierarchically
- ✅ Invite team members and manage workspaces
- ✅ Search and find pages instantly
- ✅ Comment and discuss on pages
- ✅ See who's online and active
- ✅ Get notified of important updates
- ✅ Share pages publicly
- ✅ Track activity and changes
- ✅ Use keyboard shortcuts for everything
- ✅ Have a fast, polished, responsive app

With all this in place, your editor will drop into a **mature, battle-tested ecosystem** — not a toy demo app.

---

## 🛠️ Development Tips

1. **Work in vertical slices**: Complete one feature end-to-end (Convex → UI → Integration) before moving on
2. **Test real-time features early**: Convex subscriptions are powerful but need testing
3. **Design for scale**: Think about 1000+ pages, 100+ users per workspace
4. **Build reusable components**: Your UI package should be comprehensive
5. **Document as you go**: Keep this roadmap updated

---

## 📚 Key Libraries You'll Need

```bash
# Already installed
- @tanstack/react-router (routing)
- convex (backend)
- @radix-ui/themes (UI primitives)
- lucide-react (icons)

# To install
pnpm add cmdk           # Command palette
pnpm add @dnd-kit/core  # Drag & drop
pnpm add framer-motion  # Animations
pnpm add fuse.js        # Fuzzy search
pnpm add date-fns       # Date formatting
```

---

Your strategy is excellent. Build the ecosystem first, get users, iterate based on feedback, THEN tackle the editor. This is how you build a real Notion competitor! 🚀
