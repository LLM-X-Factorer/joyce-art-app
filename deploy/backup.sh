#!/bin/sh
# 数据库与上传文件备份，保留 14 天。建议加入 crontab：
#   15 3 * * * cd /path/to/repo/deploy && ./backup.sh >> backups/backup.log 2>&1
set -eu
cd "$(dirname "$0")"
mkdir -p backups
stamp=$(date +%Y%m%d-%H%M%S)
docker compose exec -T postgres pg_dump -U common_room -Fc common_room > "backups/db-$stamp.dump"
docker compose exec -T server tar -czf - -C /data uploads > "backups/uploads-$stamp.tar.gz"
find backups -name 'db-*.dump' -mtime +14 -delete
find backups -name 'uploads-*.tar.gz' -mtime +14 -delete
echo "$stamp 备份完成"
