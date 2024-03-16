FROM postgres

EXPOSE 5432

ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=123
ENV POSTGRES_DB=g-bitly

COPY create_database.sql /docker-entrypoint-initdb.d/

EXPOSE 5432
# docker build -t g-bitly . && docker run --name g-container -d -p 5432:5432 g-bitly