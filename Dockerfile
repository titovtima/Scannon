FROM nginx

MAINTAINER Yuri Trukhin "trukhinyuri@infoboxcloud.com"

COPY config/nginx.conf /etc/nginx/nginx.conf
COPY . /usr/share/nginx/html