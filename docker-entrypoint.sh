#!/bin/bash
/usr/local/bin/r10k -c /r10k.yaml deploy environment mill3d --puppetfile
/usr/local/bin/r10k -c /r10k.yaml deploy environment mill3d_ws --puppetfile
/usr/local/bin/r10k -c /r10k.yaml deploy environment mill3d_rb --puppetfile
/usr/local/bin/r10k -c /r10k.yaml deploy environment mill2d_ws --puppetfile
/usr/local/bin/r10k -c /r10k.yaml deploy environment mill2d_rb --puppetfile
/usr/local/bin/r10k -c /r10k.yaml deploy environment windows --puppetfile
/usr/local/bin/r10k -c /r10k.yaml deploy environment baselight --puppetfile
/usr/local/bin/r10k -c /r10k.yaml deploy environment production --puppetfile
echo "starting server"
cd /app
node /app/api/api.js
echo "ending server"
