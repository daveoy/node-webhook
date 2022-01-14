#!/bin/bash
/usr/local/bin/r10k -c /r10k.yaml deploy environment mill2d --puppetfile
/usr/local/bin/r10k -c /r10k.yaml deploy environment mill3d --puppetfile
/usr/local/bin/r10k -c /r10k.yaml deploy environment tcs --puppetfile
/usr/local/bin/r10k -c /r10k.yaml deploy environment windows --puppetfile
/usr/local/bin/r10k -c /r10k.yaml deploy environment servers --puppetfile
/usr/local/bin/r10k -c /r10k.yaml deploy environment production --puppetfile
echo "starting server"
cd /app
node /app/api/api.js
echo "ending server"
