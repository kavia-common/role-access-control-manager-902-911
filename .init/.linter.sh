#!/bin/bash
cd /home/kavia/workspace/code-generation/role-access-control-manager-902-911/rbac_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

