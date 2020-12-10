#!/bin/bash

docker stop nilorg-naas-web
docker rm nilorg-naas-web
docker run -p 8800:80 -d --name nilorg-naas-web nilorg/naas-web:latest
