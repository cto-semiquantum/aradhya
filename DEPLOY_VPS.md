# 🚀 VPS Deployment Guide for Harsh & Aradhya App

Aapke app me dedicated **Node.js + Socket.io + Web-Push (VAPID)** backend engine setup ho chuka hai!

---

## 🛠️ Step-by-Step VPS Setup (Ubuntu / Debian / CentOS)

### 1. Node.js Install Karein (agar pehle se nahi hai):
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs git
```

### 2. Repository Clone & Dependencies Install:
```bash
git clone https://github.com/cto-semiquantum/aradhya.git
cd aradhya
npm install
```

### 3. PM2 Process Manager Start Karein (24/7 background run ke liye):
```bash
sudo npm install -g pm2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 4. NGINX Reverse Proxy & SSL (Recommended):
```nginx
server {
    server_name your-domain.com; # (ya aapka VPS IP)

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

SSL Certificate ke liye:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## ✨ Features Active on VPS:
- ⚡ **Instant < 50ms WebSockets Sync**
- 🔔 **Native VAPID Web Push (Google FCM / Apple APNS)**
- 🔒 **Private JSON Database in `./data/`**
- 🎙️ **Voice Notes, Heartbeats, Diaries & Mood Ring fully connected!**
