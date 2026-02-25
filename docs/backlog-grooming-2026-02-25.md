# Backlog Grooming — 2026-02-25

## Summary

Phase 8 is **too large** — it's actually 8 separate projects bundled together. Some can run in parallel, some have dependencies, and some need research before execution.

---

## Phase 8 Breakdown

| Issue | Title                        | Effort                         | Can Parallelize? | Research Needed?            |
| ----- | ---------------------------- | ------------------------------ | ---------------- | --------------------------- |
| #105  | Expo SDK 50 → 55             | **XL** (5 sequential upgrades) | ❌ Blocks 8H     | ✅ RN 0.76+ New Arch compat |
| #106  | Next.js 14 → 16              | M                              | ✅ Independent   | ❌                          |
| #107  | Redux → Zustand              | L-M (10 slices)                | ✅ Independent   | ❌                          |
| #108  | Navigation Strategy (Solito) | Research                       | ✅ Independent   | ✅ Critical                 |
| #109  | Replace moment + lodash      | S-M                            | ✅ Independent   | ❌                          |
| #110  | Storybook 7 → 10             | M                              | ✅ Independent   | ✅ Breaking changes         |
| #111  | NativeWind → Uniwind         | M                              | ❌ Needs 8A      | ✅ Uniwind compat           |

### Recommendation: Split into Independent Branches

**Immediate (no dependencies, low risk):**

- #106 Next.js 14 → 16 (web-only, marketing site)
- #109 Replace moment + lodash (focused refactor)
- #107 Redux → Zustand (can migrate slice-by-slice)

**Research First:**

- #108 Navigation Strategy — needs a decision doc before code
- #110 Storybook — needs migration path research (7→8→9→10 or direct?)
- #111 NativeWind → Uniwind — verify Uniwind supports current Expo SDK

**Sequential (must be done in order):**

- #105 Expo SDK upgrades — 5 PRs, each one its own branch
- #111 depends on #105 being at least partially done

---

## Gaps Identified

### 1. E2E Testing Infrastructure (HIGH PRIORITY)

No Maestro or Detox setup exists. Before Phase 9 (Web Buildout), we need:

- [ ] Install Maestro CLI
- [ ] Create `maestro/` directory with flow definitions
- [ ] Basic smoke test: login → home → view appointment
- [ ] CI integration for E2E tests

**Suggested new issue:** `[Phase 8.5] E2E Testing Infrastructure (Maestro)`

### 2. New Architecture Compatibility Research (#105)

SDK 52+ makes New Architecture default, SDK 55 drops Legacy. Need to:

- [ ] Audit native dependencies for New Arch support
- [ ] Test `@react-native-firebase` compatibility
- [ ] Test NativeWind/Storybook with New Arch
- [ ] Document any blockers

**Suggested:** Add research task to #105 or create separate spike issue

### 3. API Type Validation (#121) — Timing

Issue #121 (validate data types against real API) is marked as "do incrementally." Should be:

- Prioritized for high-traffic modules (auth, appointments, profile)
- Done alongside Phase 7 decomposition (already touching those files)

### 4. Performance Debouncing (#117)

Small but should be done. Could be bundled with #107 (Zustand migration) since we're touching the store anyway.

---

## Issues That Need Breakdown

### #105 Expo SDK 50 → 55

Should be **5 separate issues/PRs**, one per SDK version:

- #105a: SDK 50 → 51
- #105b: SDK 51 → 52 (New Arch default — major milestone)
- #105c: SDK 52 → 53
- #105d: SDK 53 → 54
- #105e: SDK 54 → 55 (Legacy dropped)

### #110 Storybook 7 → 10

Needs research spike first:

- What's the recommended upgrade path?
- Are there codemods?
- What broke between versions?

---

## Suggested Priority Order

1. **Now (parallel with Phase 7):**

   - #109 moment + lodash removal (low risk, reduces bundle)
   - #108 Navigation research (decision needed before Phase 9)

2. **After Phase 7:**

   - #107 Redux → Zustand (benefits from decomposed screens)
   - #106 Next.js 14 → 16 (web-only)

3. **Sequential:**

   - #105a-e Expo SDK upgrades (one at a time)

4. **After Expo upgrades:**

   - #111 NativeWind → Uniwind
   - #110 Storybook upgrade

5. **After all Phase 8:**
   - #112 Phase 9 Web Buildout

---

## New Issues to Create

1. **[Phase 8.5] E2E Testing Infrastructure (Maestro)**

   - Install Maestro CLI
   - Create basic smoke test flows
   - Set up Maestro MCP for AI-assisted testing
   - CI integration

2. **[Research] New Architecture Compatibility Audit**

   - Audit all native deps
   - Test Firebase, NativeWind, calendar picker, etc.
   - Document blockers for SDK 52+

3. **[Research] Storybook 10 Migration Path**
   - Evaluate 7→8→9→10 vs direct upgrade
   - Check codemod availability
   - Document breaking changes

---

## Maestro Setup — ✅ DONE

**Installed:** 2026-02-25

- Maestro CLI 2.2.0
- Java 17 (openjdk@17 via Homebrew)
- Paths added to `~/.zshrc`

**Created:**

- `maestro/README.md` — docs
- `maestro/config.yaml` — app ID, timeouts
- `maestro/flows/auth/login.yaml` — login flow
- `maestro/flows/smoke/happy-path.yaml` — login → appointments → back
- `maestro/shared/login.yaml` — reusable login sub-flow

**To run:**

```bash
# With test password
maestro test -e TEST_PASSWORD=xxx flows/auth/login.yaml

# Smoke test
maestro test -e TEST_PASSWORD=xxx flows/smoke/happy-path.yaml
```

**Next:** Add testIDs to components for more reliable selectors.
