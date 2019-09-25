#!/bin/sh

rootPath=$(git rev-parse --show-toplevel)
git pull

npm run compile --prefix $rootPath/components/admin-back/
npm run compile --prefix $rootPath/components/telegram-back

pm2 restart all
