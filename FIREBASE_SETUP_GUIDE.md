# Firebase Contact Form Backend Setup Guide

## 🚀 Step 1: Set Up Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a new project"
3. Name it "Portfolio Contact Form"
4. Enable Google Analytics (optional)
5. Click "Create Project"

## 🔐 Step 2: Get Firebase Config

1. In Firebase Console, go to Project Settings (⚙️ icon)
2. Scroll to "Your apps" section
3. Click "</> Web" to create a web app
4. Copy the entire config object
5. Replace the placeholder values in `firebase-config.js`

## 📧 Step 3: Set Up Gmail for Sending Emails

### Option A: Using Gmail App Password (Recommended)
1. Enable 2-Factor Authentication on your Google account
2. Go to [Google Account Security](https://myaccount.google.com/security)
3. Click "App passwords"
4. Select "Mail" and "Windows Computer"
5. Copy the generated 16-character password
6. This is your `GMAIL_PASSWORD`

### Option B: Enable Less Secure App Access
1. Go to [Google Security](https://myaccount.google.com/lesssecureapps)
2. Toggle "Less secure app access" ON
3. Use your regular Gmail password

## ☁️ Step 4: Deploy Cloud Functions

### Prerequisites:
```bash
npm install -g firebase-tools
firebase login
```

### Create Functions Directory:
```bash
firebase init functions
cd functions
npm install nodemailer firebase-admin
```

### Add Environment Variables:
Create `.env.local` file in functions directory:
```
GMAIL_USER=shahilsinha2004@gmail.com
GMAIL_PASSWORD=your-app-password-here
```

### Deploy Function:
```bash
firebase deploy --only functions
```

## 🗄️ Step 5: Set Up Firestore Database

1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in production mode"
4. Select your region (closest to you)
5. Click "Create"

### Set Firestore Rules:
Go to Firestore → Rules and replace with:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /contacts/{document=**} {
      allow create: if request.resource.data.keys().hasAll(['name', 'email', 'subject', 'message']);
      allow read, write: if false;
    }
  }
}
```

Click "Publish"

## 📝 Step 6: Update Your Portfolio HTML

1. Add Firebase CDN before closing `</body>` tag
2. Add `firebase-config.js` file with your credentials
3. Update contact form submit handler

## ✅ Step 7: Test the Form

1. Open your portfolio.html in browser
2. Fill out the contact form
3. Submit
4. Check:
   - Firestore database for new entry
   - Your email inbox for notification
   - Sender's email for confirmation

## 🐛 Troubleshooting

**Email not sending?**
- Check GMAIL_USER and GMAIL_PASSWORD in .env.local
- Verify App Password or Less Secure Access is enabled
- Check Firebase Functions logs: `firebase functions:log`

**Form not submitting?**
- Open browser console (F12) for error messages
- Check Firebase config credentials
- Verify Firestore rules allow writes

**404 errors?**
- Check Firebase project ID in config
- Verify all CDN links are correct

## 🔗 Useful Links

- Firebase Docs: https://firebase.google.com/docs
- Cloud Functions: https://firebase.google.com/docs/functions
- Firestore: https://firebase.google.com/docs/firestore
- Nodemailer: https://nodemailer.com/
