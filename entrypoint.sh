#!/bin/bash

echo ">> entrypoint called <<"

echo ">> migrations running <<"

exec npm run migrate-up

echo ">> server starting <<"

exec npm run start