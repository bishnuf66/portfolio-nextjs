# 🍪 Cookie Consent & Audio Experience System

## Overview
A modern, GDPR-compliant consent management system with beautiful popups for cookie consent and audio experience preferences.

## Features Implemented

### 1. Cookie Consent Popup
- **Modern Design**: Gradient backgrounds, animated entrance, blur effects
- **Privacy Information**: Clear explanation of data collection
- **Features Listed**:
  - Anonymous tracking
  - No personal data collection
  - Experience improvement
- **User Choice**: Accept or Reject buttons
- **Persistent Storage**: Saves preference in localStorage

### 2. Audio Experience Popup
- **Appears After Cookie Consent**: Sequential flow management
- **Animated Elements**: 
  - Floating music icon with pulse effect
  - Rotating gradient backgrounds
  - Smooth entrance animations
- **Features Listed**:
  - Ambient background music
  - Full volume control
- **User Choice**: "Yes, Play Music" or "No Thanks, Keep Silent"
- **Auto-Play**: Automatically starts music if user accepts

### 3. Consent Manager
- **Orchestrates Both Popups**: Manages the flow between cookie and audio consent
- **Smart Timing**: Shows audio popup 800ms after cookie acceptance
- **Persistent Preferences**: Remembers user choices across sessions
- **Integrated Audio**: Includes AudioManager component

### 4. Privacy-Respecting Analytics
- **Consent Checking**: All analytics functions check for cookie consent
- **No Tracking Without Consent**: Analytics disabled if cookies rejected
- **Functions Protected**:
  - `trackPageView()`
  - `trackProjectView()`
  - `trackSectionInteraction()`
  - `trackTimeOnPage()`

## File Structure

```
src/
├── components/
│   ├── CookieConsent.tsx          # Cookie consent popup
│   ├── AudioExperiencePopup.tsx   # Audio experience popup
│   ├── ConsentManager.tsx         # Orchestrates both popups
│   └── AudioManager.tsx           # Audio controls (existing)
├── lib/
│   └── analytics.ts               # Analytics with consent checks
└── app/
    └── layout.tsx                 # Integrated ConsentManager
```

## User Flow

1. **First Visit**:
   - Cookie consent popup appears after 1 second
   - User accepts or rejects cookies

2. **If Cookies Accepted**:
   - Audio experience popup appears after 800ms
   - User chooses to enable or disable music

3. **If Audio Accepted**:
   - Background music starts playing automatically
   - Audio controls appear in bottom-right corner

4. **Subsequent Visits**:
   - No popups shown (preferences remembered)
   - Analytics respects cookie choice
   - Audio respects audio choice

## LocalStorage Keys

- `cookie-consent`: "accepted" | "rejected"
- `audio-consent`: "accepted" | "declined"
- `visitor_id`: Unique visitor identifier (only if cookies accepted)
- `session_id`: Session identifier (sessionStorage, only if cookies accepted)

## Design Features

### Cookie Consent Popup
- Gradient background (blue to purple)
- Cookie icon in gradient circle
- Shield icons for privacy features
- Smooth scale and fade animations
- Backdrop blur effect

### Audio Experience Popup
- Animated floating music icon
- Rotating gradient orbs in background
- Sparkle icons in title
- Feature cards with icons
- Smooth 3D rotation entrance

## Privacy Compliance

✅ **GDPR Compliant**:
- Clear consent request
- Explicit user choice
- Easy to reject
- Persistent preferences
- No tracking without consent

✅ **Transparent**:
- Clear explanation of data collection
- Listed features and benefits
- Privacy information visible

✅ **User Control**:
- Can reject cookies
- Can decline audio
- Can change preferences anytime
- Audio controls always accessible

## Testing

To test the system:

1. **Clear localStorage**: `localStorage.clear()`
2. **Refresh page**: Cookie popup should appear
3. **Accept cookies**: Audio popup should appear
4. **Accept audio**: Music should start playing
5. **Check console**: Analytics should be tracking
6. **Reject cookies**: No analytics tracking should occur

## Next Steps

- ✅ Cookie consent popup created
- ✅ Audio experience popup created
- ✅ Consent manager implemented
- ✅ Analytics respects consent
- ✅ Sequential popup flow
- ✅ Auto-play music on consent
- 🔲 Add background music file to `/public/audio/background-music.mp3`
- 🔲 Run SQL schema in Supabase (see RUN_THIS_SQL.md)

## Notes

- The audio file path is `/public/audio/background-music.mp3`
- Make sure to add your preferred background music file
- Analytics tables need to be created in Supabase
- All animations use Framer Motion
- Dark mode support included
