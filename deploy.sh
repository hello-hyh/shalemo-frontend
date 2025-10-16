#!/bin/bash
GREEN='\033[32m'
RED='\033[31m'
RESET='\033[0m'

echo -e "开始上传投标"

# 检查dist目录
if [ ! -d "dist" ]; then
  echo "dist目录不存在"
  exit 1
fi

sshpass -p "u9TIOjbq" scp -r dist/* root@14.103.128.23:/mnt/signoz-data/new-bid-frontend

if [ $? -eq 0 ]; then
  echo -e "${GREEN}上传 成功"
else
  echo -e "${RED}上传 失败${RESET}"
fi
