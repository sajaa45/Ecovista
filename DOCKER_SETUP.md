# Docker Setup Guide

## What Was Fixed

### Database Issues
1. **Updated schema.sql**: Added missing tables (Activities, TravelGroups) to match SQLAlchemy models
2. **MySQL Health Check**: Added health checks with longer wait times (20 retries, 30s start period)
3. **Table Creation**: Each service runs `db.create_all()` on startup
4. **Model Imports**: Imported models in each service so SQLAlchemy can discover tables
5. **Restart Policies**: Added `restart: on-failure` so services retry if MySQL isn't ready

### Authentication Issues (401 Errors)
6. **SECRET_KEY Environment Variable**: Added SECRET_KEY to all backend services in docker-compose.yml
7. **Fixed .env format**: Removed spaces around `=` in SECRET_KEY definition

## Current Architecture

Your app uses a **hybrid authentication approach**:
- **Backend sets httpOnly cookies** (secure, can't be read by JavaScript)
- **Frontend reads token from response** and stores in js-cookie
- **Frontend sends token in Authorization header** for API calls

This is working correctly! The backend checks both:
- `Authorization: Bearer <token>` header (for frontend API calls)
- `jwt` cookie (for server-side requests)

## How to Run

### 1. Stop and Clean Up
```bash
docker-compose down -v
```

### 2. Rebuild and Start
```bash
docker-compose up --build
```

### 3. Verify All Services Are Running
Wait for all services to show "Running on http://0.0.0.0:5001" messages:
- auth-service (port 5001)
- activity-service (port 5002)
- destination-service (port 5003)
- review-service (port 5004)
- travelgroup-service (port 5005)
- user-service (port 5006)
- frontend (port 3000)

## Troubleshooting

### 401 Unauthorized Errors
- **Check browser console** for the JWT token
- **Verify you're logged in** - token should be in cookies
- **Check network tab** - Authorization header should have `Bearer <token>`
- **Restart services** if SECRET_KEY was missing before

### Page Navigation Not Working
This is likely a **React Router** issue, not authentication:
- Check browser console for JavaScript errors
- Verify routes are defined in App.js
- Make sure you're using `<Link>` or `navigate()` not `<a href>`

### Services Still Failing to Start
```bash
# Check specific service logs
docker-compose logs activity-service
docker-compose logs mysql

# Verify environment variables
docker-compose exec activity-service env | grep SECRET_KEY
```

### Database Connection Issues
```bash
# Connect to MySQL and verify tables
docker-compose exec mysql mysql -uroot -p${MYSQL_ROOT_PASSWORD} ecovista -e "SHOW TABLES;"
```

## Environment Variables

Your `.env` file should have (no spaces around =):
```
SECRET_KEY=11062003
MYSQL_ROOT_PASSWORD=Gilmore2003*
```

## Next Steps

After restarting:
1. Go to http://localhost:3000
2. Login or sign up
3. Try creating an activity/destination
4. Check browser DevTools Network tab if issues persist

