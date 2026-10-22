# Sintel Technologies — Website Source Code

This is the complete source code for the Sintel Technologies website
(the public site + the admin content editor).

## What's inside

```
server.js                     Express backend (API + admin auth + serves the built site)
package.json                  Backend dependencies
client/                       Frontend (React + Vite)
  index.html
  package.json                Frontend dependencies
  vite.config.js
  src/
    main.jsx                  App entry — loads content provider
    App.jsx                   Routes (incl. /admin)
    index.css                 All styling (incl. admin editor styles)
    data/content.js           Default site content (fallback when DB is empty)
    data/sdgColors.js
    hooks/useContent.jsx      Fetches admin-edited content, merges over defaults
    hooks/useReveal.js
    utils/cardAccent.js
    components/               Hero, Nav, Footer, Team, ProjectsGrid, ServicesGrid,
                              Traction, Values, VisionMission, WhyInvest, SdgSection,
                              FocusAreas, ContactForm, Layout, Logo, Reveal, ScrollToTop
    pages/                    Home, About, Services, Projects, ProjectDetail,
                              Impact, Contact, Admin (the content editor), NotFound
```

## How to run it on your own machine / server

Prerequisites: Node.js 18+ and a PostgreSQL database.

1. **Backend** — from the root folder:

   ```
   npm install
   DATABASE_URL=postgresql://postgres:fatherofAI%402000@localhost:5432/sintel node server.js
   ```

   The server creates its tables automatically on first start
   (contact submissions, saved content, admin user, admin sessions).

   The initial admin password is `sintel-admin-2026` unless you set the
   environment variable `ADMIN_INITIAL_PASSWORD` before first start.
   Change it immediately from the admin page (Change password button).

2. **Frontend** — from the `client` folder:

   ```
   npm install
   npm run build
   ```

   This produces `client/dist`, which the backend serves automatically.
   For frontend development with hot reload: `npm run dev`
   (it expects the backend on http://localhost:4031).

3. Open `http://localhost:4031` for the site and `http://localhost:4031/admin`
   for the admin editor.

## Notes

- All editable content (hero, vision, mission, values, focus areas, projects,
  traction, why-invest, team, SDGs, services, contact info, footer) lives in the
  database once edited from the admin page; `client/src/data/content.js` is the
  built-in default/fallback.
- The admin editor saves one JSON blob per section into the `content_sections`
  table. Passwords are stored as scrypt hashes; sessions are random tokens that
  expire after 7 days.
- `client/node_modules` and `client/dist` are intentionally NOT included —
  run `npm install` / `npm run build` to generate them.
