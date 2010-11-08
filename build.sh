#!/usr/bin/env bash

# Cleanup
rm hnewskey.xpi

contents=`find . -mindepth 1 | grep -v 'build\|DS_Store\|git'`
zip -r hnewskeys.xpi $contents
