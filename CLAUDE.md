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

### Branch Naming
`${category}/${issue}-${description}`
- feature/ - New features
- bugfix/ - Bug fixes  
- chore/ - Documentation, formatting, tests
- hotfix/ - Emergency fixes

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

## ASSUMPTIONS
- Dev servers assumed running unless stated otherwise
- User handles builds/deploys unless explicitly requested
- Healthcare compliance and security critical