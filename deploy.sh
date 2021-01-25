#!/bin/bash
yarn install;
yarn build;
pm2 start yarn --name "nextjs" --watch --interpreter bash -- start -p 3010;