# react-native-learning-sdk

Reusable Learning Module SDK for React Native

## Installation


```sh
npm install react-native-learning-sdk
```


## Usage


```js
import { multiply } from 'react-native-learning-sdk';

// ...

const result = multiply(3, 7);
```


## Testing the Example App

To test the SDK implementation, this repository includes an example app in the `example/` directory.

### Running on a Physical Phone

Follow these steps to run the example app on your physical device (Android):

1. **Enable Developer Options & USB Debugging:**
   - On your Android device, go to **Settings** > **About phone**.
   - Tap **Build number** 7 times to enable Developer Options.
   - Go back to **Settings** > **System** > **Developer options** and enable **USB debugging**.

2. **Connect Your Device:**
   - Connect your phone to your computer via a USB cable.
   - You may see a prompt on your phone asking to "Allow USB debugging". Accept it.
   - Verify your device is connected by running:
     ```sh
     adb devices
     ```
     Your device should be listed.

3. **Install Dependencies:**
   - Open your terminal and navigate to the root of the repository.
   - Run the following command to install dependencies for both the SDK and the example app:
     ```sh
     yarn install
     ```
     *(Or use `npm install` if you prefer).*

4. **Start the Metro Bundler:**
   - Start the React Native packager by running:
     ```sh
     yarn example start
     ```
     *(Or `npm run example start`)*

5. **Run the App on Your Device:**
   - In a new terminal window, run the application on your Android device:
     ```sh
     yarn example android
     ```
     *(Or `npm run example android`)*
   - The app will be built and installed on your phone.

### Editing the Base URL

The example app initializes the SDK with a specific `baseUrl`. If you need to point the SDK to a different backend server (e.g., your local development server or a new Cloudflare tunnel), you can update this URL in the source code.

1. Open the file located at `example/src/App.tsx`.
2. Locate the `LearningSDK.initialize` call within the `useEffect` hook.
3. Modify the `baseUrl` property to your desired backend URL:

```tsx
import { useEffect } from 'react';
import { StyleSheet, View, Button } from 'react-native';
import { LearningSDK, LearningSDKView } from 'react-native-learning-sdk';

export default function App() {
  useEffect(() => {
    LearningSDK.initialize({
      accessToken: 'dummy-token',
      // Update the baseUrl below to your desired backend URL
      baseUrl: 'https://straight-finally-mary-assisted.trycloudflare.com', 
    });
  }, []);

  // ...
}
```

4. Save the file. The React Native Metro bundler will automatically reload the app on your device with the new base URL.


















prompt for independent app

Assuming Antigravity already has access to the codebase, give it a prompt like this:

:::writing{variant="standard" id="58271"} Analyze the current codebase thoroughly.

Context:

This repository currently contains a Learning Module SDK and an example application that demonstrates SDK usage.

I need to create a completely independent Learning Module application.

The independent application must look and behave exactly like the current SDK example application from a user's perspective.

The final application must NOT depend on the SDK package in any way.

All SDK functionality should become part of the application codebase itself.

The architecture should be designed for future expansion and long-term maintenance.


Tasks:

1. Analyze the entire project structure and identify:

SDK-specific code

Example app code

Shared components

Dependencies between the SDK and example app



2. Create a migration plan to convert the example app into a standalone application.


3. Refactor the architecture so that:

No imports from the SDK package remain.

SDK logic is moved into appropriate application modules.

Business logic, data layer, services, repositories, models, UI components, and navigation are organized in a scalable structure.



4. Use a feature-based architecture such as: lib/ ├── core/ ├── shared/ ├── features/ │   ├── courses/ │   ├── assessments/ │   ├── progress/ │   ├── certificates/ │   └── profile/ └── main.dart


5. Preserve:

Existing UI

Existing user flows

Existing APIs

Existing functionality

Existing assets and themes



6. Improve:

Code organization

Separation of concerns

Reusability

Scalability

Testability



7. Generate:

Folder restructuring plan

File movement plan

Dependency removal plan

Refactoring steps

Risk assessment

Final architecture diagram



8. Before making changes:

Produce a detailed report of what will be changed.

Identify files that can be reused as-is.

Identify files that must be rewritten.

Explain why each change is required.




Do not immediately modify files. First provide a complete migration and architecture plan with exact file-level recommendations. :::

This prompt is better than directly asking Antigravity to code because it forces it to understand the SDK-example-app relationship first. In large Flutter projects, the biggest mistakes usually happen when the AI starts moving files before mapping dependencies. Let it generate the migration plan first, review that plan, and only then ask it to execute the refactor.
