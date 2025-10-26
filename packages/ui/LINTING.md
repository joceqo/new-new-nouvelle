# ESLint Configuration

This package uses ESLint with the **Tailwind CSS plugin (v4 beta)** to maintain code quality and enforce Tailwind CSS best practices.

> **⚠️ Note:** We're using `eslint-plugin-tailwindcss@4.0.0-beta.0` which has **partial Tailwind v4 support**. Some rules may have false positives or miss certain issues. This is expected behavior for the beta version.

## Installation

Install dependencies:

```bash
npm install
# or
pnpm install
```

## Usage

### Run Linting

Check for issues:

```bash
npm run lint
```

### Auto-fix Issues

Automatically fix fixable issues:

```bash
npm run lint:fix
```

This will:
- ✅ Enforce consistent class ordering (works well)
- ✅ Convert `flex-shrink-0` to `shrink-0` (shorthand enforcement)
- ⚠️ Some Tailwind v4 syntax like `text-(--var)` may not be fully recognized yet
- ⚠️ `no-contradicting-classname` and `no-custom-classname` are disabled to avoid false positives

## What Works & What Doesn't (Beta Limitations)

### ✅ Working Well:
- Class ordering enforcement
- Shorthand class suggestions
- Basic Tailwind CSS validation
- Integration with `cn()`, `clsx()`, `classnames()` utilities

### ⚠️ Limited Support:
- Tailwind v4's new `(--var)` syntax may show warnings
- Some custom CSS variable classes might be flagged incorrectly
- Config-based validation is disabled (Tailwind v4 uses CSS config)

### ❌ Disabled Rules:
- `no-contradicting-classname` - Too many false positives in v4
- `no-custom-classname` - Would flag valid v4 syntax

## VS Code Integration

If you're using VS Code, ESLint is configured to auto-fix on save:

1. Make sure you have the ESLint extension installed
2. Open this workspace folder
3. Save any file - ESLint will automatically fix issues

Settings are in `.vscode/settings.json`:

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

## Rules

### Tailwind CSS Rules

- **`tailwindcss/classnames-order`** (warn): Enforce consistent class ordering
- **`tailwindcss/enforces-shorthand`** (warn): Use shorthand classes (e.g., `shrink-0` instead of `flex-shrink-0`)
- **`tailwindcss/no-unnecessary-arbitrary-value`** (warn): Suggest canonical classes instead of arbitrary values
- **`tailwindcss/no-contradicting-classname`** (error): Prevent contradicting classes

### Configuration

The ESLint config recognizes:
- `cn()` utility function (from `tailwind-merge`)
- `clsx()` and `classnames()` functions
- Tailwind CSS v4 syntax

## Files

- `eslint.config.js` - ESLint flat config (ESLint 9+)
- `.eslintignore` - Files to ignore
- `.vscode/settings.json` - VS Code integration

## Ignored Patterns

The following are ignored by ESLint:
- `node_modules/`
- `dist/` and `build/`
- `.storybook/` and `storybook-static/`
- Config files (`*.config.js`, `*.config.ts`)

## CI/CD

Add linting to your CI pipeline:

```yaml
- name: Lint
  run: npm run lint
```

Or make it a pre-commit hook with tools like Husky.

## Troubleshooting

### ESLint not working in VS Code

1. Check if the ESLint extension is installed
2. Reload VS Code window (Cmd/Ctrl + Shift + P → "Reload Window")
3. Check the Output panel (View → Output → ESLint)

### Conflicts with Prettier

This config is designed to work alongside Prettier. ESLint handles code quality, Prettier handles formatting.
