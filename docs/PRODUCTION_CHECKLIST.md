# Centre3 Production Checklist

- [ ] Change default passwords
- [ ] Set DATABASE_URL (prod)
- [ ] Set JWT_SECRET + JWT_EXPIRES_IN
- [ ] Set CORS_ORIGIN to your domain
- [ ] Configure UPLOAD_DIR on persistent volume
- [ ] Enable backups for DB and uploads
- [ ] Run smoke tests: login, submit, approve, lock zone, export report
