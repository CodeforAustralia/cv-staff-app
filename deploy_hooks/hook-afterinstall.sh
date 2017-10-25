#!/bin/bash

cd /var/www/html/cv-staff-app
npm install
pkill -9 node

cd /var/www/html/app-playground
rm stdout.txt
rm stderr.txt
