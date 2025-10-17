# Driver Verification System - Frontend

A modern, responsive web application for driver verification built with React, TypeScript, and Vite.

## 🚀 Features

- **User Authentication**
  - Login/Logout functionality
  - Role-based access control
  - JWT token management

- **QR Code Scanning**
  - Real-time QR code scanning
  - Camera access handling
  - Scan history and results

- **Document Management**
  - Document upload and preview
  - Status tracking
  - Document validation

- **Responsive Design**
  - Mobile-first approach
  - Dark/light mode support
  - Accessible components

## 🛠 Tech Stack

- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/UI
- **Icons**: Lucide React
- **Form Handling**: React Hook Form + Zod
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast
- **QR Code**: jsQR, qrcode

## 📦 Prerequisites

- Node.js 18+
- npm or yarn
- Backend API server (see backend README)

## 🚀 Getting Started

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Environment Setup

1. Copy `.env.example` to `.env`
2. Update the environment variables:

```env
VITE_API_URL=http://localhost:4000/api
VITE_APP_NAME="Driver Verification System"
```

### 3. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 🏗 Project Structure

```
src/
├── components/    # Reusable UI components
├── lib/          # Utility functions and configurations
├── pages/        # Application pages
├── services/     # API service layer
├── stores/       # State management
└── types/        # TypeScript type definitions
```

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:4000/api` |
| `VITE_APP_NAME` | Application name | "Driver Verification System" |

## 🎨 Styling

This project uses:
- Tailwind CSS for utility-first styling
- Shadcn/UI for accessible components
- CSS Modules for component-scoped styles

## 🧪 Testing

To run tests:

```bash
npm test
```

## 🚀 Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. The production-ready files will be in the `dist` directory.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.
