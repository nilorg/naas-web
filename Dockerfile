#build stage
FROM nilorg/node:15.3.0 AS builder
WORKDIR /src
COPY . .
RUN cnpm install
RUN cnpm run build

#final stage
FROM nginx:alpine
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories
RUN apk --no-cache add ca-certificates
RUN apk --no-cache add -U tzdata
ENV TZ Asia/Shanghai
COPY config/nginx-default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /src/dist /usr/share/nginx/html
EXPOSE 80
