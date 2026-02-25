# Storybook Migration Research

**Issue:** #126  
**Current Version:** 7.6.17  
**Target Version:** 10.x  
**Date:** 2026-02-25

## Summary

**Recommended path: 7 → 8 → 9 → 10** (stepping stones, not direct jump)

Each major version has breaking changes. Storybook provides migration guides and codemods for each step.

---

## Current State

FCC uses Storybook 7.6.17 in `apps/next/` with:

- `@storybook/nextjs` (framework)
- `@storybook/addon-essentials`
- `@storybook/addon-react-native-web` (for cross-platform stories)

---

## Migration Path

### Step 1: 7.x → 8.x

**Breaking changes:**

- Dropped support for Node 16
- Config files must use ESM or explicit `.cjs` extension
- Some addon APIs changed

**Migration:**

```bash
npx storybook@8 upgrade
```

**Effort:** Low (mostly automated)

### Step 2: 8.x → 9.x

**Breaking changes:**

- Tags-based story organization (new feature, not breaking)
- Some internal API changes
- React Native: `withStorybook` API simplified

**Migration:**

```bash
npx storybook@9 upgrade
```

**Effort:** Low-Medium

### Step 3: 9.x → 10.x

**Breaking changes (significant for React Native):**

1. `withStorybook` is now a **named export** (not default)
2. `withStorybookConfig` removed — use `withStorybook` directly
3. `onDisabledRemoveStorybook` option removed (now automatic)
4. Config files **require ESM syntax**

**Metro config changes:**

```js
// Before (v7-9)
const withStorybook = require('@storybook/react-native/metro/withStorybook')
module.exports = withStorybook(config, {
  enabled: true,
  onDisabledRemoveStorybook: true
})

// After (v10)
const { withStorybook } = require('@storybook/react-native/metro/withStorybook')
module.exports = withStorybook(config, { enabled: true })
```

**App.tsx simplification:**

- Can now safely `import Storybook from './.rnstorybook'` at top level
- Metro automatically stubs it out when `enabled: false`

**Effort:** Medium (metro config rewrite, ESM migration)

---

## Effort Estimate

| Step      | Effort         | Risk   | Notes                     |
| --------- | -------------- | ------ | ------------------------- |
| 7 → 8     | 2-4 hours      | Low    | Mostly automated          |
| 8 → 9     | 2-4 hours      | Low    | Minor API changes         |
| 9 → 10    | 4-8 hours      | Medium | Metro config rewrite, ESM |
| **Total** | **8-16 hours** |        |                           |

---

## Recommendations

1. **Do NOT skip versions** — each upgrade includes codemods that won't work if you jump multiple versions

2. **Wait for Expo SDK upgrade first** — Storybook RN compatibility depends on React Native version. Do this after #105 (Expo SDK 52+)

3. **Test each step** — Run full Storybook build after each major version upgrade before proceeding

4. **Consider web-only first** — `apps/next/` Storybook (web) can upgrade independently of React Native Storybook

---

## Dependencies

- Blocked by: #105 (Expo SDK upgrade) — for React Native Storybook
- Independent: Web Storybook in `apps/next/` could upgrade sooner

---

## Resources

- [Storybook 10 Migration Guide](https://storybook.js.org/docs/releases/migration-guide)
- [React Native Storybook Migration](https://github.com/storybookjs/react-native/blob/next/MIGRATION.md)
- [7 → 8 Guide](https://storybook.js.org/docs/migration-guide/from-older-version)
