#!/bin/bash

echo "shutdown docker-compose.test.yaml without removing volumn"

docker-compose -f docker-compose.test.yaml down -v || true

echo "turn up the docker-compose.test.yaml with build"

docker-compose -f docker-compose.test.yaml up -d --build

docker ps

echo "Showing logs for container : alon_backend_test"

docker logs -f alon_backend_test

exit 0
