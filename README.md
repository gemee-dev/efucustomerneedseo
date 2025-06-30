# Efuyegela Customer Need SEO - Lead Generation Form

A professional lead generation form application built with Next.js, featuring dynamic service-specific questions, admin dashboard, and advertisement management system.

## 🚀 Live Demo

- **Website**: [https://efucustomerneedseo.vercel.app](https://efucustomerneedseo.vercel.app)
- **Admin Dashboard**: [https://efucustomerneedseo.vercel.app/admin](https://efucustomerneedseo.vercel.app/admin)

## 🔐 Admin Access

### Primary Admin
- **Username**: `gemechu`
- **Password**: `daniel`
- **Role**: Super Admin

### Secondary Admin
- **Username**: `gbonsa2@gmail.com`
- **Password**: `gemegold*0913`
- **Role**: Admin

## ✨ Features

### 🎯 Lead Generation Form
- **Dynamic Questions**: Service-specific questions based on selected service
- **File Upload**: Support for project files and documents
- **Real-time Validation**: Client-side and server-side validation
- **Professional UI**: Clean, responsive design without emojis
- **Service Categories**:
  - Web Development (Frontend/Backend frameworks, databases)
  - Mobile Development (React Native/Flutter, platforms)
  - Software Development (Programming languages, platforms)
  - Publishers (Content type, distribution channels)
  - Consultants (Business stage, team size)
  - Events (Format, attendee count, duration)
  - Enterprise Software (Company size, security requirements)

### 📊 Admin Dashboard
- **Submission Management**: View, filter, and manage all form submissions
- **Detailed View Modals**: Complete client information in popup modals
- **Status Management**: Update submission status (received, in_progress, completed, cancelled)
- **Search & Filter**: Find submissions by name, email, service, or status
- **Real-time Updates**: Dashboard updates without page refresh
- **Statistics**: Overview of submissions, conversion rates, and analytics

### 📢 Advertisement Management
- **Create Advertisements**: Add new ads with title, content, position, and status
- **Position-based Display**: Header, sidebar, inline, and footer advertisements
- **Real-time Updates**: Ads appear on website immediately after creation
- **Status Control**: Activate/deactivate ads instantly
- **Professional Design**: Rotating ads with gradient backgrounds and icons
- **Admin Privileges**: Full CRUD operations for advertisement management

### 🗄️ Database Integration
- **MongoDB Atlas**: Cloud database with connection string
- **Mongoose ODM**: Object modeling for Node.js
- **Fallback Support**: In-memory storage when database unavailable
- **Data Models**: Submissions, Admins, Advertisements, Users, OTP
- **Indexes**: Optimized queries for better performance

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: MongoDB Atlas with Mongoose
- **Authentication**: JWT tokens with bcryptjs
- **File Upload**: Multer with local storage
- **UI Components**: Custom components with Radix UI
- **Styling**: Tailwind CSS with custom design system
- **Deployment**: Vercel with environment variables

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/gemee-dev/efucustomerneedseo.git
   cd efucustomerneedseo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```

   Update `.env.local` with your values:
   ```bash
   MONGODB_URI=mongodb+srv://gemegold:gemegold@cluster0.eashhao.mongodb.net/efuyegela?retryWrites=true&w=majority&appName=Cluster0
   JWT_SECRET=your-super-secret-jwt-key
   ADMIN_EMAIL=gemechu
   ADMIN_PASSWORD=daniel
   ```

4. **Initialize Database**
   ```bash
   node scripts/initialize-database.js
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

6. **Access Application**
   - Website: http://localhost:3000
   - Admin: http://localhost:3000/admin

## 🚀 Deployment

### Vercel Deployment

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Deploy to production"
   git push origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import repository: `gemee-dev/efucustomerneedseo`
   - Add environment variables (see VERCEL_ENV_VARIABLES.md)
   - Deploy

### Environment Variables for Production
```bash
MONGODB_URI=mongodb+srv://gemegold:gemegold@cluster0.eashhao.mongodb.net/efuyegela?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=efu-super-secret-jwt-key-2024-production-gemegold-efuyegela-secure-token-12345
ADMIN_EMAIL=gemechu
ADMIN_PASSWORD=daniel
NEXT_PUBLIC_APP_URL=https://efucustomerneedseo.vercel.app
```

## 📁 Project Structure

```
efucustomerneedseo/
├── app/
│   ├── admin/                 # Admin dashboard
│   ├── api/                   # API routes
│   │   ├── advertisements/    # Advertisement CRUD
│   │   ├── admin/            # Admin authentication
│   │   ├── submit-form/      # Form submission
│   │   └── upload/           # File upload
│   └── page.js               # Main landing page
├── components/
│   ├── ad-zone.js            # Advertisement display
│   └── ui/                   # UI components
├── lib/
│   ├── models/               # Database models
│   ├── schemas/              # MongoDB schemas
│   └── mongodb.js            # Database connection
├── scripts/
│   └── initialize-database.js # Database setup
└── public/
    └── uploads/              # File storage
```

## 🔧 API Endpoints

### Public Endpoints
- `GET /api/advertisements` - Fetch advertisements
- `POST /api/submit-form` - Submit lead form
- `POST /api/upload` - Upload files

### Admin Endpoints (Authentication Required)
- `POST /api/admin/login` - Admin login
- `GET /api/admin/dashboard` - Dashboard data
- `GET /api/admin/submissions` - Get submissions
- `POST /api/advertisements` - Create advertisement
- `PUT /api/advertisements` - Update advertisement
- `DELETE /api/advertisements` - Delete advertisement

## 🎨 Design Features

- **Single Page Application**: No scrolling required, fits within screen
- **Popup Functionality**: Unlimited modals for detailed views
- **No Header/Footer**: Clean design with popup navigation
- **Professional Appearance**: No emojis, clean typography
- **Fast Loading**: Optimized for speed and performance
- **Mobile Responsive**: Works on all device sizes

## 📊 Database Schema

### Submissions Collection
```javascript
{
  name: String,
  email: String,
  company: String,
  service: String,
  budget: String,
  timeline: String,
  description: String,
  // Dynamic fields based on service
  frontend_framework: String,
  backend_language: String,
  mobile_stack: String,
  // ... other service-specific fields
  status: String,
  created_at: Date,
  updated_at: Date
}
```

### Advertisements Collection
```javascript
{
  position: String, // 'header', 'sidebar', 'inline', 'footer'
  title: String,
  content: String,
  status: String, // 'active', 'inactive'
  created_by: ObjectId,
  created_at: Date,
  updated_at: Date
}
```

## 🔒 Security Features

- **JWT Authentication**: Secure admin access
- **Password Hashing**: bcryptjs with salt rounds
- **Input Validation**: Server-side validation for all inputs
- **File Upload Security**: Restricted file types and sizes
- **Environment Variables**: Sensitive data in environment files
- **CORS Protection**: API endpoint protection

## 🚀 Performance Optimizations

- **Next.js 14**: Latest framework with app router
- **MongoDB Indexes**: Optimized database queries
- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic code splitting for faster loads
- **Caching**: Efficient caching strategies
- **Minification**: Production build optimization

## 📞 Support

For support or questions:
- **Email**: gemechu@efuyegela.com
- **GitHub Issues**: [Create an issue](https://github.com/gemee-dev/efucustomerneedseo/issues)

## 📄 License

This project is proprietary software developed for Efuyegela.

---

**Built with ❤️ by the Efuyegela Team**