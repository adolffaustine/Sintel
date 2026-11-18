# Sintel Technologies — Ubuntu VPS Deployment Guide

This guide walks you through hosting the Sintel site on your **Yatosha Ubuntu VPS** so it's reachable via a custom URL (e.g. `https://sintel.co.tz`).

## What this app is
- **Backend:** Express (Node.js) on port `4031`, PostgreSQL database, PM2 process manager.
- **Frontend:** React + Vite, built to `client/dist` and served by the same Express server.
- **Admin:** `https://yourdomain.com/admin` — add/edit projects, vision, mission, services, team, contact info, upload images, view contact submissions.
- **Images:** uploaded via Admin → stored in `client/dist/uploads` and served at `/uploads/...`.

## 1. Point your domain at the VPS
At your domain registrar/DNS host, create an **A record**:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | `@` | `<YOUR_VPS_IP>` | Automatic |
| A | `www` | `<YOUR_VPS_IP>` | Automatic |

Wait a few minutes for DNS to propagate.

## 2. Connect to your VPS
```bash
ssh root@<YOUR_VPS_IP>
# or: ssh ubuntu@<YOUR_VPS_IP>
```

## 3. Install system dependencies
Run these on the VPS (as root or a sudo user):
```bash
apt update && apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
apt install -y postgresql postgresql-contrib
apt install -y nginx pm2 certbot python3-certbot-nginx git build-essential curl ufw
```
Verify: `node -v`, `npm -v`, `psql --version`.

## 4. Create the PostgreSQL database & user
```bash
sudo -u postgres psql
```
Inside the `postgres` prompt:
```sql
CREATE DATABASE sintel;
CREATE USER sintel WITH PASSWORD 'STRONG_DB_PASSWORD_HERE';
GRANT ALL PRIVILEGES ON DATABASE sintel TO sintel;
\q
```
> Replace `STRONG_DB_PASSWORD_HERE`. Use it in `.env` as:
> `DATABASE_URL=postgresql://sintel:STRONG_DB_PASSWORD_HERE@localhost:5432/sintel`

## 5. Clone the repo & configure environment
```bash
mkdir -p /var/www
cd /var/www
git clone https://github.com/adolffaustine/Sintel.git sintel
cd sintel
cp .env.production.example .env
nano .env
```

Edit `.env` with your real values:
```env
DATABASE_URL=postgresql://sintel:STRONG_DB_PASSWORD_HERE@localhost:5432/sintel
PORT=4031
ADMIN_INITIAL_PASSWORD=CHANGE_ME_NOW
ALLOWED_ORIGIN=https://yourdomain.com
UPLOAD_MAX_SIZE_MB=10
NODE_ENV=production
```
Save (`Ctrl+O`, `Enter`) and exit (`Ctrl+X`).

## 6. Install dependencies & build
```bash
npm install --omit=dev
cd client
npm install
npm run build
cd ..
```
> `client/dist` is now produced. The Express server serves it automatically.

## 7. Start the app with PM2
```bash
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
# Run the printed systemd command to make PM2 survive reboots
```
Check: `pm2 status` and `pm2 logs sintel --lines 30 --nostream`. You should see `Sintel Technologies server listening on port 4031`.

Test the API directly:
```bash
curl http://localhost:4031/api/health
# → {"ok":true}
```

## 8. Configure nginx reverse proxy + SSL (Certbot)
```bash
nano /etc/nginx/sites-available/sintel
```
Paste (replace `yourdomain.com` with your real domain):
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    location /.well-known/acme-challenge/ { root /var/www/certbot; }
    location / { return 301 https://$host$request_uri; }
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;
    ssl_certificate     /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 1d;
    add_header Strict-Transport-Security "max-age=63072000" always;
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
    client_max_body_size 10m;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    location /uploads/ { proxy_pass http://127.0.0.1:4031; expires 30d; add_header Cache-Control "public, immutable"; }
    location /api { proxy_pass http://127.0.0.1:4031; }
    location / { proxy_pass http://127.0.0.1:4031; }
}
```
```bash
ln -sf /etc/nginx/sites-available/sintel /etc/nginx/sites-enabled/sintel
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx
certbot --nginx -d yourdomain.com -d www.yourdomain.com
certbot renew --dry-run
```
Follow Certbot prompts and choose HTTP→HTTPS redirect.

## 9. Open the firewall (ufw)
```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable

## 10. Open the site
Visit: **`https://yourdomain.com`**

Admin panel: **`https://yourdomain.com/admin`**
- Initial password: whatever you set as `ADMIN_INITIAL_PASSWORD` (default `sintel-admin-2026` if not set).
- **Change it immediately** after first login (Admin → Change password).

### Add / edit projects via Admin
1. Go to `/admin`, sign in.
2. Select **Projects** from the left menu.
3. Click **+ Add project** — fill name, tagline, description, features (one per line), impact, SDG numbers, status, category.
4. **Image:** In the Admin, use **📎 Upload Image** at the top to upload an image, copy the returned URL, and paste it into the project's **image URL** field. A preview shows below the field once set.
5. Click **Save all changes**. Your projects appear immediately on the homepage and `/projects`.

You can also edit Hero text, Vision/Mission, Values, Services, Team, SDGs, Focus Areas, Contact info, and Footer from the same admin panel — all changes are saved to PostgreSQL and reflected live on the site.

## 11. Updating the site later
```bash
cd /var/www/sintel
git pull origin main
npm install --omit=dev
cd client
npm install
npm run build
cd ..
pm2 reload ecosystem.config.js --env production
pm2 save
```

## 12. Useful commands
```bash
pm2 status                 # check app
pm2 logs sintel --lines 50 # view logs
pm2 restart sintel         # restart app
systemctl status nginx     # check nginx
certbot renew --dry-run    # test SSL renewal
sudo -u postgres psql -d sintel -c "\dt"   # list DB tables
```

## Troubleshooting
| Issue | Fix |
|-------|-----|
| Site won't load / 502 | `pm2 status` → ensure app online; `nginx -t`; `systemctl restart nginx` |
| Contact form fails | Confirm backend `/api/contact` works (`curl https://yourdomain.com/api/health`) and `.env` `ALLOWED_ORIGIN` matches your domain |
| Images broken | Uploads must be in `client/dist/uploads`; nginx `/uploads/` proxies to `:4031`; check folder permissions |
| Admin edits not showing | Public `GET /api/content` reads from PostgreSQL — confirm `DATABASE_URL` is correct and DB is running |
| Can't reach domain | DNS A record points to VPS IP; ufw allows 80/443 |

```
