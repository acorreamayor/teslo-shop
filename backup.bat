docker run --rm -v ambiente_postgres-db:/volume -v %CD%/volume:/backup busybox tar czvf /backup/ambiente_postgres-db.tar.gz -C /volume .
