#!/bin/bash
git push origin client
ssh pi@192.168.1.6 << EOF
  cd cloning-bay/ascii-ui;
  git pull origin client
  sudo reboot
EOF
