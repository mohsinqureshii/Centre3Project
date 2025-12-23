If your repo already has a global error middleware, ensure it handles `ValidationError` like:
- return statusCode 400
- include `details` array
