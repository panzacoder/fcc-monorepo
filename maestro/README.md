# Maestro E2E Tests

End-to-end tests for the Family Care Circle mobile app using [Maestro](https://maestro.mobile.dev).

## Prerequisites

- Maestro CLI: `curl -Ls "https://get.maestro.mobile.dev" | bash`
- Java 17+: `brew install openjdk@17`
- iOS Simulator or Android Emulator running
- App built and installed on simulator/emulator

## Running Tests

```bash
# Single flow
maestro test flows/auth/login.yaml

# All auth tests
maestro test flows/auth/

# All tests
maestro test flows/

# With recording
maestro record flows/auth/login.yaml
```

## Test Structure

```
maestro/
├── config.yaml           # Global configuration
├── flows/
│   ├── auth/             # Authentication flows
│   │   ├── login.yaml
│   │   ├── signup.yaml
│   │   └── logout.yaml
│   ├── appointments/     # Appointment flows
│   │   ├── view-list.yaml
│   │   └── create.yaml
│   └── smoke/            # Quick smoke tests
│       └── happy-path.yaml
└── shared/               # Reusable sub-flows
    ├── login.yaml
    └── logout.yaml
```

## Writing Tests

See [Maestro docs](https://maestro.mobile.dev/cli/write-your-first-flow) for flow syntax.

Key selectors for FCC:

- Text: `tapOn: "Sign In"` (exact text)
- Accessibility: `tapOn: { id: "login-button" }` (requires testID on component)
- Index: `tapOn: { index: 0 }` (nth element)

## CI Integration

Add to GitHub Actions:

```yaml
- name: Run E2E tests
  run: maestro test maestro/flows/smoke/
```
