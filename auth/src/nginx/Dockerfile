FROM nginx:latest



RUN apt-get update -y && apt-get upgrade -y
RUN apt-get install -y nginx openssl

RUN mkdir -p /etc/nginx/ssl
COPY ./nginx.conf /etc/nginx/nginx.conf



RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -out /etc/nginx/ssl/inception.crt \
    -keyout /etc/nginx/ssl/inception.key \
    -subj "/C=MO/ST=KH/L=Khouribga/O=42/OU=42/CN=localhost/UID=rlamlaik"

EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]