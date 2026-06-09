#!/bin/bash
set -e

# Initialize the database directory if it doesn't exist
if [ ! -d "/var/lib/mysql/mysql" ]; then
    echo "Initializing MariaDB data directory..."
    mariadb-install-db --user=mysql --ldata=/var/lib/mysql
fi

# Start MariaDB in the background
mysqld_safe --datadir=/var/lib/mysql &

# Wait for MariaDB to start
sleep 5

# Create database and user
mysql -u root <<-EOSQL
    CREATE DATABASE IF NOT EXISTS myapp;
    CREATE USER IF NOT EXISTS 'root'@'%' IDENTIFIED BY '1234';
    GRANT ALL PRIVILEGES ON myapp.* TO 'root'@'%';
    FLUSH PRIVILEGES;
EOSQL

# Keep container running
wait