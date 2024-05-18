FROM nginx:alpine

COPY script.js /usr/share/nginx/html/script.js
COPY index.html /usr/share/nginx/html/index.html

EXPOSE 80