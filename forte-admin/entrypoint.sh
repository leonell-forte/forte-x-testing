#!/bin/sh
echo $ENV_CONFIG | jq -r 'to_entries[] | "export \(.key)=\"\(.value)\""' > env_vars_secrets
set -o allexport
. ./env_vars_secrets
set +o allexport
npm start