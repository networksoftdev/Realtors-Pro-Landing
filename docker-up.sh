#!/bin/sh
# Enable BuildKit and run docker compose up with build
export DOCKER_BUILDKIT=1
docker-compose up --build "$@"

