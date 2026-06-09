FROM debian:bullseye


RUN apt-get update && apt-get install -y mariadb-server mariadb-client


COPY datainit.sh /usr/local/bin/setup.sh


RUN chmod +x /usr/local/bin/setup.sh


EXPOSE 3306


ENTRYPOINT ["/usr/local/bin/setup.sh"]
