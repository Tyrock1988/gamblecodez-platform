# 🚀 GambleCodez Deployment Guide

## Quick Deployment Steps

### 1. Package for Deployment
```bash
./package-deployment.sh
```
This creates `gamblecodez-deployment.tar.gz` with all necessary files.

### 2. Upload to Your Server
```bash
scp gamblecodez-deployment.tar.gz user@your-server.com:/home/user/
```

### 3. Extract and Deploy
```bash
ssh user@your-server.com
tar -xzf gamblecodez-deployment.tar.gz
cd gamblecodez-deployment
./deploy.sh
```

## Environment Configuration

### Required Environment Variables
```env
DATABASE_URL="postgresql://user:pass@host:5432/gamblecodez"
REPLIT_DOMAINS="your-domain.com"
REPL_ID="your-repl-id"
SESSION_SECRET="your-random-secret"
NODE_ENV="production"
PORT=3000
```

### Replit Auth Setup
1. Go to [Replit Console](https://replit.com/account)
2. Create OAuth application
3. Set redirect URL: `https://your-domain.com/api/callback`
4. Copy REPL_ID to .env file

## Server Requirements

### Minimum Specifications
- **CPU**: 1 core
- **RAM**: 512MB
- **Storage**: 2GB
- **OS**: Ubuntu 20.04+ / CentOS 8+
- **Node.js**: 18+
- **PostgreSQL**: 13+

### Recommended Specifications
- **CPU**: 2 cores
- **RAM**: 2GB
- **Storage**: 10GB SSD
- **Bandwidth**: Unlimited

## Deployment Options

### Option 1: Traditional VPS
1. Install Node.js 20+
2. Install PostgreSQL
3. Configure nginx reverse proxy
4. Use PM2 for process management

### Option 2: Docker Deployment
```bash
docker-compose up -d
```

### Option 3: Fly.io
```bash
fly launch
fly deploy
```

## Security Checklist

- [ ] SSL certificate installed
- [ ] Firewall configured (allow 80, 443, 22 only)
- [ ] Strong database passwords
- [ ] Session secret is random and secure
- [ ] Regular backups configured
- [ ] Server updates enabled

## Performance Optimization

### nginx Configuration
- Enable gzip compression
- Set proper cache headers
- Configure rate limiting
- Enable HTTP/2

### Database Optimization
- Configure connection pooling
- Set up read replicas if needed
- Regular VACUUM and ANALYZE
- Monitor query performance

## Monitoring & Maintenance

### Log Files
- Application: PM2 logs
- Web server: nginx access/error logs
- Database: PostgreSQL logs

### Health Checks
- Application endpoint: `/api/health`
- Database connectivity
- SSL certificate expiry
- Disk space usage

### Backup Strategy
```bash
# Database backup
pg_dump gamblecodez > backup_$(date +%Y%m%d_%H%M%S).sql

# File backup
tar -czf files_backup_$(date +%Y%m%d_%H%M%S).tar.gz /path/to/app
```

## Troubleshooting

### Common Issues

**Port 3000 already in use**
```bash
sudo lsof -i :3000
sudo kill -9 <PID>
```

**Database connection failed**
```bash
# Check PostgreSQL status
sudo systemctl status postgresql
sudo systemctl start postgresql
```

**Permission denied**
```bash
# Fix file permissions
chmod +x deploy.sh
chown -R www-data:www-data /path/to/app
```

**SSL certificate issues**
```bash
# Using Let's Encrypt
sudo certbot --nginx -d your-domain.com
```

### Performance Issues

**High memory usage**
- Check for memory leaks in logs
- Restart application: `pm2 restart gamblecodez`
- Monitor with: `pm2 monit`

**Slow database queries**
- Enable query logging in PostgreSQL
- Analyze slow queries
- Add database indexes if needed

## Scaling Considerations

### Horizontal Scaling
- Load balancer (nginx/HAProxy)
- Multiple app instances
- Shared session storage (Redis)
- CDN for static assets

### Vertical Scaling
- Increase server resources
- Optimize database configuration
- Enable caching layers

## Support & Maintenance

### Regular Tasks
- Monitor error logs daily
- Update dependencies monthly
- Database maintenance weekly
- Security updates immediately

### Emergency Procedures
1. Application crash: PM2 auto-restart
2. Database issues: Restore from backup
3. Security breach: Rotate secrets immediately
4. High traffic: Scale horizontally

---

For additional support, check the main README.md file or create an issue in the repository.