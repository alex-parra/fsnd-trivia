#! bin/bash

PG_PASS="PGPASSWORD=123456"
PG_CONN="$PG_PASS psql -h pg -U postgres"
DB_NAME="trivia"
DB_DROP="$PG_PASS dropdb -h pg -U postgres $DB_NAME"
DB_CREATE="$PG_PASS createdb -h pg -U postgres $DB_NAME"

flaskUp() {
  FLASK_APP=flaskr FLASK_ENV=development flask run
}

dbSeed() {
  docker-compose run pg bash -c "$DB_DROP"
  docker-compose run pg bash -c "$DB_CREATE && $PG_CONN $DB_NAME < trivia.psql"
}

case $1 in
  db-seed) dbSeed ;;
  dev) flaskUp ;;
  *) echo "What?" ;;
esac
