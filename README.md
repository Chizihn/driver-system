# Driver Verification System

A comprehensive driver verification and document management system with QR code capabilities.

## 🌟 Features

### Backend
- RESTful API with Express.js
- JWT Authentication & Authorization
- Role-based access control (Admin, Officer, Driver)
- QR Code generation and verification
- Document management and validation
- Comprehensive logging and audit trails

### Frontend
- Modern React application with TypeScript
- Responsive design with mobile support
- Real-time QR code scanning
- Intuitive document management
- Role-based UI components
- Dark/light mode

## 🏗 Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT
- **API Documentation**: Swagger/OpenAPI

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + Shadcn/UI
- **State Management**: Zustand
- **Form Handling**: React Hook Form + Zod
- **Routing**: React Router v6

## 📦 Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL 13+
- Git

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd driver-system
```

### 2. Set Up Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your configuration
npm install
npx prisma migrate dev
npm run dev
```

### 3. Set Up Frontend

```bash
cd ../frontend
cp .env.example .env
# Edit .env to point to your backend
npm install
npm run dev
```

### 4. Access the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:4000
- API Documentation: http://localhost:4000/docs
- Prisma Studio: Run `npx prisma studio` in the backend directory

## 📂 Project Structure

```
.
├── backend/           # Backend server (Node.js/Express)
│   ├── prisma/       # Database schema and migrations
│   ├── src/          # Source code
│   └── ...
│
├── frontend/         # Frontend application (React)
│   ├── public/       # Static files
│   ├── src/          # Source code
│   └── ...
│
├── .gitignore        # Git ignore file
└── README.md         # This file
```

## 🔧 Development

### Backend
- `cd backend`
- `npm run dev` - Start development server
- `npx prisma studio` - Open database GUI
- `npm run lint` - Run linter

### Frontend
- `cd frontend`
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🌐 API Documentation

Once the backend is running, access the interactive API documentation at:
http://localhost:4000/docs

## 🔒 Environment Variables

### Backend (`.env` in backend directory)
```env
PORT=4000
NODE_ENV=development
DATABASE_URL="postgresql://user:password@localhost:5432/driver_system?schema=public"
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=1d
QR_CODE_EXPIRY_MINUTES=15
```

### Frontend (`.env` in frontend directory)
```env
VITE_API_URL=http://localhost:4000/api
VITE_APP_NAME="Driver Verification System"
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 🚀 Deployment

### Backend
1. Set `NODE_ENV=production` in `.env`
2. Build the application:
   ```bash
   npm run build
   ```
3. Start the production server:
   ```bash
   npm start
   ```

### Frontend
1. Update environment variables for production
2. Build the application:
   ```bash
   npm run build
   ```
3. Deploy the contents of the `dist` directory to your hosting service

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📧 Contact

For questions or feedback, please contact the development team.
# driver-system
