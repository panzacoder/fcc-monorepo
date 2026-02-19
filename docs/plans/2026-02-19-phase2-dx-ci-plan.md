# Phase 2: Developer Experience & CI Foundation — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Establish CI, linting, type-checking, and cross-platform state loading infrastructure that makes all subsequent modernization work safer and faster.

**Architecture:** Turbo pipelines fan lint/typecheck across workspaces. GitHub Actions CI runs turbo commands on PRs and pushes to main. StateLoader splits into platform variants with async interface.

**Tech Stack:** GitHub Actions, Turborepo, ESLint 8, TypeScript 5.4, AsyncStorage, Yarn 4

---

### Task 1: Update turbo.json with lint and typecheck pipelines

**Files:**
- Modify: `turbo.json`

**Step 1: Replace turbo.json content**

```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**"]
    },
    "lint": {},
    "typecheck": {}
  }
}
```

No `dependsOn` or `outputs` for lint/typecheck — they run independently per workspace.

**Step 2: Commit**

```bash
git add turbo.json
git commit -m "chore: add lint and typecheck turbo pipelines"
```

---

### Task 2: Add lint and typecheck scripts to each workspace

**Files:**
- Modify: `apps/next/package.json`
- Modify: `apps/expo/package.json`
- Modify: `packages/app/package.json`

**Step 1: Add typecheck script to apps/next/package.json**

Add to the `scripts` object:

```json
"typecheck": "tsc --noEmit"
```

(`lint` already exists as `"next lint"`)

**Step 2: Add lint and typecheck scripts to apps/expo/package.json**

Add to the `scripts` object:

```json
"lint": "eslint .",
"typecheck": "tsc --noEmit"
```

Also add `noEmit: true` to `apps/expo/tsconfig.json`:

```json
{
  "extends": "../../tsconfig",
  "compilerOptions": {
    "noEmit": true
  }
}
```

**Step 3: Add lint and typecheck scripts to packages/app/package.json**

Add to the `scripts` object:

```json
"lint": "eslint .",
"typecheck": "tsc --noEmit"
```

Also add `noEmit: true` to `packages/app/tsconfig.json` compilerOptions (it currently lacks it).

**Step 4: Commit**

```bash
git add apps/next/package.json apps/expo/package.json apps/expo/tsconfig.json packages/app/package.json packages/app/tsconfig.json
git commit -m "chore: add lint and typecheck scripts to all workspaces"
```

---

### Task 3: Expand ESLint with new rules and per-workspace configs

**Files:**
- Modify: `.eslintrc.js` (root)
- Create: `apps/expo/.eslintrc.js`
- Create: `packages/app/.eslintrc.js`
- Modify: `package.json` (root — add devDependencies)

**Step 1: Install TypeScript ESLint dependencies**

```bash
yarn add -D @typescript-eslint/eslint-plugin @typescript-eslint/parser
```

**Step 2: Update root .eslintrc.js**

```javascript
module.exports = {
  extends: 'next',
  settings: {
    next: {
      rootDir: 'apps/next/'
    }
  },
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    'no-console': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    'no-restricted-imports': [
      'warn',
      {
        paths: [
          {
            name: 'app/redux/store',
            message: 'Use useAppSelector/useAppDispatch hooks from app/redux/hooks instead of importing store directly.'
          }
        ]
      }
    ]
  }
}
```

**Step 3: Create apps/expo/.eslintrc.js**

```javascript
module.exports = {
  extends: ['../../.eslintrc.js'],
  settings: {
    next: undefined
  },
  env: {
    'react-native/react-native': true
  },
  ignorePatterns: ['ios/', 'android/', '.expo/']
}
```

Note: We override the `next` settings since the expo app is not a Next.js app. The `ignorePatterns` avoid linting generated native code.

**Step 4: Create packages/app/.eslintrc.js**

```javascript
module.exports = {
  extends: ['../../.eslintrc.js'],
  settings: {
    next: undefined
  }
}
```

**Step 5: Verify lint runs without errors (warnings are expected)**

```bash
yarn turbo run lint
```

Expected: Completes with warnings (no-console, no-explicit-any). Should NOT error out.

**Step 6: Commit**

```bash
git add .eslintrc.js apps/expo/.eslintrc.js packages/app/.eslintrc.js package.json yarn.lock
git commit -m "chore: expand ESLint with no-console, no-explicit-any, no-restricted-imports"
```

---

### Task 4: Split StateLoader into platform variants

**Files:**
- Modify: `packages/app/redux/stateLoader.ts` → becomes shared interface
- Create: `packages/app/redux/stateLoader.web.ts`
- Create: `packages/app/redux/stateLoader.native.ts`
- Modify: `packages/app/redux/store.ts`
- Modify: `packages/app/provider/redux/index.tsx`

**Step 1: Create stateLoader.web.ts**

```typescript
const STORE_NAME = '_appdata_store'

export class StateLoader {
  async loadState() {
    try {
      const serializedState = localStorage.getItem(STORE_NAME)
      if (serializedState === null) {
        return this.initializeState()
      }
      return JSON.parse(serializedState)
    } catch (err) {
      return this.initializeState()
    }
  }

  async saveState(state: Record<string, unknown>) {
    try {
      const serializedState = JSON.stringify(state)
      localStorage.setItem(STORE_NAME, serializedState)
    } catch (err) {
      // Silently fail — localStorage may be full or unavailable
    }
  }

  initializeState() {
    return {}
  }
}

export default StateLoader
```

**Step 2: Create stateLoader.native.ts**

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage'

const STORE_NAME = '_appdata_store'

export class StateLoader {
  async loadState() {
    try {
      const serializedState = await AsyncStorage.getItem(STORE_NAME)
      if (serializedState === null) {
        return this.initializeState()
      }
      return JSON.parse(serializedState)
    } catch (err) {
      return this.initializeState()
    }
  }

  async saveState(state: Record<string, unknown>) {
    try {
      const serializedState = JSON.stringify(state)
      await AsyncStorage.setItem(STORE_NAME, serializedState)
    } catch (err) {
      // Silently fail — AsyncStorage may be unavailable
    }
  }

  initializeState() {
    return {}
  }
}

export default StateLoader
```

**Step 3: Replace stateLoader.ts with the shared interface re-export**

Delete the existing content of `stateLoader.ts` and replace with:

```typescript
export { StateLoader, default } from './stateLoader'
```

Wait — this creates a circular import. The platform resolution (`.web.ts`/`.native.ts`) is handled by the bundler (Metro/webpack). The base `stateLoader.ts` acts as the default fallback. Since both platform files export the same class shape, consumers just `import StateLoader from './stateLoader'` and the bundler picks the right file.

So the correct approach: **delete `stateLoader.ts`** and let the bundler resolve `.web.ts` or `.native.ts` automatically.

**Step 4: Update store.ts to use async initialization**

```typescript
import { legacy_createStore as createStore, Store } from 'redux'
import rootReducer from './rootReducer'
import StateLoader from './stateLoader'
import { composeWithDevTools } from 'redux-devtools-extension'

const stateLoader = new StateLoader()

let store: Store

export async function initializeStore() {
  const preloadedState = await stateLoader.loadState()
  store = createStore(rootReducer, preloadedState, composeWithDevTools())
  store.subscribe(() => {
    stateLoader.saveState(store.getState())
  })
  return store
}

export function getStore() {
  if (!store) {
    throw new Error('Store not initialized. Call initializeStore() first.')
  }
  return store
}

export default { initializeStore, getStore }

export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = Store['dispatch']
```

**Step 5: Update provider/redux/index.tsx to handle async store init**

```tsx
import React, { useEffect, useState } from 'react'
import { Provider } from 'react-redux'
import { initializeStore, getStore } from 'app/redux/store'
import type { Store } from 'redux'

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  const [store, setStore] = useState<Store | null>(null)

  useEffect(() => {
    initializeStore().then((initializedStore) => {
      setStore(initializedStore)
    })
  }, [])

  if (!store) {
    return null
  }

  return <Provider store={store}>{children}</Provider>
}
```

**Step 6: Verify typecheck passes**

```bash
yarn turbo run typecheck
```

**Step 7: Commit**

```bash
git add packages/app/redux/stateLoader.ts packages/app/redux/stateLoader.web.ts packages/app/redux/stateLoader.native.ts packages/app/redux/store.ts packages/app/provider/redux/index.tsx
git commit -m "fix: split StateLoader into platform variants with async interface"
```

---

### Task 5: Create GitHub Actions CI workflow

**Files:**
- Create: `.github/workflows/ci.yml`

**Step 1: Create the workflow file**

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint:
    name: Lint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: yarn
      - run: yarn install --immutable
      - run: yarn turbo run lint

  typecheck:
    name: Type Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: yarn
      - run: yarn install --immutable
      - run: yarn turbo run typecheck

  format:
    name: Format Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: yarn
      - run: yarn install --immutable
      - run: prettier --check .

  build:
    name: Build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: yarn
      - run: yarn install --immutable
      - run: yarn turbo run build

  build-storybook:
    name: Build Storybook
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: yarn
      - run: yarn install --immutable
      - run: yarn web:sb:build
```

**Step 2: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "ci: add GitHub Actions CI pipeline with lint, typecheck, format, build"
```

---

### Task 6: Verify everything works locally

**Step 1: Run full turbo pipeline**

```bash
yarn turbo run lint typecheck build
```

Expected: All pass (lint may show warnings, no errors).

**Step 2: Run format check**

```bash
yarn format
prettier --check .
```

Expected: Passes after formatting.

**Step 3: Run storybook build**

```bash
yarn web:sb:build
```

Expected: Builds successfully.

**Step 4: Final commit if any fixups needed, then verify clean status**

```bash
git status
```

Expected: Clean working tree.
