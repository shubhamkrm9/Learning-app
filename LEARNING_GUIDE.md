# 📚 Beginner's Learning Guide to the App

To fully understand how this Learning App works and to eventually contribute to it, a beginner should learn a series of foundational and advanced programming concepts. 

This guide breaks down exactly what you need to learn, tailored specifically to the technologies used in this codebase.

---

## 1. The Foundation: JavaScript & TypeScript
*Before touching React or mobile apps, you need a strong grasp of the language the app is written in.*

### Core JavaScript (ES6+)
- **Variables & Scope**: `let`, `const`, and block scoping.
- **Functions**: Arrow functions (`() => {}`) and standard functions.
- **Array & Object Manipulation**: Destructuring (`const { title } = lesson`), spread operators (`...state`), and array methods (`map`, `filter`, `find`, `every`).
- **Asynchronous JavaScript**: Promises, `async`, and `await`. You need to know this to understand how the app fetches data from the backend.

### TypeScript
*This app is written in TypeScript, which adds a layer of strict typing over JavaScript to prevent bugs.*
- **Basic Types**: `string`, `number`, `boolean`, `null`.
- **Interfaces & Types**: How to define the shape of an object (e.g., `interface Lesson { id: string; title: string; }`). You will see this constantly in `src/core/types/`.
- **Generics**: Reusable type structures (e.g., `PayloadAction<T>`).

---

## 2. The UI Framework: React
*React Native is built on top of React. Understanding how React thinks is non-negotiable.*

- **Functional Components**: How to build UI out of reusable, isolated functions.
- **JSX/TSX**: The HTML-like syntax written inside JavaScript files.
- **Props**: Passing data from a parent component down to a child component.
- **State**: Managing local data inside a component using the `useState` hook.
- **Lifecycle & Side Effects**: Using the `useEffect` hook to run code when a component loads (like fetching data) or when specific variables change.
- **Performance Hooks**: Using `useCallback` and `useMemo` to stop the app from running unnecessary calculations.

---

## 3. The Mobile Layer: React Native
*How we turn React into a real iOS and Android application.*

- **Core Components**: Instead of HTML `<div>` and `<span>`, you must learn `<View>`, `<Text>`, `<TouchableOpacity>`, `<ScrollView>`, and `<SafeAreaView>`.
- **Styling**: Using `StyleSheet.create()` to style elements.
- **Flexbox**: The layout system used in React Native to arrange items on the screen (e.g., `flexDirection: 'row'`, `justifyContent: 'space-between'`).

---

## 4. Moving Around: React Navigation
*How the app moves from screen to screen.*

- **Navigation Container**: The wrapper that holds the navigation state (`RootNavigator.tsx`).
- **Stack Navigation**: Moving forward and backward through screens (like clicking a video and hitting the "Back" button).
- **Tab Navigation**: The bottom menu bar that lets you switch between Home, Modules, Assessments, and Progress (`MainTabNavigator.tsx`).
- **Passing Parameters**: How to send data from one screen to another (e.g., `route.params.lessonId`).

---

## 5. Global Brain: Redux Toolkit (State Management)
*When data needs to be shared across many screens (like whether a user is logged in, or if a video is unlocked), we use Redux.*

- **The Store**: The global "brain" or database of your app (`src/core/store/index.ts`).
- **Slices (`createSlice`)**: How we chop the store up into manageable pieces (e.g., `appSlice.ts`, `progressSlice.ts`).
- **State & Reducers**: Variables in the store, and the functions allowed to change them.
- **Dispatching Actions**: How a UI component tells the store to change something (`dispatch(markLessonCompleted())`).
- **Selecting Data**: How a UI component reads data from the store (`useAppSelector((state) => state.progress.watchedPercentage)`).

---

## 6. Talking to the Internet: RTK Query & APIs
*How the app talks to your Django backend.*

- **REST APIs**: The concept of making network requests over HTTP (GET to fetch data, POST to send data).
- **RTK Query API Slice**: How we use Redux Toolkit to automatically fetch, cache, and manage loading states (`baseApi.ts`).
- **Data Transformation**: Taking the raw data the backend sends and reshaping it into the types the app expects (`apiConfig.ts`).

---

## 7. App Architecture & File Structure
*How a professional app is organized to stop it from becoming a messy spaghetti of code.*

- **Feature-Based Architecture**: Instead of grouping all screens together and all logic together, we group by *Feature* (`src/features/video`, `src/features/assessments`).
- **Separation of Concerns**: Keeping UI code (Screens/Components) separate from logic (Services) and global state (Slices).

---

## 8. Specific Advanced Implementations
*Libraries specific to this app.*

- **React Native Video**: How to stream HLS (`.m3u8`) playlists, track playback progress, and handle video ending events (`VideoPlayer.tsx`).
- **Middleware**: Intercepting Redux actions to do things quietly in the background (like sending events in `analyticsMiddleware.ts`).
