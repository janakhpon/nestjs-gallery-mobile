# Gallery Mobile App

A simple, clean mobile gallery app built with React Native and Expo that connects to a NestJS backend.

## 🚀 Features

- **Image Gallery**: View images in a clean 2-column grid
- **Search**: Real-time search through your images
- **Upload**: Add images from camera or photo library
- **AI Assistant**: Chat with an AI assistant for help
- **Offline Support**: Works offline with local storage
- **Image Details**: View and edit image metadata

## 📱 Tech Stack

- **React Native** with **Expo SDK 54**
- **TypeScript** for type safety
- **Expo Router** for navigation
- **TanStack Query** for data fetching
- **Expo SQLite** for offline storage
- **Expo Image Picker** for camera/library access
- **Expo Haptics** for touch feedback

## 🛠️ Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm start
   ```

3. **Run on device**:
   - Press `a` for Android
   - Press `i` for iOS
   - Press `w` for web

## 🔧 Configuration

The app connects to a NestJS backend. Configure the API URL in your environment:

```bash
# .env
EXPO_PUBLIC_API_URL=http://localhost:3001/api/v1
```

## 📁 Project Structure

```
app/
├── index.tsx              # Main tab navigation
├── gallery.tsx            # Image gallery screen
├── upload.tsx             # Image upload screen
├── assistant.tsx          # AI assistant screen
├── image/[id].tsx         # Image detail screen
└── (tabs)/
    ├── _layout.tsx        # Tab layout
    ├── index.tsx          # Home screen
    └── explore.tsx        # Explore screen

src/
├── components/            # Reusable components
├── services/              # API and offline services
├── types/                 # TypeScript types
├── utils/                 # Utility functions
└── config/                # Configuration

components/                # Legacy components (themed)
constants/                 # App constants
hooks/                     # Custom hooks
```

## 🎯 Core Features

### Gallery
- Displays images in a responsive grid
- Pull-to-refresh functionality
- Search through image titles and descriptions
- Infinite scroll loading

### Upload
- Camera integration for taking photos
- Photo library access for selecting images
- Metadata input (title, description)
- Image compression and optimization

### Assistant
- AI-powered chat interface
- Quick action buttons for common tasks
- Help with gallery operations
- Context-aware responses

### Offline Support
- Local SQLite storage
- Automatic sync when online
- Offline indicator
- Background sync

## 🔌 API Integration

The app integrates with a NestJS backend providing:

- **GET** `/api/v1/images` - List images with pagination and search
- **POST** `/api/v1/images` - Upload new images
- **GET** `/api/v1/images/{id}` - Get image details
- **PATCH** `/api/v1/images/{id}` - Update image metadata
- **DELETE** `/api/v1/images/{id}` - Delete images
- **GET** `/api/v1/images/{id}/download` - Get download URL

## 🎨 UI/UX

- **Clean Design**: Simple, intuitive interface
- **Consistent Colors**: Blue primary theme (#3b82f6)
- **Touch Feedback**: Haptic feedback for interactions
- **Loading States**: Skeleton loaders and progress indicators
- **Error Handling**: Graceful error messages and retry options

## 📱 Platform Support

- **iOS**: Full support with native features
- **Android**: Full support with Material Design
- **Web**: Basic support for development

## 🚀 Development

### Scripts
- `npm start` - Start development server
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS
- `npm run web` - Run on web
- `npm run lint` - Run ESLint

### Code Style
- TypeScript strict mode
- ESLint with Expo config
- Consistent naming conventions
- Component-based architecture

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For issues and questions, please check the documentation or create an issue in the repository.