#!/bin/bash

cd /var/www/html/app-playground
npm install
pkill screen
killall -9 node
