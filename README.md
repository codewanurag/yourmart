# YourMart — Full-Stack Social Commerce Platform

A production-ready social commerce web app with live sessions, dark/light mode,
real product images, full authentication, cart, checkout, orders, messaging,
and a complete seller dashboard.

---

## Tech Stack

**Frontend:** React 18 + Vite + Tailwind CSS + Framer Motion + Axios + Lucide React  
**Backend:** Node.js + Express + MongoDB + Mongoose + JWT + bcrypt  
**Deploy:** Frontend → Vercel | Backend → Render | Database → MongoDB Atlas

---

## Project Structure

```
yourmart/
├── frontend/                  ← React app (deploy to Vercel)
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/        ← Navbar, Sidebar, MobileNav, Layout
│   │   │   ├── ui/            ← Button, Badge, Modal, Spinner, etc.
│   │   │   ├── product/       ← ProductCard
│   │   │   ├── cart/          ← CartDrawer
│   │   │   └── live/          ← LiveModal
│   │   ├── context/           ← Auth, Theme, Cart, Wishlist contexts
│   │   ├── pages/             ← All page components
│   │   ├── utils/             ← api.js (Axios), mockData.js
│   │   └── styles/            ← index.css (Tailwind + custom)
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── vercel.json
│   └── package.json
│
└── backend/                   ← Express API (deploy to Render)
    ├── models/                ← User, Product, Order, LiveSession, Message
    ├── routes/                ← auth, users, products, cart, wishlist,
    │                               orders, live, sellers, messages
    ├── middleware/            ← auth.js (JWT protect)
    ├── server.js
    ├── render.yaml
    └── package.json
```

---

## ════════════════════════════════════════
## PART 1 — LOCAL DEVELOPMENT SETUP
## ════════════════════════════════════════

### Step 1 — Install Prerequisites

Make sure you have these installed:
- **Node.js** v18 or higher → https://nodejs.org
- **npm** (comes with Node.js)
- **Git** → https://git-scm.com
- A code editor like **VS Code** → https://code.visualstudio.com

Verify by running in your terminal:
```bash
node --version    # Should print v18.x.x or higher
npm --version     # Should print 9.x.x or higher
```

---

### Step 2 — Create Project Folders

Open your terminal and run:

```bash
mkdir yourmart
cd yourmart
mkdir frontend backend
```

---

### Step 3 — Set Up the Backend

```bash
cd backend
```

**3a. Create package.json** — paste the content of `backend/package.json`

**3b. Install dependencies:**
```bash
npm install
```

**3c. Create .env file:**
```bash
cp .env.example .env
```
Then open `.env` in VS Code and fill in your values:
```
PORT=5000
MONGODB_URI=mongodb+srv://...    ← Get this from MongoDB Atlas (see Part 3)
JWT_SECRET=any_long_random_string_here_at_least_32_chars
JWT_EXPIRES_IN=30d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**3d. Start the backend:**
```bash
npm run dev
```
You should see:
```
✅ MongoDB connected
🚀 Server running on port 5000
```

---

### Step 4 — Set Up the Frontend

Open a **new terminal window**, then:

```bash
cd yourmart/frontend
```

**4a. Install dependencies:**
```bash
npm install
```

**4b. Create .env file:**
```bash
cp .env.example .env
```
Content of `.env`:
```
VITE_API_URL=http://localhost:5000/api
```

**4c. Start the frontend:**
```bash
npm run dev
```
You should see:
```
  ➜  Local:   http://localhost:5173/
```

Open http://localhost:5173 in your browser. 🎉

---

## ════════════════════════════════════════
## PART 2 — FILE-BY-FILE PASTE GUIDE
## ════════════════════════════════════════

Paste each file **exactly as provided** into the path shown.
File paths are relative to the `yourmart/` folder.

### Backend Files (paste into `yourmart/backend/`)

| File Path | Purpose |
|-----------|---------|
| `backend/package.json` | Backend dependencies |
| `backend/server.js` | Express app entry point |
| `backend/.env.example` | Environment variable template |
| `backend/render.yaml` | Render deployment config |
| `backend/middleware/auth.js` | JWT authentication middleware |
| `backend/models/User.js` | User schema (name, email, password, seller info) |
| `backend/models/Product.js` | Product schema with reviews |
| `backend/models/Order.js` | Order schema with items and shipping |
| `backend/models/LiveSession.js` | Live session + Message + Conversation schemas |
| `backend/routes/auth.js` | Register, Login, Profile APIs |
| `backend/routes/users.js` | User notifications API |
| `backend/routes/products.js` | Products CRUD + search + reviews |
| `backend/routes/cart.js` | Cart validation API |
| `backend/routes/wishlist.js` | Wishlist toggle API |
| `backend/routes/orders.js` | Orders create/read/update APIs |
| `backend/routes/live.js` | Live sessions API |
| `backend/routes/sellers.js` | Sellers directory + follow + dashboard |
| `backend/routes/messages.js` | Conversations + messaging API |

### Frontend Files (paste into `yourmart/frontend/`)

| File Path | Purpose |
|-----------|---------|
| `frontend/package.json` | React app dependencies |
| `frontend/vite.config.js` | Vite config with API proxy |
| `frontend/tailwind.config.js` | Tailwind with custom colors/animations |
| `frontend/postcss.config.js` | PostCSS config |
| `frontend/index.html` | HTML entry with Google Fonts |
| `frontend/vercel.json` | Vercel SPA routing config |
| `frontend/.env.example` | Frontend env template |
| `frontend/src/styles/index.css` | Global styles, animations, dark/light |
| `frontend/src/main.jsx` | React entry, providers, Toaster |
| `frontend/src/App.jsx` | Routes with protected route wrappers |
| `frontend/src/utils/api.js` | Axios instance with JWT interceptor |
| `frontend/src/utils/mockData.js` | Demo products, sellers, live sessions |
| `frontend/src/context/ThemeContext.jsx` | Dark/light mode toggle |
| `frontend/src/context/AuthContext.jsx` | Login/logout/register state |
| `frontend/src/context/CartContext.jsx` | Cart with localStorage persistence |
| `frontend/src/context/WishlistContext.jsx` | Wishlist with API sync |
| `frontend/src/components/layout/Layout.jsx` | Main layout with sidebars |
| `frontend/src/components/layout/Navbar.jsx` | Top navigation bar |
| `frontend/src/components/layout/LeftSidebar.jsx` | Left nav + live sessions |
| `frontend/src/components/layout/RightSidebar.jsx` | Live preview + trending |
| `frontend/src/components/layout/MobileNav.jsx` | Bottom mobile navigation |
| `frontend/src/components/ui/LoadingScreen.jsx` | Full-screen loading spinner |
| `frontend/src/components/ui/index.jsx` | Button, Badge, Input, Modal, etc. |
| `frontend/src/components/product/ProductCard.jsx` | Product card with wishlist |
| `frontend/src/components/cart/CartDrawer.jsx` | Sliding cart panel |
| `frontend/src/components/live/LiveModal.jsx` | Live session viewer with chat |
| `frontend/src/pages/HomePage.jsx` | Main feed with hero + products |
| `frontend/src/pages/LoginPage.jsx` | Login form with validation |
| `frontend/src/pages/RegisterPage.jsx` | Register form |
| `frontend/src/pages/ProductsPage.jsx` | Shop with search + filter |
| `frontend/src/pages/ProductDetailPage.jsx` | Product detail with reviews |
| `frontend/src/pages/CartPage.jsx` | Full cart page |
| `frontend/src/pages/WishlistPage.jsx` | Saved items |
| `frontend/src/pages/CheckoutPage.jsx` | 3-step checkout flow |
| `frontend/src/pages/OrdersPage.jsx` | Orders list |
| `frontend/src/pages/OrderDetailPage.jsx` | Order tracking |
| `frontend/src/pages/ProfilePage.jsx` | User profile + seller onboarding |
| `frontend/src/pages/MessagesPage.jsx` | Real-time messaging UI |
| `frontend/src/pages/LivePage.jsx` | Live sessions browser |
| `frontend/src/pages/SellersPage.jsx` | Sellers directory |
| `frontend/src/pages/SellerDashboardPage.jsx` | Full seller analytics + product management |

---

## ════════════════════════════════════════
## PART 3 — MONGODB ATLAS (FREE DATABASE)
## ════════════════════════════════════════

1. Go to https://www.mongodb.com/cloud/atlas and **sign up free**
2. Click **"Build a Database"** → Choose **M0 Free Tier**
3. Choose a region close to you (e.g., AWS Mumbai)
4. Click **"Create"**
5. Under **Security → Database Access** → Add a database user:
   - Username: `yourmart`
   - Password: choose a strong password (save it!)
   - Role: **Atlas Admin**
6. Under **Security → Network Access** → Add IP:
   - Click **"Allow Access from Anywhere"** (0.0.0.0/0) for development
7. Go to **Database → Connect → Connect your application**
8. Copy the connection string. It looks like:
   ```
   mongodb+srv://yourmart:<password>@cluster0.xxxxx.mongodb.net/
   ```
9. Replace `<password>` with your actual password and add `yourmart` as the database name:
   ```
   mongodb+srv://yourmart:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/yourmart?retryWrites=true&w=majority
   ```
10. Paste this as `MONGODB_URI` in your `backend/.env` file

---

## ════════════════════════════════════════
## PART 4 — DEPLOY TO VERCEL (FRONTEND)
## ════════════════════════════════════════

1. Push your `frontend/` folder to a GitHub repository
2. Go to https://vercel.com → Sign up with GitHub
3. Click **"Add New Project"** → Import your repo
4. Set **Root Directory** to `frontend`
5. Framework: **Vite** (auto-detected)
6. Add **Environment Variable**:
   - Key: `VITE_API_URL`
   - Value: `https://yourmart-backend.onrender.com/api` ← your Render URL
7. Click **Deploy** ✅

---

## ════════════════════════════════════════
## PART 5 — DEPLOY TO RENDER (BACKEND)
## ════════════════════════════════════════

1. Push your `backend/` folder to a GitHub repository
2. Go to https://render.com → Sign up
3. Click **"New" → "Web Service"**
4. Connect your GitHub repo
5. Settings:
   - **Name:** `yourmart-backend`
   - **Root Directory:** `backend` (if in monorepo)
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
6. Add **Environment Variables** (click "Advanced"):
   ```
   MONGODB_URI    = your MongoDB Atlas connection string
   JWT_SECRET     = your_super_secret_jwt_key_at_least_32_chars
   JWT_EXPIRES_IN = 30d
   NODE_ENV       = production
   FRONTEND_URL   = https://yourmart.vercel.app
   ```
7. Click **"Create Web Service"** ✅
8. Copy the URL Render gives you (e.g., `https://yourmart-backend.onrender.com`)
9. Go back to Vercel and update `VITE_API_URL` to this URL + `/api`

---

## ════════════════════════════════════════
## PART 6 — FEATURES & HOW THEY WORK
## ════════════════════════════════════════

### Authentication
- Register/Login with JWT tokens stored in localStorage
- Protected routes redirect to /login if not authenticated
- Demo credentials: demo@yourmart.com / demo123

### Dark / Light Mode
- Toggle via sun/moon icon in navbar
- Persisted in localStorage
- All components support both themes

### Cart
- Stored in localStorage (works without login)
- Slide-out CartDrawer on all pages
- Qty controls, remove items, price summary
- Free shipping on orders above ₹999

### Checkout
- 3-step flow: Address → Payment → Review
- Form validation on each step
- COD / UPI / Card payment options
- Creates order in MongoDB (falls back to demo if API down)

### Live Sessions
- Demo video player with real video
- Auto-scrolling live chat simulation
- Viewer count fluctuates in real time
- Featured products in session with Add to Cart

### Seller Dashboard
- Stats: Revenue, Orders, Views, Products
- Add / Edit / Delete products
- Recent orders list
- Analytics with revenue bar chart
- Become a Seller flow in Profile page

### Messaging
- Real-time-style chat UI
- Simulated seller replies for demo
- Conversation list with search

---

## ════════════════════════════════════════
## PART 7 — COMMON ISSUES & FIXES
## ════════════════════════════════════════

**Backend won't start:**
- Make sure MongoDB URI is correct in `.env`
- Check that `.env` file exists (not `.env.example`)
- Run `npm install` again

**Frontend shows blank page:**
- Check browser console for errors
- Make sure `VITE_API_URL` is set in `.env`
- Run `npm install` then `npm run dev`

**Login fails:**
- Make sure backend is running on port 5000
- Check that MongoDB is connected
- Try the demo credentials: demo@yourmart.com / demo123

**Images not loading:**
- The app uses Unsplash URLs which require internet
- Check your internet connection

**CORS error:**
- In `backend/.env`, set `FRONTEND_URL=http://localhost:5173`
- Restart the backend after changing `.env`

---

## ════════════════════════════════════════
## PART 8 — CUSTOMIZATION GUIDE
## ════════════════════════════════════════

### Change colors
Edit `frontend/tailwind.config.js` → colors section:
- `gold` / `gold2` / `gold3` — accent colors
- `blush` — sale/wishlist color
- `sage` — success/verified color
- `ember` — gradient accent

### Add real products
1. Login as a seller (or go through Become Seller in Profile)
2. Go to Seller Dashboard → Products → Add Product
3. Use real Unsplash image URLs for product images

### Seed demo data
Add this to `backend/server.js` before the listen call (remove after seeding):
```js
// One-time seed
const Product = require('./models/Product');
// (add seed logic here)
```

### Add payment gateway
1. Install Razorpay: `npm install razorpay` in backend
2. Add your Razorpay key in `.env`
3. Replace the COD flow in `CheckoutPage.jsx` with Razorpay checkout

---

Built with ❤️ — YourMart Social Commerce Platform
