# se_project — Ứng dụng thương mại điện tử (full-stack)

Dự án gồm **backend REST API** (Node.js + Express + Prisma + MySQL) và **frontend** (React), hỗ trợ đăng ký/đăng nhập, xem sản phẩm, sắp xếp theo giá và quản lý giỏ hàng theo từng người dùng.

## Công nghệ

| Thành phần | Công nghệ |
|------------|-----------|
| Backend | Node.js, Express, Prisma ORM, MySQL |
| Xác thực | JWT (`jsonwebtoken`), bcrypt (chỉ luồng `/api/auth`) |
| Frontend | React 18, React Router 6, Axios, Create React App |

## Cấu trúc thư mục

```
se_project/
├── backend/                 # API, cổng mặc định 5000
│   ├── server.js            # Khởi động server, load env
│   ├── prisma/
│   │   ├── schema.prisma    # User, Product, CartItem
│   │   ├── seed.js          # Dữ liệu sản phẩm mẫu
│   │   └── migrations/
│   └── src/
│       ├── app.js           # Express app, mount routes
│       ├── config/          # env, (db placeholder legacy)
│       ├── controllers/
│       ├── routes/
│       ├── services/        # Logic nghiệp vụ + Prisma
│       ├── middleware/      # errorHandler
│       ├── middlewares/     # JWT authenticate
│       └── prisma/          # prismaClient
├── frontend/                # CRA, cổng mặc định 3000
│   └── src/
│       ├── pages/
│       ├── components/
│       ├── context/         # AuthContext
│       ├── routes/
│       └── services/        # api.js (Axios + Bearer token)
├── cursor_context.md        # Ghi chú ngắn cho dự án
└── README.md
```

## Mô hình dữ liệu (Prisma)

- **User** — email (unique), password (hash khi tạo qua `/api/auth/register`), tên, quan hệ tới giỏ.
- **Product** — tên, mô tả, giá, `imageUrl`.
- **CartItem** — `userId` + `productId` (unique), `quantity`; xóa user/product cascade.

**Lưu ý:** Không có bảng **Order** trong schema. API `/api/orders` hiện dùng **dữ liệu giả trong bộ nhớ** (mock), không lưu MySQL.

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
- Kiểm tra API + DB: `GET http://localhost:5000/api/health` (trả `ok: true` khi MySQL kết nối được).

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

| Phương thức | Đường dẫn | Mô tả |
|-------------|-----------|--------|
| GET | `/api/products/sort/price` | Sắp xếp theo giá; query `order=asc` hoặc `order=desc` |
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

### Đơn hàng — `/api/orders` (**mock trong RAM**)

| Phương thức | Đường dẫn | Mô tả |
|-------------|-----------|--------|
| GET | `/api/orders` | Trả danh sách đơn giả |
| POST | `/api/orders` | Thêm đơn vào mảng trong bộ nhớ; **không** persist DB |

## Frontend — trang và luồng

- `/` — Trang chủ  
- `/products` — Danh sách + sắp xếp giá  
- `/products/:id` — Chi tiết  
- `/cart` — Giỏ (cần đăng nhập để API hoạt động)  
- `/login`, `/register` — Auth; token lưu `localStorage`, Axios gửi kèm mọi request tới `/api`.

## Trạng thái triển khai (đúng với code hiện tại)

- **Đã tích hợp MySQL + Prisma:** đăng ký/đăng nhập (bcrypt + JWT), sản phẩm, giỏ hàng, CRUD user qua `/api/users`.
- **Chưa tích hợp DB:** đơn hàng (`orderService` mock); `OrderModel` là placeholder.
- README trước đây mô tả “toàn mock” — **không còn đúng**; phần lớn nghiệp vụ chính đã dùng CSDL.

---

Nếu cần mở rộng: thêm model Order + migration, bảo vệ `/api/users`, và thống nhất một luồng tạo user (chỉ hash qua auth hoặc service dùng chung).
