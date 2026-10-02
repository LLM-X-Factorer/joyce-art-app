#!/bin/sh
# TLS=on（默认）使用 HTTPS 配置；TLS=off 仅监听 80（用于首次调试或前面已有 HTTPS 负载均衡）
set -e
mkdir -p /etc/nginx/templates
if [ "${TLS:-on}" = "off" ]; then
  cp /etc/nginx/variants/http.conf.template /etc/nginx/templates/default.conf.template
else
  cp /etc/nginx/variants/https.conf.template /etc/nginx/templates/default.conf.template
fi
