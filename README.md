# FinTrack UMKM - Financial Management System

Sistem manajemen keuangan terintegrasi untuk UMKM dengan fitur analitik dan AI.

## 🚀 Teknologi Stack

### Frontend
- **React 18** dengan Vite
- **Recharts** untuk visualisasi data
- **Axios** untuk HTTP client
- **Design System** yang konsisten

### Backend  
- **Laravel 12** 
- **MySQL** untuk database
- **JWT Authentication** untuk keamanan
- **AI Service** untuk insights dan prediksi

## 📦 Struktur Project

```
FinTrack_UMKM/
├── frontend-react/
│   ├── src/
│   │   ├── main.jsx (Main App Component)
│   │   ├── services/
│   │   │   └── api.js (API Service)
│   │   └── index.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
└── backend-laravel/
    ├── app/
    │   ├── Http/
    │   │   └── Controllers/
    │   │       └── API/ (Controllers)
    │   ├── Models/ (Database Models)
    │   └── Services/
    │       └── AIService.php
    ├── database/
    │   └── migrations/
    ├── routes/
    │   └── api.php
    └── composer.json
```

## 🔧 Installation & Setup

### Prerequisites
- PHP 8.2+
- Node.js 18+
- MySQL 8.0+
- Composer

### Backend Setup

1. **Clone & Setup Laravel**
```bash
cd backend-laravel
cp .env.example .env
composer install
```

2. **Konfigurasi Database**
Edit `.env`:
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=fintrack_umkm
DB_USERNAME=root
DB_PASSWORD=
```

3. **Generate Keys**
```bash
php artisan key:generate
php artisan jwt:secret
```

4. **Create Database**
```bash
# Buat database di MySQL
mysql -u root -p
CREATE DATABASE fintrack_umkm;
EXIT;
```

5. **Run Migrations**
```bash
php artisan migrate
```

6. **Start Backend Server**
```bash
php artisan serve
# Server will run on http://localhost:8000
```

### Frontend Setup

1. **Install Dependencies**
```bash
cd frontend-react
npm install
```

2. **Configure Environment**
```bash
cp .env.example .env
# Ubah VITE_API_URL sesuai backend URL
```

3. **Start Development Server**
```bash
npm run dev
# Server will run on http://localhost:5173
```

4. **Build for Production**
```bash
npm run build
```

## 📱 Fitur Utama

### Dashboard
- Summary revenue, expenses, dan profit
- Chart trend penjualan
- KPI cards real-time

### Transactions
- Pencatatan transaksi (Penjualan, Pembelian, Pengeluaran)
- Filter by type, category, date range
- Export data
- Real-time summary

### Inventory Management  
- Manajemen produk dengan SKU
- Tracking margin keuntungan
- Warning stok minimum
- AI-powered product categorization

### Analytics & Reports
- Revenue breakdown by category
- Expense analysis
- Profit margin tracking
- Trend visualization

### AI Assistant
- Predictive sales analytics
- Anomaly detection
- Smart insights generation
- Product categorization

### Settings
- Business profile management
- Target penjualan & budget setting
- Preferences & configuration

## 🔐 Authentication

Menggunakan JWT (JSON Web Token):
- Token disimpan di `localStorage`
- Auto-attach ke setiap request
- Auto-logout jika token expired

### Test Account
```
Email: budi@tokoku.id
Password: password123

Email: siti@umkm.id
Password: siti123
```

## 🤖 AI Engine

### Capabilities
1. **Transaction Analysis**
   - Anomaly detection
   - Spending pattern analysis
   - Smart recommendations

2. **Sales Prediction**
   - Trend forecasting
   - Period-based prediction
   - Growth rate estimation

3. **Insights Generation**
   - Automated recommendations
   - Performance indicators
   - Alerts & warnings

4. **Product Categorization**
   - AI-powered auto-categorization
   - Confidence scoring
   - Smart product classification

## 📊 API Endpoints

### Authentication
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me
POST   /api/auth/refresh
```

### Transactions
```
GET    /api/transactions
POST   /api/transactions
GET    /api/transactions/{id}
PUT    /api/transactions/{id}
DELETE /api/transactions/{id}
GET    /api/transactions/summary
```

### Products
```
GET    /api/products
POST   /api/products
GET    /api/products/{id}
PUT    /api/products/{id}
DELETE /api/products/{id}
GET    /api/products/{id}/stock
```

### Analytics
```
GET    /api/analytics/dashboard
GET    /api/analytics/revenue
GET    /api/analytics/expenses
GET    /api/analytics/profit-margin
GET    /api/analytics/category-breakdown
```

### AI
```
POST   /api/ai/analyze-transaction
GET    /api/ai/predict-sales
GET    /api/ai/insights
POST   /api/ai/categorize-product
```

## 🎨 Design System

### Color Palette
```javascript
const C = {
  primary: "#7c3aed",      // Purple
  success: "#16a34a",      // Green
  danger: "#dc2626",       // Red
  warning: "#d97706",      // Amber
  info: "#0891b2",        // Cyan
  bg: "#f5f4ff",          // Light purple
  text: "#111827",        // Dark gray
  muted: "#6b7280",       // Gray
}
```

### Components
- Cards
- Modals  
- Tables
- Charts (Area, Bar, Pie, Line)
- Forms
- Buttons
- Headers

## 📝 Development Guidelines

### Adding New Feature

1. **Backend**
   - Create Model if needed
   - Create Migration for DB changes
   - Create Controller with methods
   - Add routes in `routes/api.php`

2. **Frontend**
   - Create API service method in `api.js`
   - Create UI components
   - Call API in useEffect
   - Handle loading & error states

## 🐛 Troubleshooting

### Database Connection Error
```bash
# Check .env database credentials
# Verify MySQL is running
mysql -u root -p
```

### CORS Error
Laravel handles CORS automatically. If issues persist:
```bash
php artisan config:cache
```

### Token Expiration
Frontend auto-logout on 401. User can login again to get new token.

### Port Already in Use
```bash
# Backend
php artisan serve --port=8000

# Frontend  
npm run dev -- --port=5173
```

## 📚 Database Schema

### Users
- id, name, email, password, timestamps

### Transactions  
- id, user_id, type, category, amount, note, date, timestamps

### Products
- id, user_id, name, sku, category, modal, jual, min_stock, current_stock, ai_label, ai_confidence, timestamps

### Settings
- id, user_id, business_name, business_address, business_phone, sales_target, daily_budget, timestamps

## 🚀 Deployment

### Backend (Laravel)
```bash
# Production build
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Use Laravel Forge, Heroku, DigitalOcean, etc.
```

### Frontend (React)
```bash
# Build
npm run build

# Deploy to Vercel, Netlify, GitHub Pages, etc.
# Use dist/ folder as build output
```

## 📄 License

MIT License

## 👥 Support

For issues or questions, please contact support@fintrack.local

---

**Created with my tim for Indonesian UMKM**
Our team :
1. CACC132D6Y0056 - M. Fadhil Muzaffar Guci - AI Engineer - Aktif
2. CACC200D6Y0904 - Diaz Ridho Yuristianto - AI Engineer - Aktif
3. CFCC200D6X1084 - Wahyu Oktaviyana Ramandhani - Full-Stack Web Developer - Aktif
4. CDCC200D6X1765 - Dewi Lestari Ningsih - Data Scientist - Aktif 
5. CFCC200D6X2177 - Clara Mela Pristina - Full-Stack Web Developer - Aktif