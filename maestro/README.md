# Maestro E2E Tests

End-to-end tests for the Family Care Circle mobile app using [Maestro](https://maestro.mobile.dev).

## Prerequisites

- Maestro CLI: `curl -Ls "https://get.maestro.mobile.dev" | bash`
- iOS Simulator or Android Emulator running
- Expo development build installed on simulator/emulator

## Running Tests

```bash
# Smoke test: verify app launches
maestro test flows/smoke/app-launches.yaml

# Login flow (requires test credentials)
maestro test -e TEST_PASSWORD=<password> flows/auth/login.yaml

# All smoke tests
maestro test -e TEST_PASSWORD=<password> flows/smoke/

# All tests
maestro test -e TEST_PASSWORD=<password> flows/

# Record a test run (saves video)
maestro record -e TEST_PASSWORD=<password> flows/auth/login.yaml
```

## Environment Variables

| Variable        | Default            | Description                                        |
| --------------- | ------------------ | -------------------------------------------------- |
| `TEST_EMAIL`    | `test@example.com` | Set in `config.yaml`, override with `-e`           |
| `TEST_PASSWORD` | _(none)_           | **Required** — pass via CLI `-e TEST_PASSWORD=xxx` |

## Test Structure

```
maestro/
├── config.yaml               # Global config (appId, env defaults)
├── flows/
│   ├── auth/
│   │   └── login.yaml         # Login with test credentials
│   └── smoke/
│       ├── app-launches.yaml  # Verify app boots to login screen
│       └── happy-path.yaml    # Login → Home → Appointments → Back
└── shared/
    └── login.yaml             # Reusable login sub-flow
```

## Writing Tests

See [Maestro docs](https://maestro.mobile.dev/cli/write-your-first-flow) for flow syntax.

Key selectors for FCC:

- Text: `tapOn: "Sign In"` (exact text match)
- Accessibility: `tapOn: { id: "login-button" }` (requires `testID` on component)
- Index: `tapOn: { index: 0 }` (nth matching element)

Reuse the shared login sub-flow to avoid duplication:

```yaml
- runFlow: ../shared/login.yaml
```
