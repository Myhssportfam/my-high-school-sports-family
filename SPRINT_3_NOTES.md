# MHSSF Sprint 3 — Real State Map + Video Game Arena

## Added
- Real interactive OpenStreetMap-based map with geographic state boundaries.
- Hover activity styling and click-through routing for all U.S. states.
- New `/arena` experience for state-vs-state sports gaming.
- Sports game selection, state representation, challenge-lobby preview, live-match cards, state rankings, and youth-safety section.
- Twitch OAuth foundation using `NEXT_PUBLIC_TWITCH_CLIENT_ID`.
- Arena links in the main navigation, footer, and homepage hero.

## Twitch setup
Add this to `.env.local` when a Twitch developer application has been created:

`NEXT_PUBLIC_TWITCH_CLIENT_ID=your_client_id`

Set the Twitch OAuth redirect URL to your site origin plus `/arena`, for example `http://localhost:3000/arena` during local development.

## Important
The map loads OpenStreetMap tiles and public GeoJSON state boundaries, so an internet connection is required. Matchmaking, tournament persistence, chat moderation, and live Twitch channel embeds are UI foundations in this sprint and require backend data models and approved Twitch configuration in the next sprint.
