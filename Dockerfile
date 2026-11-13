FROM nginx:alpine

# Копируем все файлы проекта в стандартную директорию веб-сервера Nginx
COPY . /usr/share/nginx/html

# Удаляем служебные файлы, чтобы не отдавать их наружу
RUN rm -rf /usr/share/nginx/html/Dockerfile \
           /usr/share/nginx/html/docker-compose.yml \
           /usr/share/nginx/html/.git \
           /usr/share/nginx/html/.gitignore

EXPOSE 80
