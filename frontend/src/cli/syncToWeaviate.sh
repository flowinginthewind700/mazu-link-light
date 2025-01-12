#!/bin/bash

# 解析参数
if [ "$1" == "--id" ] && [ -n "$2" ]; then
  # 同步单条数据
  sudo docker exec -it mazu-link-light-mazu_link_light_frontend-1 node /app/src/scripts/syncToWeaviate.js --id "$2"
elif [ "$1" == "--all" ]; then
  # 同步所有数据
  sudo docker exec -it mazu-link-light-mazu_link_light_frontend-1 node /app/src/scripts/syncToWeaviate.js --all
else
  # 显示帮助信息
  echo "Usage:"
  echo "  ./syncToWeaviate.sh --id <id>        Sync a single Agitool by ID"
  echo "  ./syncToWeaviate.sh --all            Sync all Agitools"
  exit 1
fi