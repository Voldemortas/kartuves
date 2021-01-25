#!/bin/bash
yarn install;
yarn build;
pm2 start yarn --name "kartuves" --watch --interpreter bash -- start -p 3011;