docker run --rm -v ambiente_n8n-ia:/volume -v %CD%/volume:/backup busybox sh -c "cd /volume && tar xzvf /backup/ambiente_n8n-ia.tar.gz"
docker run --rm -v ambiente_postgres-db:/volume -v %CD%/volume:/backup busybox sh -c "cd /volume && tar xzvf /backup/ambiente_postgres-db.tar.gz"
