# Cloudflare Pages पर Deployment Guide

यह guide आपको step-by-step बताएगी कि अपनी Tools Website को Cloudflare Pages पर कैसे deploy करें।

## 📋 Prerequisites (पहले से जरूरी चीजें)

- ✅ GitHub account
- ✅ Cloudflare account (free)
- ✅ Git installed on your computer

---

## Step 1: GitHub Repository Setup

### Option A: अगर Repository Already है

अगर आपकी website already GitHub पर है, तो सीधे **Step 2** पर जाएं।

### Option B: नई Repository बनाएं

1. **GitHub पर जाएं**: https://github.com
2. **New Repository** button click करें
3. Repository details भरें:
   - **Repository name**: `cnvmp3` (या कोई भी नाम)
   - **Visibility**: Public या Private (दोनों काम करेंगे)
   - **Initialize**: कुछ भी select न करें
4. **Create repository** click करें

### Local Code को GitHub पर Push करें

अपने project folder में terminal/command prompt खोलें और ये commands run करें:

```bash
# Git initialize करें (अगर already नहीं है)
git init

# सभी files add करें
git add .

# Commit करें
git commit -m "Initial commit for Cloudflare deployment"

# GitHub repository को remote के रूप में add करें
# (अपना username और repository name डालें)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Main branch पर push करें
git branch -M main
git push -u origin main
```

> **Note**: `YOUR_USERNAME` और `YOUR_REPO_NAME` को अपने actual values से replace करें।

---

## Step 2: Cloudflare Account Setup

1. **Cloudflare पर जाएं**: https://dash.cloudflare.com/sign-up
2. Free account बनाएं (email verification करें)
3. Login करें

---

## Step 3: Cloudflare Pages पर Project बनाएं

1. **Cloudflare Dashboard** में जाएं
2. Left sidebar में **Workers & Pages** click करें
3. **Create application** button click करें
4. **Pages** tab select करें
5. **Connect to Git** click करें

### GitHub को Connect करें

1. **Connect GitHub** button click करें
2. Cloudflare को GitHub access की permission दें
3. अपनी repository select करें (`cnvmp3` या जो भी नाम दिया है)
4. **Begin setup** click करें

---

## Step 4: Build Settings Configure करें

अब आपको build configuration setup करना होगा:

### Build Settings भरें:

| Setting | Value |
|---------|-------|
| **Project name** | `cnvmp3` (या कोई भी unique name) |
| **Production branch** | `main` |
| **Framework preset** | `Next.js` |
| **Build command** | `npm run build` |
| **Build output directory** | `out` |

> **Important**: Framework preset में **Next.js** select करना जरूरी है।

### Environment Variables (Optional)

अगर आपके project में कोई environment variables हैं (जैसे API keys), तो उन्हें यहां add करें। इस project के लिए कोई environment variables की जरूरत नहीं है।

---

## Step 5: Deploy करें!

1. सभी settings verify करें
2. **Save and Deploy** button click करें
3. Cloudflare अब आपकी website build करना शुरू करेगा

### Build Process

- Build में **2-5 minutes** लग सकते हैं
- आप real-time में build logs देख सकते हैं
- अगर कोई error आए तो logs में दिखेगा

---

## Step 6: Website Live है! 🎉

Build complete होने के बाद:

1. आपको एक **URL** मिलेगा (जैसे: `cnvmp3.pages.dev`)
2. इस URL पर click करके अपनी website देखें
3. सभी tools test करें:
   - ✅ Video to MP3
   - ✅ Video Compressor
   - ✅ Audio Editor
   - ✅ GIF Maker
   - ✅ Image Converter

---

## 🌐 Custom Domain Setup (Optional)

अगर आप अपना custom domain use करना चाहते हैं:

1. Cloudflare Pages dashboard में जाएं
2. अपना project select करें
3. **Custom domains** tab click करें
4. **Set up a custom domain** click करें
5. अपना domain name enter करें
6. DNS records को update करने के instructions follow करें

---

## 🔄 Future Updates

जब भी आप अपनी website में changes करेंगे:

1. Local में changes करें
2. Git commands run करें:
   ```bash
   git add .
   git commit -m "Updated features"
   git push
   ```
3. Cloudflare **automatically** नई deployment शुरू कर देगा
4. 2-5 minutes में changes live हो जाएंगे

---

## 🐛 Troubleshooting

### Build Failed?

**Error**: `Build failed`
- **Solution**: Build logs check करें और error message पढ़ें
- Common issue: `npm install` fail हो सकता है
- Fix: `package.json` में सभी dependencies सही हैं verify करें

### Website Load नहीं हो रही?

**Error**: Blank page या loading error
- **Solution**: Browser console check करें (F12 press करें)
- CORS errors check करें
- `_headers` file properly configured है verify करें

### FFmpeg काम नहीं कर रहा?

**Error**: "SharedArrayBuffer is not defined"
- **Solution**: Headers properly set हैं check करें
- Browser में website को HTTPS से access करें (HTTP नहीं)
- Private/Incognito mode में try करें

### Video Upload नहीं हो रहा?

**Error**: File upload fail
- **Solution**: File size check करें (बहुत बड़ी files browser में process नहीं हो सकतीं)
- Cloudflare Pages की file size limit: 25MB per request
- बड़ी files के लिए user को छोटी files use करने को कहें

---

## 📊 Cloudflare Pages Free Plan Limits

| Feature | Limit |
|---------|-------|
| **Bandwidth** | Unlimited |
| **Requests** | Unlimited |
| **Builds per month** | 500 |
| **Concurrent builds** | 1 |
| **Build time** | 20 minutes max |

आपकी website के लिए ये limits काफी हैं! 🚀

---

## 🎯 Next Steps

1. ✅ Website को test करें
2. ✅ सभी tools verify करें
3. ✅ Friends/family के साथ share करें
4. ✅ Custom domain add करें (optional)
5. ✅ Analytics setup करें (Cloudflare Web Analytics free है)

---

## 💡 Tips

- **Performance**: Cloudflare का global CDN आपकी website को worldwide fast बनाता है
- **Security**: Automatic HTTPS और DDoS protection मिलता है
- **Analytics**: Cloudflare dashboard में free analytics available हैं
- **Caching**: Static files automatically cache होती हैं

---

## 📞 Support

अगर कोई problem आए:
1. Cloudflare Community Forum: https://community.cloudflare.com/
2. Cloudflare Docs: https://developers.cloudflare.com/pages/

---

**Happy Deploying! 🚀**
