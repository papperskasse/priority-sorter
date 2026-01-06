# 💰 Setting Up Donations & Feedback

Your Priority Sorter app now has a footer with donation options and feedback email! Here's how to activate them:

---

## ✉️ Step 1: Set Up Feedback Email

### Update the Email Address

1. Open `frontend/index.html`
2. Find this line (around line 210):
   ```html
   href="mailto:YOUR_EMAIL@example.com?subject=Priority Sorter Feedback"
   ```
3. Replace `YOUR_EMAIL@example.com` with your actual email address

**Example:**
```html
href="mailto:nonejm@msn.com?subject=Priority Sorter Feedback"
```

That's it! Users can now send you feedback via email.

---

## 💳 Step 2: Set Up Donation Platforms

You have **4 donation options** in the footer. Choose which ones you want to activate:

### Option 1: PayPal ⭐ (Easiest)

**Setup:**
1. Go to: https://paypal.me
2. Create your PayPal.me link (e.g., `paypal.me/yourname`)
3. Update `index.html`:
   ```html
   href="https://paypal.me/YOUR_PAYPAL_USERNAME"
   ```
   Replace `YOUR_PAYPAL_USERNAME` with your actual PayPal.me username

**Pros:**
- ✅ Most widely used
- ✅ Instant setup if you have PayPal
- ✅ No fees from you (donors pay fees)
- ✅ Direct to your PayPal account

---

### Option 2: Ko-fi ⭐ (Recommended for Creators)

**Setup:**
1. Go to: https://ko-fi.com
2. Sign up (free)
3. Choose your username (e.g., `ko-fi.com/yourname`)
4. Update `index.html`:
   ```html
   href="https://ko-fi.com/YOUR_KOFI_USERNAME"
   ```

**Pros:**
- ✅ 0% platform fees (they make money from tips)
- ✅ One-time or monthly donations
- ✅ No fees for donors
- ✅ Can sell digital products too
- ✅ Built for creators

**Example:** `ko-fi.com/papperskasse`

---

### Option 3: Buy Me a Coffee

**Setup:**
1. Go to: https://buymeacoffee.com
2. Sign up (free)
3. Choose your username
4. Update `index.html`:
   ```html
   href="https://buymeacoffee.com/YOUR_BMC_USERNAME"
   ```

**Pros:**
- ✅ Fun, casual approach
- ✅ 5% platform fee
- ✅ Memberships available
- ✅ Very popular among developers

---

### Option 4: GitHub Sponsors

**Setup:**
1. Go to: https://github.com/sponsors
2. Apply for GitHub Sponsors
3. Once approved, update `index.html`:
   ```html
   href="https://github.com/sponsors/papperskasse"
   ```

**Pros:**
- ✅ 0% fees (GitHub pays all fees)
- ✅ Integrated with GitHub
- ✅ Professional for open-source projects
- ✅ Monthly recurring support

**Note:** Requires approval and bank account verification

---

## 🎯 Recommendation: Which to Use?

### **Easiest Setup (Pick 1-2):**
1. **PayPal** - If you already have PayPal
2. **Ko-fi** - Best for small, one-time donations

### **For Serious Support (Pick 1-2):**
1. **Ko-fi** - Most creator-friendly
2. **GitHub Sponsors** - Best for open-source projects

### **My Recommendation:**
Start with **PayPal** + **Ko-fi**. Easy to set up and covers most users' preferences!

---

## 🗑️ Removing Unwanted Options

Don't want all 4 donation buttons? Here's how to remove them:

1. Open `frontend/index.html`
2. Find the donation section (around line 230)
3. Delete the `<a>` tags for platforms you don't want

**Example - Keep only PayPal:**
```html
<div class="flex flex-wrap gap-2">
    <!-- PayPal -->
    <a 
        href="https://paypal.me/yourname" 
        target="_blank"
        class="inline-flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-semibold transition-colors"
    >
        💳 PayPal
    </a>
    
    <!-- Delete the other 3 <a> tags -->
</div>
```

---

## 📝 Quick Setup Checklist

- [ ] Update feedback email address
- [ ] Choose 1-2 donation platforms
- [ ] Sign up for chosen platforms
- [ ] Get your donation URLs
- [ ] Update `frontend/index.html` with your URLs
- [ ] Remove unwanted donation buttons (optional)
- [ ] Commit and push changes
- [ ] Vercel will auto-deploy!

---

## 🧪 Testing

After deploying:

1. **Test Email:** Click "Send Feedback" - should open your email client
2. **Test Donations:** Click each donation button - should open the correct platform
3. **Test in Incognito:** Make sure everything works for visitors

---

## 💡 Tips

### Increase Donations:
- ✅ Be transparent about costs (even though yours are $0!)
- ✅ Mention what donations support (future features, your time, etc.)
- ✅ Show appreciation for donors
- ✅ Consider adding a "Thank you" page for supporters

### Example Text to Add:
```
"Priority Sorter is 100% free and always will be! 
Donations help support development time and keep it ad-free."
```

---

## 🔄 Deploying Changes

Once you've updated the donation links:

```bash
git add frontend/index.html
git commit -m "Add donation links and feedback email"
git push
```

Vercel will automatically deploy in ~30 seconds!

---

## 📊 Tracking Donations (Optional)

Most platforms provide dashboards showing:
- Total donations
- Donor messages
- Monthly recurring supporters

Check each platform's dashboard to see your support!

---

## ❓ FAQ

**Q: Do I need to set up all 4 platforms?**
A: No! Pick 1-2 that work best for you.

**Q: What if someone donates but I don't have that platform set up?**
A: The button won't work. Remove buttons for platforms you don't use.

**Q: Can I add other donation methods (Venmo, Cash App, etc.)?**
A: Yes! Follow the same pattern as the existing buttons in the HTML.

**Q: Are donations taxable?**
A: Depends on your country. Generally, personal donations might not be taxable, but consult a tax professional.

**Q: How do I thank donors?**
A: Most platforms allow you to send thank-you messages. You can also list supporters in your README!

---

## 🎉 You're All Set!

Once configured, your app will have:
- ✅ Professional footer
- ✅ Feedback email
- ✅ Multiple donation options
- ✅ Clean, modern design

**Good luck with your project! Every contribution helps! 💪**
