# 34 Admin — Admin Dashboard for 34 Paapi Pet Cafe

A full-featured admin panel built for **34 Paapi Pet Cafe**, a food ordering platform. This dashboard lets the cafe owner manage the menu, track orders in real time, and view customer/revenue analytics — all protected behind JWT-based authentication.

🔗 **Live Demo:** [34admin.vercel.app](https://34admin.vercel.app)
🔗 **Customer-facing app:** [34-cafe.vercel.app](https://34-cafe.vercel.app)

---

## ✨ Features

- **🔐 Secure Authentication** — JWT-based admin login with protected routes (frontend + backend)
- **📊 Dashboard** — Today's & total revenue, order counts, 7-day revenue trend chart, live order status breakdown
- **🍽️ Menu Management** — Full CRUD for products with image upload (Cloudinary), variant-based pricing (e.g. Small/Large), category & veg/non-veg filtering, search
- **📦 Order Management** — View all orders with payment & delivery status, update delivery status directly from the dashboard
- **⚡ Real-Time Updates** — Order status changes are pushed instantly to the customer app via **Socket.IO** (no refresh needed)
- **👥 User Management** — View registered customers with role, join date, and search/filter
- **🚀 Performance** — Redis caching on product reads, with automatic cache invalidation on writes
- **📱 Fully Responsive** — Works across desktop, tablet, and mobile

---

## 🛠️ Tech Stack

**Frontend**

- React (Vite)
- React Router
- Axios (with interceptors for auth token injection + auto-logout on expiry)
- Context API for global state (orders, users)
- Socket.IO Client

**Backend** _(shared with the main 34cafe backend)_

- Node.js, Express
- MongoDB + Mongoose
- Redis (caching)
- Cloudinary (image uploads via Multer)
- Socket.IO (real-time order status push)
- JWT (admin authentication)


## 🚀 Getting Started

### Prerequisites

- Node.js
- The [34 Paapi Pet Cafe backend](https://github.com/066rakesh/34-cafe/tree/main/Backend) running locally or deployed

### Installation

```bash
git clone https://github.com/066rakesh/34admin.git
cd 34admin
npm install
```

### Environment Variables

Create a `.env` file in the root:
