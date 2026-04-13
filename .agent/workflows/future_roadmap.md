---
description: Future Implementation Plan for PrimeBets Admin & Game Logic
---

# Future Roadmap

## 1. Admin Dashboard
Build a simple Admin Dashboard directly connected to Supabase to replace/supplement the Google Sheets + n8n workflow.
*   **Goal:** Allow easy manual entry and editing of Daily Picks, Saturday Picks, and Weekly Scout.
*   **Features:**
    *   Form validation.
    *   Status toggles (Open/Closed/Won/Lost).
    *   Direct preview of the result.

## 2. Game Status Logic
Implement logic to automatically close games that have passed.
*   **Goal:** "Alla spel där det är ett gammalt datum (datum innan dagens datum) ska sättas som stängda spel."
*   **Implementation:**
    *   Frontend: Update `Dashboard.tsx` and hero components to check `race_date < today`. If true, display "STÄNGT" or "AVSLUTAT" badge.
    *   Backend (Optional but recommended): A scheduled Database Function (cron) in Supabase that updates the `status` column to 'closed' for past dates effectively.
