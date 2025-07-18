# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Family Care Circle (FCC) is a cross-platform healthcare application built as a monorepo using React Native (Expo) and Next.js. The application enables caregivers, patients, and family members to manage appointments, medical records, communications, and care coordination.

## Architecture

### Monorepo Structure
- **apps/expo** - React Native mobile app (iOS/Android) with Expo SDK 50
- **apps/next** - Next.js 14 web application 
- **packages/app** - Shared code package containing features, UI components, and utilities

### Shared Code Organization
The `packages/app` directory follows a feature-based architecture:
- **features/** - Self-contained feature modules (auth, appointments, circles, etc.)
- **ui/** - Cross-platform UI components with atomic design principles
- **provider/** - React context providers and app-wide configurations
- **redux/** - State management with feature-based reducers
- **config/** - TailwindCSS theme and design system configuration
- **utils/** - Utility functions, API constants, and server communication

### Technology Stack
- **React Native 0.73.6** with **Expo SDK 50**
- **Next.js 14** for web
- **TypeScript** for type safety
- **NativeWind v4** for universal styling with TailwindCSS
- **Solito** for cross-platform navigation
- **Redux** for state management
- **React Hook Form + Zod** for form validation
- **Storybook 7** for component documentation

## Common Development Commands

### Development Servers
```bash
# Start mobile development server
yarn native

# Start web development server  
yarn web

# Build web application
yarn web:build

# Run Storybook for component development
yarn web:sb
```

### Native Development
```bash
# Build iOS development client
cd apps/expo && expo run:ios

# Build Android development client  
cd apps/expo && expo run:android
```

### Code Quality
```bash
# Format code with Prettier
yarn format

# Lint code (Next.js ESLint config)
yarn workspace next-app lint

# Build Storybook for visual testing
yarn web:sb:build
```

## Platform-Specific Development

### Cross-Platform Components
Use platform-specific file extensions for components that need different implementations:
- `component.web.tsx` - Web-specific implementation
- `component.native.tsx` - Native-specific implementation  
- `component.tsx` - Shared implementation

Import as: `import Component from "app/ui/component"`

### Styling
- Use **NativeWind** classes for universal styling
- TailwindCSS configuration is shared in `packages/app/config/tailwind.config.js`
- Custom healthcare-focused color palette and typography

## Dependency Management

### Pure JS Dependencies
Install JavaScript-only dependencies in `packages/app`:
```bash
cd packages/app && yarn add package-name
```

### Native Dependencies
Install libraries with native code in `apps/expo`:
```bash
cd apps/expo && yarn add react-native-package
```

## Development Workflow

### Branch Naming
Follow the pattern: `${category}/${issue}-${description}`
- **feature/** - New features or enhancements
- **bugfix/** - Bug fixes
- **chore/** - Documentation, formatting, tests
- **hotfix/** - Emergency fixes

### Code Organization
- Organize by **feature**, not by screen
- Use **atomic design** principles for UI components
- Keep components platform-agnostic when possible
- Follow existing patterns for Redux state management

## Key Files to Understand

### Configuration
- `packages/app/config/tailwind.config.js` - Design system configuration
- `packages/app/utils/serverUrls.ts` - API endpoint definitions (150+ endpoints)
- `packages/app/redux/` - State management with feature-based reducers

### Entry Points
- `apps/expo/index.ts` - Mobile app entry point
- `apps/next/pages/` - Next.js pages and routing
- `packages/app/provider/Provider.tsx` - Main app provider wrapper

## Testing and Quality Assurance

### Visual Testing
- Use Storybook for component development and testing
- Chromatic integration for visual regression testing
- Stories located alongside components

### Code Standards
- ESLint configuration extends Next.js rules
- Prettier for code formatting with Tailwind plugin
- TypeScript strict mode enabled
- Trunk-based development with feature branches

## State Management Patterns

### Redux Structure
- Traditional Redux setup with legacy createStore
- Feature-based reducer organization
- Persistent state with platform-specific storage
- Located in `packages/app/redux/`

### API Integration
- Centralized server communication in `utils/fetchServerData.ts`
- Comprehensive error handling
- RESTful API patterns with extensive endpoint definitions

## Special Considerations

### Healthcare Application
- Strict data privacy and security requirements
- Complex user roles (caregivers, patients, family members)
- Integration with medical devices and appointment systems
- Compliance with healthcare regulations

### Performance
- Turbo for monorepo build optimization
- Code splitting for web performance
- Lazy loading patterns for mobile
- Efficient state management for large datasets