# KPAY

## Current State
- KPAY is a Nigerian mobile banking app with mock transfers, airtime, bills, and transaction history.
- Transfer screen does mock beneficiary lookup and stores a pending transaction on the backend.
- Backend has http-outcalls capability but no real payment API integration.
- No real money movement happens — all transfers are simulated.

## Requested Changes (Diff)

### Add
- Paystack integration for real bank transfers via HTTP outcalls from the backend.
- Bank code mapping for all 24 Nigerian banks (Paystack bank codes).
- Real account name resolution: call Paystack `/bank/resolve` before proceeding.
- Real transfer flow: create recipient on Paystack, then initiate transfer via `/transfer`.
- Paystack secret key storage in the backend (admin-configurable).
- A "Third Party Transfer" tab/option on the Transfer screen that uses Paystack.
- In Profile page: a section to configure Paystack secret key (stored in backend).
- Clear UI labels distinguishing "KPAY Internal Transfer" vs "Bank Transfer (Paystack)".

### Modify
- Transfer screen: add tab switcher — "Send Money" (KPAY internal) and "Bank Transfer" (Paystack real).
- Bank Transfer flow: replace mock lookup with real Paystack account resolution showing actual name.
- PIN confirmation: after PIN, call backend `initiatePaystackTransfer` instead of `createTransfer`.
- nigerianData.ts: add NIGERIAN_BANK_CODES map (bank name → Paystack bank code).
- Backend: add `setPaystackKey`, `resolveAccount`, `initiatePaystackTransfer` functions.
- Profile page: add "Developer / API Settings" card with Paystack key input for admin.

### Remove
- Nothing removed.

## Implementation Plan
1. Update backend main.mo: add Paystack key storage, account resolution HTTP outcall, transfer initiation HTTP outcall.
2. Update nigerianData.ts: add bank codes map for all Nigerian banks.
3. Update Transfer.tsx: add tab switcher (KPAY / Bank Transfer), real Paystack flow for Bank Transfer tab.
4. Update Profile.tsx: add Paystack API key configuration section.
5. Validate and build.
