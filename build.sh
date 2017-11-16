#!/bin/bash

ssh pi:blueberry@192.168.1.6 << EOF
  cd cloning-bay/ascii-ui;
  git pull origin master
  sudo reboot
EOF
