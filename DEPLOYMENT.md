# Deployment Guide for Ride-Sharing App

## Render Deployment

### Prerequisites
1. A Render account
2. MongoDB database (can be MongoDB Atlas)
3. Environment variables configured

### Steps to Deploy

1. **Connect your GitHub repository to Render**
   - Go to Render dashboard
   - Click "New +" and select "Web Service"
   - Connect your GitHub repository

2. **Configure the service**
   - **Name**: ride-sharing-backend
   - **Environment**: Node
   - **Build Command**: `cd Backend && npm install`
   - **Start Command**: `cd Backend && npm start`

3. **Set Environment Variables**
   Add the following environment variables in Render dashboard:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A secure random string for JWT signing
   - `PORT`: 4000 (or let Render set it automatically)
   - `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
   - `CLOUDINARY_API_KEY`: Your Cloudinary API key
   - `CLOUDINARY_API_SECRET`: Your Cloudinary API secret
   - `CLOUDINARY_URL`: Your Cloudinary URL
   - `STRIPE_SECRET_KEY`: Your Stripe secret key
   - `STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key
   - `TWILIO_ACCOUNT_SID`: Your Twilio account SID
   - `TWILIO_AUTH_TOKEN`: Your Twilio auth token
   - `TWILIO_PHONE_NUMBER`: Your Twilio phone number
   - `TWILIO_API_KEY`: Your Twilio API key
   - `TWILIO_API_SECRET`: Your Twilio API secret
   - `TWILIO_TWIML_APP_SID`: Your Twilio TwiML app SID
   - `GOOGLE_MAPS_API_KEY`: Your Google Maps API key
   - `BASE_URL`: Your application URL (e.g., https://your-app-name.onrender.com)

4. **Deploy**
   - Click "Create Web Service"
   - Render will automatically build and deploy your application

### Troubleshooting

If you encounter the "Cannot find module 'dotenv'" error:
1. Make sure the build command is set to `cd Backend && npm install`
2. Verify that all dependencies are listed in `Backend/package.json`
3. Check that the start command is `cd Backend && npm start`

### Environment Variables Reference

See `Backend/env.example` for a complete list of required environment variables. 