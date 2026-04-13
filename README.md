# se_project — Ứng dụng thương mại điện tử (full-stack)

Dự án gồm **backend REST API** (Node.js + Express + Prisma + MySQL) và **frontend** (React), hỗ trợ đăng ký/đăng nhập, xem sản phẩm, **tìm kiếm và lọc theo khoảng giá**, **đánh giá sản phẩm**, giỏ hàng theo từng người dùng, **checkout tạo đơn hàng** và **xem lịch sử đơn** (lưu MySQL).

## Công nghệ

| Thành phần | Công nghệ |
|------------|-----------|
| Backend | Node.js, Express, Prisma ORM, MySQL |
| Xác thực | JWT (`jsonwebtoken`), bcrypt (luồng `/api/auth` và các route cần `authenticate`) |
| Frontend | React 18, React Router 6, Axios, Create React App |

## Cấu trúc thư mục

```
se_project/
├── backend/                 # API, cổng mặc định 5000
│   ├── server.js            # Khởi động server, load env
│   ├── prisma/
│   │   ├── schema.prisma    # User, Product, Review, CartItem, Order, OrderItem
│   │   ├── seed.js          # Sản phẩm mẫu + (tùy chọn) review demo cho user đầu tiên
│   │   └── migrations/
│   └── src/
│       ├── app.js           # Express app, mount routes
│       ├── config/          # env
│       ├── controllers/
│       ├── routes/          # auth, users, products, cart, orders, reviews
│       ├── services/        # Logic nghiệp vụ + Prisma
│       ├── middleware/      # errorHandler
│       ├── middlewares/     # JWT authenticate
│       └── prisma/          # prismaClient
├── frontend/                # CRA, cổng mặc định 3000
│   └── src/
│       ├── pages/
│       ├── components/      # SearchBar, PriceFilter, ReviewForm, ReviewList, StarRating, ...
│       ├── context/         # AuthContext
│       ├── routes/
│       └── services/        # api.js (Axios + Bearer token)
├── cursor_context.md        # Ghi chú ngắn cho dự án
└── README.md
```

## Mô hình dữ liệu (Prisma)

- **User** — email (unique), password (hash khi tạo qua `/api/auth/register`), tên, quan hệ tới giỏ, đơn hàng và đánh giá.
- **Product** — tên, mô tả, giá, `imageUrl`; quan hệ tới giỏ, dòng đơn và review.
- **Review** — `userId`, `productId`, `rating` (1–5), `comment` (tùy chọn); cascade khi xóa user/product.
- **CartItem** — `userId` + `productId` (unique), `quantity`; xóa user/product cascade.
- **Order** — `userId`, `total`, `status` (mặc định `pending`), thời gian tạo; quan hệ `OrderItem`.
- **OrderItem** — thuộc một đơn, `productId`, `quantity`, `price` (snapshot giá lúc checkout).

**Ghi chú:** Trong `src/models/` có file `OrderModel.js` rỗng (legacy), **không** dùng trong luồng đơn hàng hiện tại — đơn dùng Prisma (`orderService`).

## Seed (`prisma/seed.js`)

- Xóa và tạo lại bộ sản phẩm demo (nhiều mặt hàng).
- Nếu đã có ít nhất một user trong DB, seed thêm vài **review** demo gắn với user đầu tiên; nếu chưa có user thì bỏ qua bước này (đăng ký user rồi chạy lại seed nếu cần).

## Yêu cầu môi trường

- Node.js (khuyến nghị LTS)
- MySQL (server đã chạy, đã tạo database, ví dụ `se_project`)
- npm

## Cấu hình backend

1. Vào thư mục `backend`, sao chép env mẫu:

   ```bash
   cp .env.example .env
   ```

   Trên Windows (PowerShell) có thể dùng: `Copy-Item .env.example .env`

2. Chỉnh `backend/.env`:

   - `DATABASE_URL` — chuỗi kết nối MySQL cho Prisma (ký tự đặc biệt trong mật khẩu cần **URL-encode**).
   - `JWT_SECRET` — chuỗi bí mật ký JWT (production nên dùng giá trị ngẫu nhiên dài).

Ứng dụng load **luôn** file `backend/.env` (đường dẫn tuyệt đối trong code), kể cả khi chạy lệnh từ thư mục khác.

## Chạy backend

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run db:seed
npm start
```

- Server: `http://localhost:5000`
- Kiểm tra API + DB: `GET http://localhost:5000/api/health` (trả `ok: true` và `database: "connected"` khi MySQL kết nối được).

**Script hữu ích** (xem `package.json`):

| Script | Mô tả |
|--------|--------|
| `npm start` | Chạy `node server.js` |
| `npm run prisma:generate` | `prisma generate` (có load `.env`) |
| `npm run prisma:migrate` | `prisma migrate dev` |
| `npm run prisma:studio` | Prisma Studio |
| `npm run db:seed` | Chạy `prisma/seed.js` |
| `npm run db:list-users` | Liệt kê user (script tiện ích) |

## Chạy frontend

```bash
cd frontend
npm install
npm start
```

- Ứng dụng: `http://localhost:3000`
- Trong development, `package.json` có `"proxy": "http://127.0.0.1:5000"` — request tới `/api` được chuyển sang backend. Có thể đặt `REACT_APP_API_URL` nếu cần base URL khác.

## API — tổng quan

### Gốc

| Phương thức | Đường dẫn | Mô tả |
|-------------|-----------|--------|
| GET | `/` | Thông báo API đang chạy |
| GET | `/api/health` | Kiểm tra kết nối CSDL |

### Auth — `/api/auth` (dữ liệu thật, MySQL)

| Phương thức | Đường dẫn | Mô tả |
|-------------|-----------|--------|
| POST | `/api/auth/register` | Đăng ký; mật khẩu **hash bcrypt**; body: `name`, `email`, `password` (tối thiểu 8 ký tự) |
| POST | `/api/auth/login` | Đăng nhập; trả `token` (JWT) và `user` |

### Người dùng — `/api/users` (dữ liệu thật, MySQL)

| Phương thức | Đường dẫn | Mô tả |
|-------------|-----------|--------|
| POST | `/api/users` | Tạo user; body: `email`, `password`, `name` — **mật khẩu lưu như gửi lên (không hash như `/api/auth/register`)** |
| GET | `/api/users` | Danh sách user (không có password trong response select) |
| GET | `/api/users/:id` | Chi tiết user theo id |

**Bảo mật:** Các route `/api/users` **không** bắt buộc JWT trong code hiện tại; chỉ dùng cho môi trường dev / admin nếu bạn tự bảo vệ (reverse proxy, firewall, v.v.).

### Sản phẩm — `/api/products` (dữ liệu thật, MySQL)

Nhiều endpoint trả object sản phẩm kèm **`averageRating`** và **`reviewCount`** (tính từ bảng Review).

| Phương thức | Đường dẫn | Mô tả |
|-------------|-----------|--------|
| GET | `/api/products/sort/price` | Sắp xếp theo giá; query `order=asc` hoặc `order=desc` |
| GET | `/api/products/search` | Tìm theo tên; query bắt buộc `q` |
| GET | `/api/products/filter` | Lọc theo khoảng giá; query `min`, `max` (số, `min` ≤ `max`, không âm) |
| GET | `/api/products` | Danh sách sản phẩm |
| POST | `/api/products` | Tạo sản phẩm (`name`, `price`, tùy chọn `description`, `imageUrl`) |
| GET | `/api/products/:id` | Chi tiết theo id |

### Giỏ hàng — `/api/cart` (dữ liệu thật, MySQL)

**Bắt buộc header:** `Authorization: Bearer <token>` (JWT từ login).

| Phương thức | Đường dẫn | Mô tả |
|-------------|-----------|--------|
| GET | `/api/cart` | Giỏ của user đăng nhập |
| POST | `/api/cart/add` | Thêm/cộng dồn; body: `productId`, tùy chọn `quantity` |
| DELETE | `/api/cart/remove/:id` | Xóa dòng giỏ theo **id của CartItem** (không phải `productId`) |

### Đơn hàng — `/api/orders` (dữ liệu thật, MySQL)

**Bắt buộc header:** `Authorization: Bearer <token>`.

| Phương thức | Đường dẫn | Mô tả |
|-------------|-----------|--------|
| POST | `/api/orders/checkout` | Tạo đơn từ toàn bộ giỏ: tính `total`, lưu `Order` + `OrderItem` (giá từng dòng snapshot), **xóa giỏ** sau khi thành công; lỗi 400 nếu giỏ rỗng |
| GET | `/api/orders/my` | Danh sách đơn của user (kèm `items` và thông tin `product`) |

### Đánh giá — `/api/reviews` (dữ liệu thật, MySQL)

| Phương thức | Đường dẫn | Mô tả |
|-------------|-----------|--------|
| GET | `/api/reviews/:productId` | Danh sách review của sản phẩm + `averageRating` tổng hợp; không cần JWT |
| POST | `/api/reviews` | Tạo review; **JWT**; body: `productId`, `rating` (1–5), tùy chọn `comment` |

## Frontend — trang và luồng

- `/` — Trang chủ  
- `/products` — Danh sách; **tìm kiếm**, **lọc khoảng giá**, sắp xếp theo giá  
- `/product/:id` — Chi tiết; **danh sách đánh giá** và form gửi review (khi đã đăng nhập)  
- `/cart` — Giỏ (cần đăng nhập để API hoạt động)  
- `/checkout` — Đặt hàng từ giỏ (cần đăng nhập)  
- `/orders` — Lịch sử đơn của user (cần đăng nhập)  
- `/login`, `/register` — Auth; token lưu `localStorage`, Axios gửi kèm mọi request tới `/api`.

## Trạng thái triển khai (đúng với code hiện tại)

- **Đã tích hợp MySQL + Prisma:** auth (bcrypt + JWT), users, sản phẩm (kèm aggregate rating), tìm kiếm/lọc giá, giỏ hàng, **đơn hàng (checkout + danh sách)**, **review**.
- README trước đây mô tả đơn hàng là mock trong RAM — **không còn đúng**; đơn và review đều persist qua Prisma.

---

Nếu cần mở rộng: bảo vệ `/api/users`, thống nhất một luồng tạo user (chỉ hash qua auth hoặc service dùng chung), và dọn file legacy `OrderModel.js` nếu không còn dùng.
