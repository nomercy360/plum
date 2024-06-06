pnpm run build
rsync -avz --compress-level=9 --partial --progress --inplace out/ root@185.244.50.122:/app/frontend
