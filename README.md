# Learning App

A modern, React Native application dedicated to delivering educational modules, video courses, assessments, and progress tracking. 



## Features

- **Video Courses:** High-quality video playback with support for HLS streaming.
- **Interactive Assessments:** Quizzes and tests linked directly to course modules.
- **Progress Tracking:** Real-time tracking of watched videos and assessment scores.
- **Certificates:** Automated certificate generation upon module completion.
- **Mock Data Mode:** Fully functional UI testing environment without needing a live backend.

## Architecture & Flow

The application follows a **Feature-Based Architecture**, keeping all domain-specific logic (UI, API endpoints, state) bundled together. For a complete guide on how the app is structured, data flows, and how to scale it for the future, please read the [Architecture Guide](./APP_ARCHITECTURE.md).

## Getting Started

### Prerequisites
- Node.js (v18+)
- Yarn or npm
- React Native environment setup (Android Studio for Android, Xcode for iOS)

### Installation

1. **Clone the repository and install dependencies:**
   ```sh
   yarn install
   # or
   npm install
   ```

2. **Configure the App:**
   Open `src/appConfig.ts` to configure your environment. 
   - Set `USE_MOCK = true` to run the app using local dummy data (perfect for UI development).
   - Set `USE_MOCK = false` and update `baseUrl` to connect to your live backend server.

### Running the App

**Start the Metro Bundler:**
```sh
npm start
```

**Run on Android:**
```sh
npm run android
```

**Run on iOS:**
```sh
npm run ios
```
*(Make sure to run `pod install` inside the `ios/` folder first if running on iOS).*

## Project Structure Highlights

- `src/App.tsx`: The root component handling app initialization.
- `src/appConfig.ts`: The central configuration file.
- `src/features/`: Contains domain-specific modules (video, assessments, dashboard, etc.).
- `src/core/`: Shared utilities, API definitions (RTK Query), theme, and global Redux store.
- `src/shared/`: Reusable global UI components.
- `src/navigation/`: React Navigation routers.

## License

MIT
