# FutriFix (Frontend + Seed Data)

This repo contains a frontend scaffold (HTML/CSS/JS), seed branch data and a minimal Node/Express server example. The frontend uses Leaflet for maps and `data/branches.json` as seed data.

## Quick start (frontend only)
1. Clone repository.
2. Serve files (e.g., `npx http-server .` or open `index.html`).
3. Open `http://localhost:8080` (or file://).

## With example backend
1. `cd server`
2. `npm init -y`
3. `npm install express cors body-parser`
4. `node server.js`
5. Open `http://localhost:3000`

## Production suggestions
- Database: PostgreSQL + PostGIS for massive, geo-indexed datasets.
- API: Node/Express or Python/FastAPI with connection pooling.
- Authentication & payments: integrate OAuth/JWT and Razorpay/Stripe.
- Scalability: deploy on Kubernetes / managed services (GCP Cloud SQL, AWS RDS).
- Geocoding: use Google Geocoding API or OpenCage for address → lat/lon.
- Maps: Leaflet + OSM, or Google Maps for advanced features and roadmap tile licensing.
