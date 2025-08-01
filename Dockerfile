FROM httpd:latest
COPY . /usr/local/apache2/htdocs/
WORKDIR /usr/local/apache2/htdocs/
RUN chmod -R 777 /usr/local/apache2