# 🚀 Speed Reader — RSVP Reading App

Train your brain to read faster. One word at a time.

A mobile speed-reading app built with Expo + React Native + TypeScript, implementing RSVP (Rapid Serial Visual Presentation) with ORP-based fixation.

Instead of moving your eyes across lines of text, Speed Reader keeps your gaze fixed while words flow through a single focal point — dramatically reducing subvocalization and increasing reading speed.

📱 Preview
![Reader Screen](./assets/readme/reader.png)
![Import Screen](./assets/readme/import.png)
![Onboarding](./assets/readme/onboarding.png)


## ✨ Core Features

### 🧠 RSVP Engine (Rapid Serial Visual Presentation)
- One word displayed at a time
- Fixed visual focus point (ORP — Optimal Recognition Point)
- Precision-timed playback engine
- Adjustable WPM (50 – 1000+)

#### 🎯 ORP Highlighting
Each word is split into:

- left segment
- highlighted ORP character
- right segment

The ORP stays visually centered using precomputed text measurements.

Implementation:
[prepareWords()](features/reader/prepareWords.ts) → precomputes ORP index + pixel offset
Rendered by [WordRenderer](components/reader/WordRenderer.tsx)


⚡ Precision Timing Engine

Custom playback engine implemented as a class:
[ReaderEngine](features/reader/ReaderEngine.ts)

Features:

- Deterministic word scheduling
- Live WPM updates without restarting playback
- Pause / Reset / Skip
- Clean state transitions (idle | playing | paused)

📝 Smart Text Processing

Before rendering, text is:

1.  Unicode-normalized
2.  Cleaned from PDF artifacts
3.  De-hyphenated
4.  Abbreviations expanded
5.  Tokenized into words

Normalization logic: [normalize.ts](features/text/normalize.ts)
Tokenization: [tokenize.ts](features/text/tokenize.ts)
Prepared text is managed globally via a [React Context provider](features/text/readerTextContext.tsx)

🎮 Reader Controls

- Play / Pause
- Skip forward / backward
- Reset
- WPM Slider

🎓 Guided Onboarding Mode

The app includes a progressive onboarding experience that:

- Gradually increases WPM
- Synchronizes audio narration
- Automatically transitions to normal mode
- Persists onboarding state via [AsyncStorage](features/readerMode/ReaderModeContext.tsx)
- WPM ramp controller: [useWpmRampController.ts](features/onboarding/useWpmRampController.ts)


🏗 Architecture Overview

app/
   (onboarding)
   (tabs)/
      reader/
      import/
      settings/
features/
   import/
   onboarding/
   reader/
   readerMode/
   settings/
   text/
   theme/
   wpm/
components/
   audio/
   reader/
   ui/

- Expo Router [navigation](<app/(tabs)/_layout.tsx>)
- Custom Reader Engine class
- Precomputation of render offsets
- Minimal re-renders via React.memo
- Live WPM mutation using refs


🛠 Tech Stack

- Expo (SDK 54)
- React Native
- TypeScript
- Expo Router
- AsyncStorage
- Expo Haptics
- Custom playback engine (no animation libraries)


📥 Text Import

Currently supported:

- Copy & paste [text input](<app/(tabs)/import/index.tsx>)
- [PDF import](features/import/pdf/extractPdfText.ts)
- OCR support


🎯 Why This Project Is Interesting

This is not just a UI app.

It demonstrates:

- Custom timing engine design
- Performance-conscious rendering
- Precomputation strategies
- Context-driven state management
- Live parameter mutation without re-instantiating logic
- UX design optimized for cognitive flow

🚀 Getting Started

git clone https://github.com/NicolasP97/speedreader.git
cd speedreader
npm install
npx expo start

Make sure you are using Expo SDK 54.

🧪 Future Improvements

- Session statistics
- Reading streak tracking
- Eye fixation calibration mode
- Native typography measurement instead of monospace estimation
