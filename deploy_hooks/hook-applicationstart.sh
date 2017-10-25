#!/bin/bash

cd /var/www/html/cv-staff-app
npm start > stdout.txt 2 > stderr.txt &

cd /var/www/html/app-playground
npm start > stdout.txt 2 > stderr.txt &
