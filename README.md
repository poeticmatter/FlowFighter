# Flow Fighter

A two-player fighting duel, prototyped for the [game lab](https://poeticmatter.github.io/game-lab/).

Play: [poeticmatter.github.io/FlowFighter](https://poeticmatter.github.io/FlowFighter/)

Built from [poeticmatter/game-template](https://github.com/poeticmatter/game-template): the lobby, live play (PeerJS) and async play (Supabase) live in `src/platform/`, and the game itself lives in `src/game/`. See `CLAUDE.md` for the architecture.

## Development

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and fill in the shared Supabase project's URL and publishable key. The game's table is `flow_games`, created by `supabase/migrations/0001_create_flow_games.sql`.

`npm run deploy` builds and publishes to GitHub Pages.
