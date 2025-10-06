# Taqsy Weather App

A modern, beautiful weather application built with React, TypeScript, and Tailwind CSS. Features real-time weather data, interactive charts, and a fully responsive design.

🔗 **Repository:** [https://github.com/hassanalzahrani-1/Taqsy](https://github.com/hassanalzahrani-1/Taqsy)

## ✨ Features

### Weather Information
- 🌤️ **Current Weather** - Real-time temperature, conditions, and weather details
- 📅 **5-Day Forecast** - Detailed daily forecasts with weather icons
- ⏰ **Hourly Forecast** - Hour-by-hour weather predictions
- 📊 **Temperature Trend Chart** - Interactive line graph with Recharts showing temperature changes over time
- 🌡️ **Weather Details** - Humidity, wind speed, pressure, visibility, and UV index

### User Experience
- 🎨 **Theme Support** - Dark, Light, and System theme modes
- 🔍 **Smart City Search** - Real-time city search with OpenWeatherMap's geocoding API
- ⚙️ **Customizable Settings** - Temperature unit (°C/°F), location, refresh interval, and notifications
- 📱 **Fully Responsive** - Optimized for mobile, tablet, and desktop
- 💾 **Persistent Settings** - Local storage for user preferences
- 🎯 **Weather Icons** - Visual weather condition indicators throughout the app

### Technical Features
- ⚡ **Fast Performance** - Built with Vite for lightning-fast development and builds
- 🔄 **Auto-refresh** - Configurable weather data refresh intervals
- 🎭 **Mock Data Support** - Works without API key for development and testing
- 🌐 **Network Resilient** - Graceful fallback to mock data on API errors

## 🛠️ Tech Stack

- **React 18** - Modern UI library with hooks
- **TypeScript** - Type-safe development
- **Vite** - Next-generation frontend tooling
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Composable charting library for React
- **Lucide React** - Beautiful icon library
- **shadcn/ui** - High-quality, accessible UI components
- **OpenWeatherMap API** - Weather data provider

## Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn/pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/hassanalzahrani-1/Taqsy.git
cd Taqsy
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Set up environment variables for real weather data:
```bash
# Create .env file in the root directory
echo "VITE_OPENWEATHER_API_KEY=your_api_key_here" > .env
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## 📜 Available Scripts

- `npm run dev` - Start development server (http://localhost:5173)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint to check code quality

## ⚙️ Configuration

### Weather API Setup

The app works with both real and mock weather data:

#### Using Real Weather Data (Recommended)
1. Get a free API key from [OpenWeatherMap](https://openweathermap.org/api)
2. Create a `.env` file in the root directory:
   ```env
   VITE_OPENWEATHER_API_KEY=your_actual_api_key_here
   VITE_OPENWEATHER_BASE_URL=https://api.openweathermap.org/data/2.5
   ```
3. Restart the dev server

#### Using Mock Data (Development)
- If no API key is configured, the app automatically uses mock data
- Perfect for development and testing without API limits or network requests
- No configuration needed - just run `npm run dev`

### Testing on Mobile Devices

To test on mobile devices on the same network:

1. Start the dev server with network access:
```bash
npm run dev -- --host
```

2. Find your computer's IP address (e.g., `192.168.1.100`)

3. On your mobile device, open: `http://YOUR_IP:5173`

**Using Mobile Hotspot:**
- Connect your PC to your phone's hotspot
- Run the dev server with `--host` flag
- Access from your phone's browser using the network IP

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/          # Layout components (navigation, sidebar)
│   ├── pages/           # Page components (Home, Forecast, Settings)
│   ├── ui/              # Reusable UI components (shadcn/ui)
│   ├── utils/           # Utility components (ImageWithFallback)
│   └── weather/         # Weather-specific components
│       ├── current-weather.tsx
│       ├── forecast-card.tsx
│       ├── hourly-chart.tsx      # Temperature trend chart
│       ├── hourly-forecast.tsx
│       └── weather-details.tsx
├── hooks/               # Custom React hooks
│   └── use-weather.ts   # Weather data management hook
├── lib/                 # Services and utilities
│   ├── geocoding-service.ts
│   ├── storage.ts
│   └── weather-service.ts
├── styles/              # Global styles and Tailwind config
├── types/               # TypeScript type definitions
└── App.tsx              # Main application component
```

## 🎨 Key Components

- **Temperature Trend Chart** - Interactive Recharts line graph with responsive design
- **Hourly Forecast** - Scrollable hourly weather predictions
- **Forecast Cards** - 5-day weather forecast with detailed information
- **Weather Details** - Comprehensive weather metrics display
- **City Search** - Smart city search with autocomplete
- **Theme Switcher** - Seamless dark/light mode transitions

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

The build output will be in the `dist/` directory, ready to deploy to any static hosting service (Vercel, Netlify, GitHub Pages, etc.).

### Preview Production Build

```bash
npm run preview
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ using React, TypeScript, and Tailwind CSS**
