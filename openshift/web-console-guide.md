# OpenShift Web Console Deployment Guide

## Alternative: Deploy via Web Console (Windows-friendly)

Since you're on Windows and having tar permission issues, use the web console:

### Step 1: Access Web Console
1. Go to: https://console-openshift-console.apps.na46r.prod.ole.redhat.com
2. Login with:
   - Username: `RHT_OCP4_DEV_USERmrohun`
   - Password: `RHT_OCP4_DEV_PASSWORD2a4ae2d02d5640c18e04`

### Step 2: Create Project
1. Click **"Create Project"**
2. Name: `ecovista`
3. Click **"Create"**

### Step 3: Switch to Developer View
1. Click the dropdown in top-left (should say "Administrator")
2. Select **"Developer"**

### Step 4: Deploy MySQL First
1. Click **"+Add"** → **"YAML"**
2. Copy and paste the contents of `openshift/secrets.yaml`
3. Click **"Create"**
4. Repeat for `openshift/mysql-configmap.yaml`
5. Repeat for `openshift/mysql-deployment.yaml`

### Step 5: Deploy Backend Services
1. Click **"+Add"** → **"Import from Git"**
2. Git Repo URL: `https://github.com/yourusername/ecovista.git` (your repo)
3. Context Dir: `backend/flask_app/auth-service`
4. Application Name: `ecovista`
5. Name: `auth-service`
6. Click **"Create"**

Repeat for each service:
- `backend/flask_app/activity-service` → `activity-service`
- `backend/flask_app/destination-service` → `destination-service`
- `backend/flask_app/review-service` → `review-service`
- `backend/flask_app/travelgroup-service` → `travelgroup-service`
- `backend/flask_app/user-service` → `user-service`
- `frontend/frontend` → `frontend`

### Step 6: Add Environment Variables
For each backend service:
1. Click on the service in Topology view
2. Go to **"Environment"** tab
3. Add:
   - `MYSQL_HOST` = `mysql`
   - `MYSQL_ROOT_PASSWORD` = `Gilmore2003*`
   - `SECRET_KEY` = `11062003`

### Step 7: Create Routes
1. Click on each service
2. Click **"Create Route"**
3. Accept defaults and click **"Create"**

### Step 8: Access Application
1. Click on the frontend route URL
2. Your app should be accessible!