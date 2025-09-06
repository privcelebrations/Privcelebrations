#!/bin/bash
cd ~/Privcelebrations/privcelebrations
git pull origin main
npm install
npm run build
pm2 restart privcelebrations
echo "Deployment complete!"

