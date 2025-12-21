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
cd apnisec-sde-intern
```

**If you encounter dependency conflicts, run the fix script:**

**Windows (Command Prompt):**
```cmd
install-fix.bat
```

**Windows (PowerShell):**
```powershell
.\install-fix.ps1
```

**macOS/Linux:**
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
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

This application requires a valid Resend API key for email functionality:

1. **Sign up at [Resend](https://resend.com)**
2. **Create an API key** in your Resend dashboard
3. **Add the API key** to your `.env` file as `RESEND_API_KEY=re_your_key_here`
4. **Verify your domain** in Resend (or use their test domain for development)

The application will **fail to start** if `RESEND_API_KEY` is missing, as real email delivery is required for:
- Welcome emails on user registration
- Issue creation notifications  
- Profile update confirmations

### 3. Start MongoDB
Make sure MongoDB is running locally:
```bash
# On macOS with Homebrew
brew services start mongodb-community

# On Windows
net start MongoDB

# On Linux
sudo systemctl start mongod
```

### 4. Run the Application
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 🔧 Troubleshooting

### Dependency Conflicts
If you see ERESOLVE errors:
1. Run the appropriate fix script above
2. Or use: `npm install --legacy-peer-deps`

### TypeScript Errors
If you see TypeScript errors about missing React types:
```bash
npm install
npm run dev
```

### MongoDB Connection Issues
1. Ensure MongoDB is running: `mongod --version`
2. Check connection string in `.env`
3. Verify MongoDB is accessible at `mongodb://127.0.0.1:27017`

### Build Issues
```bash
npm run build
```
If build fails, check:
1. All dependencies are installed
2. TypeScript configuration is correct
3. No syntax errors in code

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
- Returns 429 status when limit exceeded

### Authentication
- JWT tokens with configurable expiration
- bcrypt password hashing (12 rounds)
- HTTP-only cookies for web security
- Authorization header support for API clients

### Input Validation
- Zod schema validation for all inputs
- Mongoose schema validation
- XSS protection through input sanitization

## 🎨 UI Components

### Reusable Components
- `Navbar` - Navigation with auth state
- `Footer` - Site footer with links
- `Hero` - Landing page hero section
- `IssueForm` - Create/edit issue form
- `IssueList` - Display issues with actions
- `Loader` - Loading spinner
- `ErrorAlert` - Error message display

### Pages
- `/` - Landing page with services overview
- `/login` - User authentication
- `/register` - User registration
- `/dashboard` - Issue management dashboard
- `/profile` - User profile management

## 📧 Email Integration

The application uses Resend for email notifications:

1. **Welcome Email** - Sent after successful registration
2. **Issue Created** - Sent when a new issue is created
3. **Profile Updated** - Sent when profile is modified

If `RESEND_API_KEY` is not configured, emails are simulated in console logs.

## 🧪 Testing the Application

### 1. Health Check
```bash
curl http://localhost:3000/api/health
```

### 2. User Registration
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

### 3. Create Issue
```bash
curl -X POST http://localhost:3000/api/issues \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"title":"Security Vulnerability","description":"Found XSS vulnerability","type":"VAPT","priority":"high"}'
```

## 📱 MongoDB Compass

To view your data in MongoDB Compass:

1. Open MongoDB Compass
2. Connect to: `mongodb://127.0.0.1:27017`
3. Navigate to the `apnisec` database
4. View `users` and `issues` collections

## 🚀 Production Deployment

### Environment Variables
Ensure all production environment variables are set:
- Use strong `JWT_SECRET`
- Configure `RESEND_API_KEY` for emails
- Set `MONGODB_URI` to production database
- Update `NEXT_PUBLIC_APP_URL`

### Build and Start
```bash
npm run build
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@apnisec.com or create an issue in the repository.

---

**ApniSec** - Securing your digital future, one issue at a time. 🛡️