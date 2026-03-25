# KPAY

## Current State
KPAY is a 3D-style mobile banking app with: splash, login/register (Internet Identity), home dashboard with virtual card, transfer (mock + Paystack), airtime/data, bill payments, transaction history, and profile. Authorization component installed with isCallerAdmin()/assignCallerUserRole(). Backend has getAllTransactions() and sendNotification() admin-only endpoints.

## Requested Changes (Diff)

### Add
- Admin dashboard screen (screen key: `admin`) — only accessible to the first logged-in user (who is the admin). Shows: system stats (total transactions, total volume), all transactions table, send notification form.
- Admin entry point in Profile page: show "Admin Dashboard" button only when isCallerAdmin() returns true.
- New queries: `useIsCallerAdmin()`, `useAllTransactions()`, `useSendNotification()`.
- 3D visual enhancements throughout: deeper perspective transforms on cards, floating/levitating elements with CSS 3D, glowing depth shadows, 3D button press effect on quick-action buttons.
- New professional logo at `/assets/generated/kpay-logo-pro-transparent.dim_300x300.png` — replace old logo across Splash, Login, and Register screens.

### Modify
- App.tsx: add `admin` to KPayScreen type; add admin screen routing; include admin in showBottomNav (false for admin screen).
- Profile.tsx: add admin dashboard button (visible only when isCallerAdmin is true).
- Splash.tsx, Login.tsx, Register.tsx: update logo src to new file.
- Home.tsx, VirtualCard.tsx: enhance 3D depth effects — stronger perspective, layered box-shadows, floating animation.
- BottomNav.tsx: add subtle 3D lift effect on active tab.

### Remove
- Nothing removed.

## Implementation Plan
1. Add `useIsCallerAdmin`, `useAllTransactions`, `useSendNotification` queries to useQueries.ts.
2. Create `src/pages/kpay/AdminDashboard.tsx` with stats, all-transactions table, send-notification form.
3. Update App.tsx to add `admin` screen type and routing.
4. Update Profile.tsx to query isCallerAdmin and show admin nav button.
5. Update Splash.tsx, Login.tsx, Register.tsx to use new logo path.
6. Enhance 3D effects: Home.tsx (card perspective, floating), VirtualCard.tsx (3D depth), BottomNav.tsx (active lift).
7. Validate and fix any type errors.
