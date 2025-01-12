#!/bin/bash

# 获取参数
ID="$1"
ALL="$2"

# 检查是否提供了 --id 或 --all 参数
if [ -n "$ID" ]; then
  # 同步单条数据
  sudo docker exec -it mazu-link-light-mazu_link_light_frontend-1 node /app/src/scripts/syncToWeaviate.js --id "$ID"
elif [ "$ALL" == "--all" ]; then
  # 同步所有数据
  sudo docker exec -it mazu-link-light-mazu_link_light_frontend-1 node /app/src/scripts/syncToWeaviate.js --all
else
  # 显示帮助信息
  echo "Usage:"
  echo "  ./sync.sh <id>        Sync a single Agitool by ID"
  echo "  ./sync.sh --all       Sync all Agitools"
  exit 1
fi