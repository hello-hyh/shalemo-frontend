# 构建阶段
FROM node:22-alpine as builder
WORKDIR /app

# 先复制package.json和package-lock.json（利用Docker缓存）
COPY package*.json ./

RUN npm install
# 再复制源代码（这样依赖不变时不会重新安装）
COPY . .
RUN npm run build


# 运行阶段
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
    