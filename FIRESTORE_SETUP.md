# Firestore Database Setup Guide

After deploying your portfolio, you need to configure Firestore to make your contact form and admin panel work properly.

## Step 1: Verify Firestore is Enabled

1. Go to: https://console.firebase.google.com
2. Select your project
3. Left sidebar → "Firestore Database"
4. If you don't see it, click "Create Database"

## Step 2: Create Collections (Optional - They Auto-Create)

Your collections will auto-create when data is submitted:
- **contacts** - Contact form submissions
- **blogs** - Blog posts from admin panel
- **projects** - Projects from admin panel

However, you can manually create them:

1. Click "Start Collection"
2. Enter collection name: `contacts`
3. Click "Next"
4. Click "Auto-ID" for document ID
5. Add a sample document (optional)
6. Repeat for `blogs` and `projects`

## Step 3: Configure Security Rules (CRITICAL)

Without proper rules, your contact form won't work!

1. Firebase Console → Firestore Database → "Rules" tab
2. Delete existing rules
3. Paste this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow anyone to read and write contacts
    match /contacts/{document=**} {
      allow read, write: if true;
    }
    
    // Allow anyone to read and write blogs
    match /blogs/{document=**} {
      allow read, write: if true;
    }
    
    // Allow anyone to read and write projects
    match /projects/{document=**} {
      allow read, write: if true;
    }
  }
}
```

4. Click "Publish"

## Step 4: Verify Settings

Make sure these settings are correct:

**Firestore Settings:**
- Region: Choose closest to you (e.g., us-central1, asia-south1)
- Multi-region: No (unless you want automatic backups)

**Database ID:** Default (_default)

## Step 5: Test Your Setup

After deploying your portfolio:

1. Visit: `https://your-project-id.web.app`
2. Fill the contact form
3. Click "Send Message"
4. Go to: Firebase Console → Firestore Database
5. Click "contacts" collection
6. You should see your submission!

If you don't see it:
- Check browser console (F12) for errors
- Verify firebase-config.js has correct credentials
- Check Firestore rules are published

## Step 6: Monitor Submissions

To see contact form submissions:

1. Firebase Console → Firestore Database
2. Click "contacts" collection
3. View all submissions with email, name, message, timestamp

## Step 7: Read Your Messages in Admin Panel

1. Deploy your site (firebase deploy)
2. Visit: `https://your-project-id.web.app/admin`
3. Login with password: `9122004`
4. Click "📧 Messages" in sidebar
5. All contact form submissions appear here!

## Data Structure

### contacts Collection
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Interested in your work",
  "message": "Hi, I loved your projects...",
  "timestamp": "2024-01-15T10:30:00Z",
  "read": false
}
```

### projects Collection
```json
{
  "name": "E-commerce Platform",
  "description": "Full-stack marketplace built with React and Node.js",
  "image": "https://...",
  "link": "https://...",
  "status": "Completed",
  "technologies": ["React", "Node.js", "MongoDB"],
  "date": "2024-01-15"
}
```

### blogs Collection
```json
{
  "title": "How to Build with Firebase",
  "excerpt": "A beginner's guide...",
  "content": "Firebase is a...",
  "category": "Web Development",
  "date": "2024-01-15",
  "tags": ["firebase", "web", "tutorial"]
}
```

## Backup Your Data

Enable automatic backups:

1. Firebase Console → Firestore Database → "Backups" tab
2. Click "Create Schedule"
3. Set backup frequency
4. Choose retention period

## Common Issues

### Issue: Contact form not submitting
**Solution:**
1. Check firestore rules are published
2. Check firebase-config.js has correct credentials
3. Check browser console (F12) for error messages

### Issue: No collections showing up
**Solution:**
1. Collections auto-create on first write
2. Try submitting a contact form
3. Wait 1-2 seconds, refresh

### Issue: Can't read data from admin panel
**Solution:**
1. Make sure you're logged in (password: 9122004)
2. Click "📧 Messages" section
3. If blank, no submissions exist yet
4. Try submitting a contact form first

### Issue: Permission errors
**Solution:**
1. Check Firestore rules are properly configured
2. Make sure you clicked "Publish" on rules
3. Wait 30 seconds for rules to propagate

## Pricing

Firestore free tier includes:
- ✅ 50,000 reads/day
- ✅ 20,000 writes/day
- ✅ 20,000 deletes/day
- ✅ 1 GB storage
- ✅ Unlimited concurrent connections

For most portfolios, this is MORE than enough!

## Next Steps

1. ✅ Deploy your site (firebase deploy)
2. ✅ Configure Firestore rules
3. ✅ Test contact form
4. ✅ Test admin panel
5. ✅ Start using!

Your portfolio is now fully functional! 🎉
