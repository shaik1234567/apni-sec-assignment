# ApniSec - Cybersecurity Platform

A production-ready full-stack Next.js 15 application for cybersecurity issue management, built with React 19, TypeScript, Tailwind CSS, and local MongoDB.

## 🚀 Features

### Authentication & Security
- Custom JWT authentication with bcrypt password hashing
- Protected routes with middleware
- Rate limiting (100 requests per 15 minutes)
- Secure HTTP-only cookies
- Input validation with Zod

### Issue Management
- Create, read, update, delete security issues
- Three issue types: Cloud Security, VAPT, Reteam Assessment
- Priority levels: Low, Medium, High, Critical
- Status tracking: Open, In Progress, Closed
- User-specific issue isolation

### Email Notifications
- Welcome emails for new users
- Issue creation notifications
- Profile update confirmations
- Powered by Resend API

### Modern UI/UX
- Responsive design with Tailwind CSS
- SEO optimized (score ≥ 80%)
- Professional cybersecurity landing page
- Real-time loading states and error handling

## 🏗️ Architecture

### Backend (Object-Oriented)
```
src/backend/
├── handlers/          # API request handlers
├── services/          # Business logic services
├── repositories/      # Database access layer
├── models/           # Mongoose schemas
├── validators/       # Input validation
├── middlewares/      # Auth & rate limiting
├── rate-limit/       # Rate limiter class
├── errors/           # Custom error classes
└── utils/            # API response utilities
```

### Frontend (React 19 + Next.js 15)
```
src/app/
├── components/       # Reusable UI components
├── providers/        # Context providers
├── api/             # API route handlers
├── (pages)/         # App router pages
└── globals.css      # Global styles
```

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Node.js, Object-Oriented Programming
- **Database**: MongoDB (Local) with Mongoose
- **Authentication**: JWT + bcrypt
- **Email**: Resend API
- **Validation**: Zod
- **Styling**: Tailwind CSS

## 📋 Prerequisites

- Node.js 18+ 
- MongoDB installed locally
- MongoDB Compass (recommended)

## 🚀 Quick Start

### 1. Clone and Install
```bash
git clone <repository-url>
cd apnisec
npm install
```

### 2. Environment Setup
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
# Database
MONGODB_URI=mongodb://127.0.0.1:27017/apnisec

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Email (Resend) - REQUIRED
RESEND_API_KEY=re_your_resend_api_key_here
FROM_EMAIL=noreply@apnisec.com

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**⚠️ IMPORTANT: Resend API Key Required**

This application requires a valid Resend API key for email functionality. See [resend.com](https://resend.com) to get started.

### 3. Start MongoDB
Make sure MongoDB is running locally.

### 4. Run the Application
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 📊 Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Issues Collection
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  type: String, // 'Cloud Security' | 'Reteam Assessment' | 'VAPT'
  status: String, // 'open' | 'in-progress' | 'closed'
  priority: String, // 'low' | 'medium' | 'high' | 'critical'
  userId: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### User Management
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Issue Management
- `GET /api/issues` - Get user's issues (paginated)
- `POST /api/issues` - Create new issue
- `GET /api/issues/[id]` - Get specific issue
- `PUT /api/issues/[id]` - Update issue
- `DELETE /api/issues/[id]` - Delete issue

### Health Check
- `GET /api/health` - Application health status

## 🔒 Security Features

### Rate Limiting
- 100 requests per 15-minute window per IP
- Custom RateLimiter class with in-memory storage

### Authentication
- JWT tokens with configurable expiration
- bcrypt password hashing (12 rounds)
- HTTP-only cookies for web security

### Input Validation
- Zod schema validation for all inputs
- Mongoose schema validation

## 🎨 UI Components

### Reusable Components
- `Navbar` - Navigation with auth state
- `Footer` - Site footer with links
- `Hero` - Landing page hero section
- `IssueForm` - Create/edit issue form
- `IssueList` - Display issues with actions
- `Loader` - Loading spinner
- `ErrorAlert` - Error message display

---

**ApniSec** - Securing your digital future, one issue at a time. 🛡️"# apni-sec-assignment" 
"# apni-sec-assignment" 
