# Phase 3: State Management Remediation — Design

**GH Issue:** [#100](https://github.com/panzacoder/fcc-monorepo/issues/100)
**Branch:** `feature/100-state-management-remediation`
**Date:** 2026-02-19

---

## Problem

58 files import the Redux store singleton directly and call `store.getState()` (~90 times) and `store.dispatch()` (~31 times) inside component bodies. This bypasses React-Redux's subscription model — components read state once at render but never re-render when state changes. Additionally, several screens use module-level `let` variables that persist across component remounts, causing stale state bugs.

## Scope

Strict GH #100 scope:

- **3A:** `store.getState()` → `useAppSelector` (or parameter passing for non-components)
- **3B:** `store.dispatch()` → `useAppDispatch` (or parameter passing for non-components)
- **3C:** Module-level `let` → `useState` / `useRef`

### Out of Scope

- Reducer copy-paste bugs (wrong state keys) — deferred to Phase 8C
- Directory/file typos (`curenMemberAddress`, `subcription`) — deferred to Phase 8C
- Persistence debouncing — file as new GH issue

## Approach

File-by-file refactoring, single PR. Each file gets all three fixes in one pass.

## Transformation Patterns

### Pattern A — Component `getState` → hook

```tsx
// Before
import store from 'app/redux/store'
function MyScreen() {
  const header = store.getState().headerState.header
}

// After
import { useAppSelector } from 'app/redux/hooks'
function MyScreen() {
  const header = useAppSelector((state) => state.headerState.header)
}
```

### Pattern B — Component `dispatch` → hook

```tsx
// Before
store.dispatch(headerAction.setHeader(data))

// After
const dispatch = useAppDispatch()
dispatch(headerAction.setHeader(data))
```

### Pattern C — Utility function (non-component) → parameter passing

```tsx
// Before
import store from 'app/redux/store'
export function getAuthHeader() {
  return store.getState().headerState.header
}

// After
export function getAuthHeader(header: HeaderState) {
  return header
}
```

### Pattern D — Utility only called from components → custom hook

```tsx
// Before
export function fetchData() {
  const header = store.getState().headerState.header
  return apiCall(header)
}

// After
export function useFetchData() {
  const header = useAppSelector((state) => state.headerState.header)
  return useCallback(() => apiCall(header), [header])
}
```

### Pattern E — Module-level `let` → useState/useRef

```tsx
// Before
let currentPage = 0
let dataList = []
function MyScreen() {
  currentPage = 1
}

// After
function MyScreen() {
  const [currentPage, setCurrentPage] = useState(0)
  const dataListRef = useRef([])
}
```

## Decision: Hooks vs Parameters for Non-Component Code

- **Utility is only called from components** → convert to custom hook (Pattern D)
- **Utility is framework-agnostic or called from non-component contexts** → parameter passing (Pattern C)
- **Store access in callbacks/async flows inside components** → capture hook values in component body, close over them in the callback

## Safety Net

- Phase 2 CI pipeline runs lint, typecheck, format, and build on every push
- ESLint `no-restricted-imports` already warns on `import store from 'app/redux/store'`
- Tighten that rule to `error` as the final commit in the PR

## Risks

- **More re-renders:** Moving from snapshot reads to reactive subscriptions means components will re-render on state changes. This is correct behavior but could surface hidden bugs (infinite loops if dispatching during render).
- **Callback closures:** `store.getState()` in async callbacks always reads fresh state. Replacing with a closed-over hook value reads the value at closure time. For cases needing fresh reads, use a ref or pass state at call time.

## Deliverables

1. Single PR on `feature/100-state-management-remediation`
2. All `store.getState()` and `store.dispatch()` removed from component files
3. All module-level `let` moved into component state
4. ESLint `no-restricted-imports` for store upgraded to `error`
5. New GH issue filed for persistence debouncing
