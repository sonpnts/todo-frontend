# ReactJS Project

## Mô tả tả Project

Project này là một ứng dụng web được phát triển bằng ReactJS. Dùng để quản lý các nhiệm vụ cần làm.

## Yêu cầu

- Node.js >= 22.11.0
- npm >= 10.9.0 (hoặc yarn/pnpm)

## Cài đặt

Clone repo về local:

```sh
git clone https://github.com/sonpnts/todo-frontend/
cd todo-frontend
```

Cài đặt package:

```sh
npm install
# Hoặc dùng yarn
# yarn install
```

## Chạy project local

Khởi chạy server dev:

```sh
npm start
# Hoặc dùng yarn
# yarn start
```

Truy cập ứng dụng tại: `http://localhost:3000`

## Build project

Tạo bản build production:

```sh
npm run build
# Hoặc dùng yarn
# yarn build
```

Output sẽ nằm trong thư mục `build/`.

## Triển khai lên Vercel

1. Cầi đặt Vercel CLI (nếu chưa có):
   ```sh
   npm install -g vercel
   ```
2. Đăng nhập Vercel:
   ```sh
   vercel login
   ```
3. Deploy project:
   ```sh
   vercel
   ```
   Làm theo hướng dẫn trên màn hình để cấu hình project.

Sau khi deploy thành công, Vercel sẽ cung cấp link để truy cập ứng dụng.

--

****
