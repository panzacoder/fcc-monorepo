# CLAUDE.md

FCC: Cross-platform healthcare app (React Native + Next.js). Caregivers, patients, families manage appointments, records, communications.

## ENFORCED PATTERNS

### File Organization

- **FEATURE-BASED**: Organize by feature, not screen
- **ATOMIC DESIGN**: UI components follow atomic principles
- **PLATFORM FILES**: Use `.web.tsx` / `.native.tsx` / `.tsx` extensions
- **IMPORTS**: Always `import Component from "app/ui/component"`

### Code Standards

- **NativeWind** for all styling (universal TailwindCSS)
- **TypeScript strict mode** required
- **Redux feature-based reducers** in `packages/app/redux/`
- **React Hook Form + Zod** for forms
- **No comments** unless explicitly requested
- **Format before commit**: Run `npx prettier --write <files>` on changed files before committing

### Branch Naming

`${category}/${issue}-${description}`

- feature/ - New features
- bugfix/ - Bug fixes
- chore/ - Documentation, formatting, tests
- hotfix/ - Emergency fixes

### PR Process

- **Roadmap updates**: PRs that change phase status must update `docs/modernization-roadmap.md` inline
- **Issue linking**: PR descriptions must include `Closes #X` for auto-close on merge
- **Commits**: Squash merge preferred; commit messages should reference issue numbers

## STRUCTURE

### Monorepo

- `apps/expo` - React Native (Expo SDK 50)
- `apps/next` - Next.js 14 web app
- `packages/app` - Shared code

### packages/app/

- `features/` - Feature modules (auth, appointments, circles)
- `ui/` - Cross-platform components
- `provider/` - React context providers
- `redux/` - State management
- `config/` - TailwindCSS theme
- `utils/` - Utilities, API constants

## TECH STACK

- React Native 0.73.6 + Expo SDK 50
- Next.js 14 + TypeScript
- NativeWind v4 + TailwindCSS
- Solito (navigation)
- Redux (legacy createStore)
- Storybook 7

## QUALITY COMMANDS

```bash
yarn format         # Prettier
yarn workspace next-app lint  # ESLint
yarn web:sb:build   # Storybook build
```

## DEPENDENCIES

- **Pure JS**: Install in `packages/app`
- **Native code**: Install in `apps/expo`

## KEY FILES

- `packages/app/config/tailwind.config.js` - Design system
- `packages/app/utils/serverUrls.ts` - 150+ API endpoints
- `packages/app/utils/fetchServerData.ts` - Server communication
- `packages/app/provider/Provider.tsx` - Main app wrapper

## MODERNIZATION ROADMAP

- **Tracking doc**: `docs/modernization-roadmap.md` — read this first for phase status, GH issue links, and current priorities
- **Sensitive exploration**: `.claude/future-exploration.md` (gitignored) + `git stash list` for backup
- Backend team has repo visibility — keep GH issues focused on frontend modernization only

## XCODE 26 BETA WORKAROUNDS

Building with Xcode 26 beta requires manual patches to node_modules (Expo SDK 50 not updated for iOS 26):

1. **expo-localization** (`ios/LocalizationModule.swift:115`): Add `@unknown default: return "unknown"` to calendar switch
2. **expo-device** (`ios/UIDevice.swift:188`): Replace `TARGET_OS_SIMULATOR != 0` with `#if targetEnvironment(simulator)` check
3. **expo-dev-menu** (`ios/DevMenuViewController.swift:63`): Replace `TARGET_IPHONE_SIMULATOR > 0` with `#if targetEnvironment(simulator)` check

These patches are lost on `yarn install`. Re-apply before iOS builds or downgrade to Xcode 16 stable.

## ASSUMPTIONS

- Dev servers assumed running unless stated otherwise
- User handles builds/deploys unless explicitly requested
- Healthcare compliance and security critical
