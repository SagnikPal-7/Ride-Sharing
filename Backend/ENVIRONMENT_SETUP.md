# Environment Variables Setup

## Required Environment Variables

Create a `.env` file in the Backend directory with the following variables:

### Database Configuration
```
MONGODB_URI=mongodb://localhost:27017/ride-sharing
```

### JWT Secret
```
JWT_SECRET=your_jwt_secret_here
```

### Twilio Configuration
```
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

### Base URL for Webhooks
```
# For development (ngrok)
BASE_URL=https://your-ngrok-url.ngrok-free.app

# For production
BASE_URL=https://your-production-domain.com
```

### Google Maps API Key
```
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### Optional: Force Test Mode
```
# Set to 'true' to bypass Twilio and use test mode
FORCE_TEST_MODE=false
```

### Cloudinary Configuration (if using image uploads)
```
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## Frontend Environment Variables

Create a `.env` file in the Frontend directory:

```
# Backend URL for development
VITE_BACKEND_URL=http://localhost:4000

# For production, set this to your backend URL
# VITE_BACKEND_URL=https://your-backend-domain.com
```

## Important Notes

1. **BASE_URL**: This is used for Twilio webhooks. Must be accessible from the internet (use ngrok for development)
2. **Twilio Trial Accounts**: Phone numbers must be verified in Twilio console for trial accounts
3. **Environment Variables**: Never commit `.env` files to version control
4. **Production**: Update BASE_URL to your production domain when deploying 