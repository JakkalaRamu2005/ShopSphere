# ShopSphere - E-Commerce Application

ShopSphere is a full-stack e-commerce web application built using the MERN stack (MySQL, Express.js, React, Node.js). It features a modern, responsive user interface and robust backend functionality for managing products, users, and orders.

## 🌟 Key Features

### **User Features**
- **User Authentication**: Secure login and signup with JWT tokens
- **Product Browsing**: View products with advanced filtering, sorting, and search
- **Search & Discovery**:
  - Real-time search suggestions
  - Voice search functionality
  - Trending and recent search history
- **Shopping Cart & Wishlist**: 
  - Add items to cart or wishlist
  - Manage cart quantities and view price summaries
- **Product Reviews**: Rate and review products with image uploads
- **Order Management**: Track order status and history
- **Payment Integration**: Razorpay payment gateway
- **AI Chatbot**: Google AI-powered customer support

### **Admin Features**
- **Admin Dashboard**: Comprehensive analytics and insights
- **Product Management**: Add, edit, delete products with multiple images
- **Order Management**: Update order status and track deliveries
- **User Management**: View and manage user accounts
- **Analytics**: Sales reports, revenue tracking, and performance metrics

### **Security Features**
- ✅ JWT authentication with httpOnly cookies
- ✅ Password hashing with bcrypt
- ✅ Rate limiting on sensitive endpoints
- ✅ Helmet.js security headers
- ✅ CORS protection
- ✅ SQL injection prevention (parameterized queries)
- ✅ Input validation with express-validator
- ✅ File upload validation and size limits

## 🛠 Tech Stack

### Frontend
- **React.js**: Library for building user interfaces
- **Vite**: Fast build tool and development server
- **React Router**: For seamless navigation between pages
- **CSS**: Custom styling with variables for a consistent design system
- **Context API**: State management for Auth, Cart, and Wishlist
- **Axios**: HTTP client for API requests

### Backend
- **Node.js & Express**: Server-side runtime and framework
- **MySQL (TiDB Cloud)**: Relational database for storing data
- **JWT**: Secure user authentication
- **Cloudinary**: Cloud storage for product images
- **Nodemailer**: Email notifications
- **Razorpay**: Payment processing
- **Google AI**: Chatbot functionality
- **Winston**: Logging and error tracking

## 🚀 Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites
- Node.js (v14 or higher)
- MySQL database or TiDB Cloud account
- Cloudinary account (for image uploads)
- Razorpay account (for payments)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd mernproject
```

### 2. Backend Setup

Navigate to the backend folder and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory (use `.env.example` as template):
```env
PORT=8080
NODE_ENV=development

# Database Configuration
DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_specific_password

# Razorpay Configuration
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Google AI Configuration
GOOGLE_AI_API_KEY=your_google_ai_api_key

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

Start the backend server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

### 3. Frontend Setup

Open a new terminal, navigate to the frontend folder, and install dependencies:
```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:8080
```

Start the frontend development server:
```bash
npm run dev
```

### 4. Running the App
- Open your browser and go to `http://localhost:5173`
- The backend API will be running at `http://localhost:8080`

## 📁 Project Structure

```
mernproject/
├── backend/
│   ├── config/          # Configuration files (database, logger)
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware (auth, security)
│   ├── routes/          # API routes
│   ├── services/        # Business logic (email, SMS)
│   ├── utils/           # Utility functions (cloudinary)
│   ├── server.js        # Entry point
│   └── .env.example     # Environment variables template
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── context/     # Context providers
│   │   ├── config/      # Configuration files
│   │   └── utils/       # Utility functions
│   └── .env.example     # Environment variables template
└── README.md
```

## 🔐 Security Best Practices

- JWT tokens stored in localStorage (client-side) and httpOnly cookies (server-side)
- All passwords hashed with bcrypt before storage
- Rate limiting on authentication endpoints
- CORS configured for specific origins
- Input validation on all user inputs
- File upload restrictions (type and size)
- SQL injection prevention with parameterized queries

## 📦 Production Deployment

### Backend Deployment (Recommended Platforms)
- **Render**: Easy deployment with free tier
- **Railway**: Simple setup with automatic deployments
- **Heroku**: Reliable platform (paid)
- **AWS EC2**: Full control and scalability
- **DigitalOcean**: VPS hosting

**Important**: Set `NODE_ENV=production` and update all environment variables

### Frontend Deployment (Recommended Platforms)
- **Netlify**: Auto-deploy from Git with CI/CD
- **Vercel**: Optimized for React applications
- **GitHub Pages**: Free static hosting
- **AWS S3 + CloudFront**: Scalable CDN solution

**Build Command**:
```bash
npm run build
```

## 📊 API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `GET /auth/profile` - Get user profile

### Products
- `GET /products` - Get all products
- `GET /products/:id` - Get product by ID
- `POST /admin/products` - Add new product (Admin)
- `PUT /admin/products/:id` - Update product (Admin)
- `DELETE /admin/products/:id` - Delete product (Admin)

### Orders
- `POST /checkout` - Create new order
- `GET /orders` - Get user orders
- `GET /admin/orders` - Get all orders (Admin)
- `PUT /admin/orders/:id/status` - Update order status (Admin)

### Reviews
- `POST /reviews` - Add product review
- `GET /reviews/product/:productId` - Get product reviews
- `PUT /reviews/:reviewId` - Update review
- `DELETE /reviews/:reviewId` - Delete review

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 📞 Support

For support, email support@shopsphere.com or join our Slack channel.

---

**Note**: See `PRODUCTION_READINESS.md` for detailed production deployment checklist and security review.

*Enjoy shopping with ShopSphere!*
