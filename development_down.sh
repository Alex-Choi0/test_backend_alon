#!/bin/bash

echo "shutdown docker-compose.test.yaml without removing volumn"

docker-compose -f docker-compose.test.yaml down

exit 0
