# TGI Backend - Production Ready API

Complete backend system for TGI (Talent Group of India) recruitment platform with Cloudinary image management.

## 🚀 Features

- ✅ **Authentication** - JWT-based admin authentication
- ✅ **Content Management** - Dynamic content API for all website sections
- ✅ **Form Submissions** - Contact form handling with admin dashboard
- ✅ **Client Management** - CRUD operations for client logos
- ✅ **Team Management** - Manage team members with images
- ✅ **Testimonials** - Multi-category testimonial system
- ✅ **Media Upload** - Cloudinary integration for image management
- ✅ **Security** - Helmet, CORS, rate limiting, input validation
- ✅ **Production Ready** - Optimized for Render deployment

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- Cloudinary account

## 🛠️ Installation

### 1. Install Dependencies

```bash
cd TGI-main-backend
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Update the `.env` file with your credentials:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database (MongoDB Atlas for production)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tgi-recruitment

# JWT Secret (Generate a strong random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# Admin Default Credentials
ADMIN_EMAIL=admin@tgindia.com
ADMIN_PASSWORD=tgi@admin2024
```

### 3. Seed Database

Create the admin user:

```bash
npm run seed
```

### 4. Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:5000`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/me` - Get current user
- `GET /api/auth/verify` - Verify token
- `PUT /api/auth/change-password` - Change password

### Content Management
- `GET /api/content` - Get all content
- `GET /api/content/:section` - Get content by section
- `PUT /api/content/:section` - Update content section (Admin)
- `POST /api/content/reset` - Reset to defaults (Admin)
- `POST /api/content/bulk-update` - Bulk update (Admin)

### Form Submissions
- `POST /api/submissions` - Create submission (Public)
- `GET /api/submissions` - Get all submissions (Admin)
- `GET /api/submissions/:id` - Get single submission (Admin)
- `PUT /api/submissions/:id` - Update submission status (Admin)
- `DELETE /api/submissions/:id` - Delete submission (Admin)
- `DELETE /api/submissions` - Delete all submissions (Admin)

### Clients
- `GET /api/clients` - Get all clients
- `GET /api/clients/:id` - Get single client
- `POST /api/clients` - Create client (Admin)
- `PUT /api/clients/:id` - Update client (Admin)
- `DELETE /api/clients/:id` - Delete client (Admin)

### Team Members
- `GET /api/team` - Get all team members
- `GET /api/team/:id` - Get single member
- `POST /api/team` - Create member (Admin)
- `PUT /api/team/:id` - Update member (Admin)
- `DELETE /api/team/:id` - Delete member (Admin)

### Testimonials
- `GET /api/testimonials` - Get all testimonials
- `GET /api/testimonials/:id` - Get single testimonial
- `POST /api/testimonials` - Create testimonial (Admin)
- `PUT /api/testimonials/:id` - Update testimonial (Admin)
- `DELETE /api/testimonials/:id` - Delete testimonial (Admin)

### Media Upload
- `POST /api/media/upload` - Upload image file (Admin)
- `POST /api/media/upload-url` - Upload image from URL (Admin)
- `GET /api/media` - Get all media (Admin)
- `GET /api/media/:id` - Get single media (Admin)
- `PUT /api/media/:id` - Update media metadata (Admin)
- `DELETE /api/media/:id` - Delete media (Admin)

## 🔐 Authentication

All admin endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 📤 Image Upload Examples

### Upload from File

```javascript
const formData = new FormData();
formData.append('image', file);
formData.append('usedIn', 'team-member');

const response = await fetch('http://localhost:5000/api/media/upload', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});
```

### Upload from URL

```javascript
const response = await fetch('http://localhost:5000/api/media/upload-url', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    url: 'https://example.com/image.jpg',
    usedIn: 'client-logo'
  })
});
```

## 🚀 Deployment to Render

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

### 2. Create MongoDB Atlas Database

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string
4. Whitelist all IPs (0.0.0.0/0) for Render

### 3. Deploy on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: tgi-backend
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free or Starter

### 4. Add Environment Variables

In Render dashboard, add all variables from `.env`:

```
NODE_ENV=production
PORT=5000
MONGODB_URI=<your-mongodb-atlas-uri>
JWT_SECRET=<strong-random-string>
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=<your-cloud-name>
CLOUDINARY_API_KEY=<your-api-key>
CLOUDINARY_API_SECRET=<your-api-secret>
FRONTEND_URL=<your-frontend-url>
ADMIN_EMAIL=admin@tgindia.com
ADMIN_PASSWORD=<secure-password>
```

### 5. Deploy

Click "Create Web Service" and wait for deployment.

### 6. Seed Production Database

After deployment, run seed command in Render Shell:

```bash
npm run seed
```

## 📁 Project Structure

```
TGI-main-backend/
├── src/
│   ├── config/
│   │   ├── database.js          # MongoDB connection
│   │   └── cloudinary.js        # Cloudinary config
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── content.controller.js
│   │   ├── submission.controller.js
│   │   ├── client.controller.js
│   │   ├── team.controller.js
│   │   ├── testimonial.controller.js
│   │   └── media.controller.js
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication
│   │   ├── errorHandler.js      # Error handling
│   │   ├── upload.js            # Multer config
│   │   └── rateLimiter.js       # Rate limiting
│   ├── models/
│   │   ├── User.model.js
│   │   ├── Content.model.js
│   │   ├── Submission.model.js
│   │   ├── Client.model.js
│   │   ├── Team.model.js
│   │   ├── Testimonial.model.js
│   │   └── Media.model.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── content.routes.js
│   │   ├── submission.routes.js
│   │   ├── client.routes.js
│   │   ├── team.routes.js
│   │   ├── testimonial.routes.js
│   │   └── media.routes.js
│   └── scripts/
│       └── seed.js              # Database seeding
├── .env.example
├── .gitignore
├── package.json
├── server.js                    # Entry point
└── README.md
```

## 🔒 Security Features

- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - Prevent abuse
- **JWT** - Secure authentication
- **Bcrypt** - Password hashing
- **Input Validation** - Mongoose validation
- **Error Handling** - Centralized error handling

## 🧪 Testing

Health check endpoint:

```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "TGI Backend is running",
  "timestamp": "2024-04-08T09:19:00.000Z"
}
```

## 📝 Notes

- All images uploaded to Cloudinary are stored in `tgi-recruitment` folder
- Image deletions automatically remove files from Cloudinary
- Content uses frontend defaults if not set in database
- Rate limits: 100 req/15min (general), 5 req/15min (auth), 10 req/hour (submissions)

## 🆘 Support

For issues or questions, contact the development team.
