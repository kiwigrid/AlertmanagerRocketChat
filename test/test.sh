#!/bin/sh

#
# set env WEBHOOK or replace $WEBHOOK with your webook, eg. https://rocketchat.hosted.at/hooks/url/token
#

curl -H 'Content-Type: application/json' --data-binary '@test.json' $WEBHOOK
