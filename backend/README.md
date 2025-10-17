# Driver Verification System - Backend

A robust backend service for driver verification and document management, built with Node.js, Express, TypeScript, and Prisma.

## 🚀 Features

- **User Authentication & Authorization**

  - JWT-based authentication
  - Role-based access control (Admin, Officer, Driver)
  - Secure password hashing

- **QR Code Management**

  - Generate unique QR codes for drivers
  - QR code verification endpoint
  - Expiration and validation handling

- **Document Verification**

  - Document upload and validation
  - Status tracking (PENDING, APPROVED, REJECTED, EXPIRED)
  - Document type management

- **Verification Logs**
  - Track all verification attempts
  - Officer activity monitoring
  - Audit trail for compliance

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL (via Prisma ORM)
- **Authentication**: JWT
- **API Documentation**: Swagger/OpenAPI
- **QR Code Generation**: `qrcode`
- **Logging**: Morgan

## 📦 Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL 13+

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd driver-system/backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

1. Copy `.env.example` to `.env`
2. Update the environment variables in `.env`:

```env
# Server
PORT=4000
NODE_ENV=development

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/driver_system?schema=public"

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=1d

# QR Code
QR_CODE_EXPIRY_MINUTES=15
```

### 4. Database Setup

1. Ensure PostgreSQL is running
2. Run database migrations:

```bash
npx prisma migrate dev
```

### 5. Start the Development Server

```bash
npm run dev
```

The API will be available at `http://localhost:4000/api`

## 📚 API Documentation

Interactive API documentation is available at `http://localhost:4000/docs` when the server is running.

## 🏗 Project Structure

```
src/
├── config/         # Configuration files
├── controllers/    # Request handlers
├── middleware/     # Express middleware
├── repositories/   # Database operations
├── routes/         # API route definitions
├── services/       # Business logic
├── types/          # TypeScript type definitions
├── utils/          # Utility functions
├── app.ts          # Express app setup
└── server.ts       # Server entry point
```

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server with hot-reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npx prisma studio` - Open Prisma Studio for database management

### Environment Variables

| Variable                 | Description               | Default     |
| ------------------------ | ------------------------- | ----------- |
| `PORT`                   | Server port               | 4000        |
| `NODE_ENV`               | Environment mode          | development |
| `DATABASE_URL`           | PostgreSQL connection URL | -           |
| `JWT_SECRET`             | Secret key for JWT        | -           |
| `JWT_EXPIRES_IN`         | JWT expiration time       | 1d          |
| `QR_CODE_EXPIRY_MINUTES` | QR code validity duration | 15          |

## 🔒 Authentication

All protected routes require a valid JWT token in the `Authorization` header:

```
Authorization: Bearer <token>
```

### User Roles

- `ADMIN`: Full system access
- `OFFICER`: Can verify drivers and view relevant data
- `DRIVER`: Can access their own profile and documents

## 📝 API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile

### QR Code

- `GET /api/me/qrcode` - Get current user's QR code (Driver only)
- `POST /api/verify/qrcode` - Verify a QR code (Officer only)

### Documents

- `GET /api/documents` - List documents
- `POST /api/documents` - Upload a new document
- `GET /api/documents/:id` - Get document details
- `PUT /api/documents/:id/status` - Update document status (Admin only)

### Verifications

- `GET /api/verifications` - List verifications
- `GET /api/verifications/:id` - Get verification details
- `POST /api/verifications/log` - Log a new verification (Officer only)

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

2. Start the production server:
   ```bash
   npm start
   ```

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 Contact

For questions or feedback, please contact the development team.
