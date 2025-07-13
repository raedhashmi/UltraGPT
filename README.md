# UltraGPT

UltraGPT is a versatile Next.js chat application designed for seamless interaction with various AI models. It offers a rich user experience with dynamic UI, extensive customization options, and robust chat management features.

## Features

- **Flexible AI Integration:** Interact with multiple leading AI models, offering diverse conversational capabilities.
- **Enhanced Chat Interface:** Enjoy a modern chat environment with rich text formatting, intelligent code highlighting, and convenient utilities for managing interactions.
- **Dynamic User Experience:** Benefit from adaptive interface elements that respond intelligently to content and user interaction, ensuring a fluid and intuitive experience.
- **Personalized Themes:** Customize the application's visual style, including color schemes and gradients, to match your preferences.
- **Seamless Continuity:** Maintain your conversations across sessions with built-in chat history persistence.
- **Reliable Operation:** The application includes comprehensive error handling to ensure smooth performance and provide clear feedback when issues arise.
- **Secure User Management:** Features integrated user authentication to manage access and personalization.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can also check out [https://ultragpt.lrdevstudio.com](this), which is the publicly released version. 

### API Key Configuration

To use the AI models, you need to enter your Google API Key. Head to [Google AI Studio](https://aistudio.google.com/apikey) for your API key or create one and paste it in the [.env](.env) next to NEXT_PUBLIC_GOOGLE_API_KEY.