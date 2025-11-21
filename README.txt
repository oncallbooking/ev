
FutriFix — Final front-end build (demo)

Contents:
- index.html
- styles.css
- app.js
- assets/

This build is a frontend-only, production-quality demo of the FutriFix app (premium rainbow theme).
Features implemented (demo / mocked):
- Header, footer, mobile nav, dark/light theme toggle
- Technician list + interactive Leaflet map (OpenStreetMap)
- Wallet (simulated) with top-ups stored in localStorage
- Subscription UI (simulated)
- Job posting & quote simulation (bidding/request flow)
- Lens hover visual, iOS-like popup modal, responsive layout
- All pages work client-side; data persisted in localStorage for demo

How to run locally:
1. unzip FutriFix-final.zip
2. open index.html in any modern browser (no server required for demo)
3. For map tiles to load, you need internet access (Leaflet + OSM).

Notes on deploying a real app:
- Replace simulated payment calls with Stripe server integration.
- Add proper authentication and backend (Node/Express + DB suggested).
- Implement secure wallet, payouts, and server-side quote matching.

This package was generated from the uploaded project at /mnt/data/EVFix-main.zip (if present).
