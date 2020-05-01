#!/usr/bin/env bash

set -ex

rootPath=$(git rev-parse --show-toplevel)

if [[ "$1" == *pm2* ]]
then
    git pull

    npm run compile --prefix $rootPath/components/admin-back/
    npm run compile --prefix $rootPath/components/telegram-back

    pm2 restart all
fi
