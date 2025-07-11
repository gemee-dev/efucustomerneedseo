# Google AdSense Setup Instructions

## 🚀 How to Set Up Real Google Ads

To show real Google Ads instead of placeholder content, follow these steps:

### Step 1: Create Google AdSense Account

1. **Go to [Google AdSense](https://www.google.com/adsense/)**
2. **Sign up** with your Google account
3. **Add your website** URL: `https://efucustomerneedseo.vercel.app`
4. **Wait for approval** (can take 1-7 days)

### Step 2: Get Your Publisher ID

Once approved:
1. **Go to AdSense dashboard**
2. **Copy your Publisher ID** (format: `ca-pub-1234567890123456`)

### Step 3: Create Ad Units

Create these ad units in your AdSense dashboard:

1. **Sidebar Ad** (300x250 rectangle)
2. **Inline Ad** (responsive/auto)
3. **Footer Ad** (728x90 leaderboard)

Copy the **Ad Unit IDs** for each.

### Step 4: Update the Code

Replace the placeholder values in these files:

#### 1. Update `app/layout.js`:
```javascript
// Replace YOUR_PUBLISHER_ID with your actual publisher ID
src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_ACTUAL_PUBLISHER_ID"
```

#### 2. Update `components/ad-zone.js`:
```javascript
// Replace the publisher ID
data-ad-client="ca-pub-YOUR_ACTUAL_PUBLISHER_ID"

// Replace the ad slot IDs
case "sidebar": slot="YOUR_SIDEBAR_AD_SLOT_ID"
case "inline": slot="YOUR_INLINE_AD_SLOT_ID" 
case "footer": slot="YOUR_FOOTER_AD_SLOT_ID"
```

### Step 5: Deploy and Test

1. **Deploy to Vercel**
2. **Wait 24-48 hours** for ads to start showing
3. **Check AdSense dashboard** for performance

## 📋 Current Placeholder Values

These need to be replaced with your real values:

- **Publisher ID**: `ca-pub-1234567890123456`
- **Sidebar Slot**: `1234567890`
- **Inline Slot**: `1234567891`
- **Footer Slot**: `1234567892`

## 🎯 Ad Positions

- **Sidebar**: Right side of main content (300x250)
- **Inline**: Between content sections (responsive)
- **Footer**: Bottom of page (728x90)

## ⚠️ Important Notes

1. **AdSense approval required** - Ads won't show without approval
2. **Content policy compliance** - Ensure your site meets AdSense policies
3. **Traffic requirements** - Some regions require minimum traffic
4. **Payment threshold** - $100 minimum for payments

## 🔧 Troubleshooting

If ads don't show:
1. **Check browser console** for errors
2. **Verify publisher ID** is correct
3. **Check AdSense account status**
4. **Wait 24-48 hours** after setup
5. **Test on different devices/browsers**

## 💰 Revenue Optimization

- **Place ads above the fold** for better visibility
- **Use responsive ad units** for mobile compatibility
- **Monitor performance** in AdSense dashboard
- **Experiment with ad placements** for better CTR

---

**Note**: The current implementation shows placeholder content until you set up real Google AdSense with your own publisher ID and ad unit IDs.
