# Android Port Implementation Plan

## Executive Summary
**Recommended Approach**: Capacitor Web Wrapper
**Estimated Timeline**: 1-2 weeks
**Risk Level**: Low
**Code Reuse**: ~95%

---

## Phase 1: Capacitor Setup (2-3 days)

### 1.1 Install Dependencies
```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
npm install @capacitor/share @capacitor/filesystem @capacitor/keyboard
npx cap init
```

### 1.2 Configure Capacitor
Create `capacitor.config.ts`:
```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.theoryinvestment.game',
  appName: 'Theory Investment Game',
  webDir: 'out',
  server: {
    androidScheme: 'https'
  },
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystorePassword: undefined,
      keystoreAlias: undefined,
      keystoreAliasPassword: undefined,
      releaseType: 'APK'
    }
  }
};

export default config;
```

### 1.3 Update Next.js Build
Modify `next.config.js`:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true
  },
  trailingSlash: true,
  assetPrefix: process.env.NODE_ENV === 'production' ? undefined : undefined
};

module.exports = nextConfig;
```

### 1.4 Build Scripts
Add to `package.json`:
```json
{
  "scripts": {
    "build:android": "next build && next export && npx cap sync android",
    "open:android": "npx cap open android",
    "run:android": "npm run build:android && npm run open:android"
  }
}
```

### 1.5 Initialize Android Project
```bash
npx cap add android
npx cap sync
```

---

## Phase 2: Mobile UI Optimization (3-5 days)

### 2.1 Enhanced Responsive CSS
Add to `globals.css` (after line 2121):

```css
/* ============================================
   MOBILE-SPECIFIC OPTIMIZATIONS
   ============================================ */

/* Portrait phones */
@media (max-width: 600px) and (orientation: portrait) {
    body {
        overflow-x: hidden;
    }

    #game-container {
        margin: 10px;
        padding: 10px;
    }

    /* Make board full width */
    .left-page {
        flex: 1;
        padding: 10px;
    }

    /* Stack panels vertically */
    .two-page-spread {
        flex-direction: column;
    }

    .right-page {
        position: relative;
        min-height: 400px;
    }

    /* Floating panels as overlays */
    #players-panel,
    #theories-panel {
        position: fixed;
        width: 90%;
        max-width: 320px;
        max-height: 60vh;
        left: 50%;
        transform: translateX(-50%) rotate(0deg);
    }

    #players-panel {
        top: 10px;
        z-index: 100;
    }

    #theories-panel {
        bottom: 80px;
        z-index: 99;
    }

    /* Mobile-friendly action buttons */
    #action-buttons {
        position: fixed;
        bottom: 10px;
        left: 50%;
        transform: translateX(-50%);
        width: 90%;
        max-width: 300px;
        z-index: 1000;
    }

    .roll-btn {
        font-size: 16px;
        padding: 12px 24px;
        width: 100%;
    }

    /* Larger touch targets */
    .sketch-btn {
        min-height: 44px;
        font-size: 12px;
        padding: 12px 18px;
    }

    /* Modal adjustments */
    .modal-content {
        width: 95%;
        padding: 20px;
        max-height: 90vh;
        overflow-y: auto;
    }

    /* Optimize zoom controls */
    #zoom-controls {
        bottom: 70px;
        right: 10px;
        padding: 6px 8px;
    }

    .zoom-btn {
        width: 32px;
        height: 32px;
        font-size: 18px;
    }

    /* Hide decorative elements for performance */
    .formula-doodles,
    .sticker,
    .paper-texture,
    .tape {
        display: none;
    }

    /* Simplify notepad */
    .mini-notepad {
        width: 90%;
        max-height: 40vh;
        top: auto;
        bottom: 80px;
        right: 5%;
        left: 5%;
        transform: none;
    }

    /* Compact player stats */
    .player-stat {
        font-size: 12px;
        padding: 8px;
    }

    .player-stat .stats {
        font-size: 11px;
    }

    /* Compact theory items */
    .theory-item {
        font-size: 12px;
        padding: 8px;
    }

    /* Sticky notes - smaller on mobile */
    .sticky-note {
        padding: 15px 18px;
        margin-bottom: 15px;
    }

    .sticky-note h2 {
        font-size: 12px;
    }

    /* Smaller titles */
    .hand-title {
        font-size: 14px;
        margin-bottom: 10px;
    }

    .subtitle {
        font-size: 14px;
        margin-bottom: 20px;
    }

    /* Paper labels - compact */
    .paper-label {
        font-size: 16px;
        padding: 6px 12px;
    }

    .paper-label-row {
        padding: 15px 10px;
        gap: 10px;
    }
}

/* Landscape phones */
@media (max-width: 900px) and (orientation: landscape) {
    /* Keep two-page layout but make it narrower */
    .left-page {
        flex: 1.5;
    }

    .right-page {
        flex: 1;
    }

    /* Panels overlay on left side */
    #players-panel {
        left: 10px;
        top: 10px;
        width: 250px;
    }

    #theories-panel {
        left: 10px;
        bottom: 10px;
        width: 250px;
    }
}

/* Tablets - optimize for larger screens */
@media (min-width: 601px) and (max-width: 1000px) {
    #game-container {
        margin: 20px;
    }

    .left-page {
        flex: 1.5;
    }

    .right-page {
        flex: 1;
    }

    /* Keep panels draggable on tablets */
    #players-panel,
    #theories-panel {
        width: 280px;
    }
}

/* Touch-optimized interactions */
@media (hover: none) and (pointer: coarse) {
    /* Increase all interactive element sizes */
    input[type="text"],
    input[type="number"],
    select,
    textarea {
        font-size: 16px; /* Prevent iOS zoom */
        padding: 12px;
        min-height: 44px;
    }

    /* Larger checkbox/radio buttons */
    input[type="checkbox"],
    input[type="radio"] {
        width: 24px;
        height: 24px;
    }

    /* Better button touch targets */
    button,
    .sketch-btn {
        min-height: 44px;
        min-width: 44px;
    }

    /* Prevent text selection during drag */
    .draggable-sticky,
    .notepad-header,
    #players-panel h3,
    #theories-panel h3 {
        -webkit-user-select: none;
        user-select: none;
        -webkit-touch-callout: none;
    }

    /* Optimize canvas for touch */
    #game-board {
        touch-action: pan-x pan-y pinch-zoom;
    }
}

/* Foldable devices (Samsung Galaxy Fold, etc.) */
@media (min-width: 601px) and (max-width: 900px) and (orientation: portrait) {
    .two-page-spread {
        flex-direction: column;
    }
}
```

### 2.2 Touch Interaction Improvements
Update `public/js/ui.js` to add touch gesture support:

```javascript
// Add at the beginning of ui.js
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Improve drag handling for mobile
function setupMobileDrag(element, handleSelector) {
    let startX, startY, initialX, initialY;
    let isDragging = false;

    const handle = handleSelector ? element.querySelector(handleSelector) : element;

    handle.addEventListener('touchstart', (e) => {
        isDragging = true;
        const touch = e.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
        const rect = element.getBoundingClientRect();
        initialX = rect.left;
        initialY = rect.top;
        e.preventDefault();
    }, { passive: false });

    document.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const touch = e.touches[0];
        const deltaX = touch.clientX - startX;
        const deltaY = touch.clientY - startY;
        element.style.left = (initialX + deltaX) + 'px';
        element.style.top = (initialY + deltaY) + 'px';
        e.preventDefault();
    }, { passive: false });

    document.addEventListener('touchend', () => {
        isDragging = false;
    });
}
```

### 2.3 Performance Optimizations
Create `public/js/mobile-optimizations.js`:

```javascript
// Reduce animation complexity on mobile
if (isMobile) {
    // Disable complex animations
    document.documentElement.style.setProperty('--animation-duration', '0.2s');

    // Simplify paper texture
    const paperTexture = document.querySelector('.paper-texture');
    if (paperTexture) {
        paperTexture.style.opacity = '0.03';
    }

    // Reduce canvas quality slightly for performance
    const canvas = document.getElementById('game-board');
    if (canvas) {
        const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
        // Use lower pixel ratio on mobile
        const scale = Math.min(window.devicePixelRatio, 2);
        canvas.style.width = canvas.width + 'px';
        canvas.style.height = canvas.height + 'px';
        canvas.width = canvas.width * scale;
        canvas.height = canvas.height * scale;
        ctx.scale(scale, scale);
    }
}

// Optimize scrolling performance
if ('passive' in EventListenerOptions) {
    document.addEventListener('touchstart', () => {}, { passive: true });
    document.addEventListener('touchmove', () => {}, { passive: true });
}
```

---

## Phase 3: Native Android Integration (2-3 days)

### 3.1 Handle Android Back Button
Create `app/capacitor-setup.ts`:

```typescript
import { App as CapacitorApp } from '@capacitor/app';

export function setupCapacitorHandlers() {
    // Android back button
    CapacitorApp.addListener('backButton', ({ canGoBack }) => {
        // Check if modal is open
        const modal = document.querySelector('.modal');
        if (modal) {
            // Close modal
            modal.remove();
            return;
        }

        // Check if we can go back in game history
        if (canGoBack) {
            window.history.back();
        } else {
            // Exit app
            CapacitorApp.exitApp();
        }
    });

    // Handle app state changes
    CapacitorApp.addListener('appStateChange', ({ isActive }) => {
        if (isActive) {
            // Resume game sounds, animations
            console.log('App resumed');
        } else {
            // Pause game sounds, animations
            console.log('App paused');
        }
    });
}
```

### 3.2 Native PDF Sharing
Update PDF export functionality:

```typescript
import { Share } from '@capacitor/share';
import { Filesystem, Directory } from '@capacitor/filesystem';

async function shareGamePDF(pdfBlob: Blob, filename: string) {
    if (Capacitor.isNativePlatform()) {
        // Convert blob to base64
        const base64 = await convertBlobToBase64(pdfBlob);

        // Write to filesystem
        const result = await Filesystem.writeFile({
            path: filename,
            data: base64,
            directory: Directory.Cache
        });

        // Share via native share sheet
        await Share.share({
            title: 'Share Theory Research',
            text: 'Check out my research paper!',
            url: result.uri,
            dialogTitle: 'Share your research'
        });
    } else {
        // Web fallback - download
        const url = URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
    }
}
```

### 3.3 Keyboard Management
```typescript
import { Keyboard } from '@capacitor/keyboard';

export function setupKeyboardHandlers() {
    Keyboard.addListener('keyboardWillShow', (info) => {
        // Adjust viewport when keyboard appears
        document.body.style.transform = `translateY(-${info.keyboardHeight / 2}px)`;
    });

    Keyboard.addListener('keyboardWillHide', () => {
        document.body.style.transform = 'translateY(0)';
    });
}
```

### 3.4 Android Manifest Configuration
After running `npx cap add android`, edit `android/app/src/main/AndroidManifest.xml`:

```xml
<manifest>
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="Theory Investment Game"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:theme="@style/AppTheme"
        android:usesCleartextTraffic="true">

        <activity
            android:name=".MainActivity"
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|locale|smallestScreenSize|screenLayout|uiMode"
            android:label="@string/app_name"
            android:launchMode="singleTask"
            android:theme="@style/AppTheme.NoActionBarLaunch"
            android:screenOrientation="unspecified"
            android:windowSoftInputMode="adjustResize">

            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
```

---

## Phase 4: Testing & Polish (3-4 days)

### 4.1 Device Testing Matrix
Test on:
- Samsung Galaxy S21 (Android 13)
- Google Pixel 6 (Android 14)
- OnePlus 9 (Android 12)
- Low-end device: Samsung Galaxy A12 (Android 11)
- Tablet: Samsung Galaxy Tab S7

### 4.2 Performance Checklist
- [ ] Game loads in < 3 seconds on WiFi
- [ ] Board renders smoothly at 30+ FPS
- [ ] Canvas zoom/pan feels responsive
- [ ] No jank during animations
- [ ] App size < 50 MB
- [ ] Memory usage < 200 MB

### 4.3 UX Polish
- [ ] Splash screen displays properly
- [ ] All buttons have touch ripple effects
- [ ] Proper loading states for LLM calls
- [ ] Error messages are mobile-friendly
- [ ] Landscape mode works properly
- [ ] Screen rotation doesn't break layout
- [ ] Keyboard doesn't cover input fields

### 4.4 Build Release APK
```bash
cd android
./gradlew assembleRelease
# APK will be in: app/build/outputs/apk/release/app-release.apk
```

---

## Phase 5: Deployment (1 day)

### 5.1 Generate Signed APK
```bash
# Generate keystore
keytool -genkey -v -keystore theory-game.keystore -alias theory-game -keyalg RSA -keysize 2048 -validity 10000

# Sign APK
cd android/app/build/outputs/apk/release
jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 -keystore ../../../../theory-game.keystore app-release-unsigned.apk theory-game
zipalign -v 4 app-release-unsigned.apk theory-game-release.apk
```

### 5.2 Google Play Console Setup
1. Create app listing
2. Upload signed APK
3. Set up store listing (screenshots, description)
4. Configure pricing & distribution
5. Submit for review

---

## Alternative Considerations

### If Performance Issues Arise
If the Capacitor web wrapper has performance issues:
- Consider using **Ionic Capacitor** with prerendering
- Optimize canvas rendering (reduce complexity)
- Use **Web Workers** for game logic
- Implement lazy loading for heavy components

### Future Enhancements
- Push notifications for multiplayer turns
- Cloud save with Firebase
- Google Play Games integration
- Achievements & leaderboards

---

## Risk Assessment

### Low Risk
- ✅ Web wrapper is proven technology
- ✅ Minimal code changes required
- ✅ Easy to test and iterate

### Medium Risk
- ⚠️ Canvas rendering performance on low-end devices
- ⚠️ App size might exceed 40 MB

### Mitigation Strategies
- Test early on low-end devices
- Optimize assets (compress images)
- Implement adaptive quality settings
- Provide "Performance Mode" toggle

---

## Timeline Summary

| Phase | Duration | Key Deliverables |
|-------|----------|------------------|
| 1. Capacitor Setup | 2-3 days | Working Android project |
| 2. Mobile UI | 3-5 days | Responsive layouts |
| 3. Native Integration | 2-3 days | Back button, sharing |
| 4. Testing & Polish | 3-4 days | Bug-free experience |
| 5. Deployment | 1 day | Released APK |
| **TOTAL** | **11-16 days** | **Published app** |

---

## Success Metrics

- [ ] App installs successfully on Android 8+
- [ ] Game playable from start to finish on mobile
- [ ] Average rating > 4.0 stars
- [ ] Crash rate < 1%
- [ ] Load time < 3 seconds
- [ ] APK size < 50 MB

---

## Conclusion

The **Capacitor web wrapper approach** is the most practical option for porting this game to Android. It allows you to:
- Reuse 95% of existing code
- Ship in 1-2 weeks
- Maintain a single codebase
- Iterate quickly based on user feedback

The enhanced responsive CSS and native integrations will provide a solid mobile experience while keeping development complexity low.
