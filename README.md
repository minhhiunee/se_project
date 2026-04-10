# se_project

## Ecommerce Backend Skeleton

Backend path: `backend`

### Folder structure

```text
backend
 ├ src
 │ ├ controllers
 │ ├ routes
 │ ├ services
 │ ├ middleware
 │ ├ models
 │ ├ config
 │ └ app.js
 ├ server.js
 └ package.json
```

### API routes

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/products`
- `GET /api/products/:id`
- `GET /api/cart`
- `POST /api/cart`
- `DELETE /api/cart/:productId`
- `GET /api/orders`
- `POST /api/orders`

### Notes

- Services currently return mock data only (no real database queries).
- Code is prepared for later MySQL integration via placeholder files in `src/config` and `src/models`.

### Install and run

1. Open terminal in `backend`
2. Install dependencies:
   - `npm install`
3. Start the server:
   - `node server.js`
4. Server runs on:
   - `http://localhost:5000`