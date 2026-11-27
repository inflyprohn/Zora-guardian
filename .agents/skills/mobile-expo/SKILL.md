---
name: mobile-expo
description: Plan and develop Android and iOS apps with React Native and Expo, including navigation, native UI, builds, signing, and store delivery.
---

# Mobile App Development (Expo / React Native)

## Choose the stack
- For a new cross-platform app, evaluate Expo + React Native first.
- For an existing native Android project, preserve Kotlin/Java architecture unless migration is requested.
- For a small web app that only needs installability, evaluate PWA before proposing a native rewrite.
- Confirm device APIs, offline needs, background work, permissions, and distribution requirements before selecting libraries.

## Workflow
1. Inspect the current project, SDK version, package manager, and platform targets.
2. Use Expo's official skills as the implementation reference when Expo/EAS is present:
   https://github.com/expo/skills
3. Select focused guidance for project structure, native UI, routing, permissions, data fetching, EAS builds, and store submission.
4. Use platform-appropriate secure storage for credentials; never embed server secrets in the app.
5. Request only necessary permissions and explain why they are needed.
6. Test on Android and iOS, including small screens, offline/error states, and accessibility.
7. Document build profiles, signing requirements, environment variables, and reproducible build commands.

## Dependency and security rules
- Prefer Expo SDK-compatible packages and verify compatibility before installation.
- Use npx expo install for Expo-managed native dependencies where appropriate.
- Do not commit signing keys, keystores, provisioning profiles, tokens, or .env files.
- Do not claim an APK/AAB/IPA exists until a build artifact is produced and checked.

## Zora Guardian
Treat mobile development as a separate client that may consume an authenticated API. Do not convert the existing Vite website into a native app without explicit scope approval.
