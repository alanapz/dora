#!/bin/bash

APP_ROOT="/dora-web"

set -euo pipefail

if [[ -z "${GIT_URL}" ]]
then
    echo "GIT_URL required"
    exit 1
fi

if [[ -z "${GIT_BRANCH}" ]]
then
    echo "GIT_BRANCH required"
    exit 1
fi

if [[ ! -d "${APP_ROOT}/.git" ]]
then
    git clone --branch "${GIT_BRANCH}" "${GIT_URL}" "${APP_ROOT}"
fi

cd "${APP_ROOT}"

git remote set-url origin "${GIT_URL}"
git fetch --prune --quiet
git reset --hard "origin/${GIT_BRANCH}" --quiet
git clean -ffddx -e "node_modules/"
git log HEAD -n1

if [[ ! -d "./node_modules" ]]
then
    echo "Installing dependencies, this may take a while"
    yarn install
fi

yarn install --prefer-offline --silent
ng serve --host 0.0.0.0 --disable-host-check --prod
