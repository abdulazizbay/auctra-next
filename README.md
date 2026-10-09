# Auctra

Frontend for **Auctra**, a live auction marketplace for pre-owned luxury watches, jewellery, art and collectibles.

- Backend: [auctra](https://github.com/abdulazizbay/auctra) (NestJS + GraphQL)

## Features

- **Lots**: filter, sort and search lots. The filters live in the URL, so a filtered list can be shared.
- **Live bidding**: the lot page joins a WebSocket room, and the price, bid list and end time update for every viewer as bids come in. The page switches to sold or unsold the moment the lot closes.
- **Ceiling price**: an optional buy-now price that closes the lot as soon as someone bids it.
- **Watchlist and My Bids**: the My Bids list shows Winning or Outbid on open lots and Won or Lost on closed ones.
- **Orders**: buyers pay (simulated), confirm receipt and leave a review. Sellers mark orders as shipped. Each order has a private chat between buyer and seller.
- **Sellers**: users apply with a document, and admins approve them. Sellers list lots with up to 5 images.
- **Member profiles**: seller lots and reviews, articles, followers, followings, likes and follows.
- **Community**: articles with a rich text editor (Toast UI), comments and likes.
- **Real-time**: notification bell, toasts, and a global chat lobby.
- **Auth**: email/password, Google and Kakao sign-in.
- **Admin panel**: members, seller approvals, lots, community, notices and FAQ.
- **i18n**: English and Korean.

## Tech Stack

| Area | Tech |
|---|---|
| Framework | Next.js 14 (Pages Router), React 18, TypeScript |
| UI | MUI v7, SCSS, Swiper |
| Data | Apollo Client 3, GraphQL, `apollo-upload-client` |
| Real-time | Native WebSocket with rooms and auto-reconnect |
| i18n | `next-i18next` (`en`, `kr`) |
| Images | `next/image` with `sharp` (resized WebP) |

## Project Structure

```
pages/              routes (lot, community, seller, member, mypage, cs, _admin, account)
libs/
  components/       UI by feature (lot, homepage, mypage, community, member, layout, ...)
  types/ enums/     mirror backend DTOs and enums
  socket.ts         WebSocket client (one connection, rooms, backoff reconnect)
  auth/             login, signup, logout, user info
apollo/
  client.ts         Apollo links: error → auth (Bearer) → upload
  store.ts          reactive vars (userVar, socketVar, ...)
  user/ admin/      queries and mutations
scss/               styles by page, MUI-aligned breakpoints
public/locales/     en / kr translations
```

- **Data flow**: page → `useQuery` / `useMutation` → GraphQL API. Live updates come in over the WebSocket and patch the page state.
- **Auth**: the JWT is stored in `localStorage` and sent as `Authorization: Bearer`. The current member is kept in the `userVar` reactive var.
- **SSR**: the MUI styles are rendered on the server through `@mui/material-nextjs`. Layout HOCs (`withLayoutMain`, `withLayoutBasic`, `withLayoutFull`) wrap each page.

## Getting Started

Requirements: Node.js, Yarn, and the [backend](https://github.com/abdulazizbay/auctra) running on `http://localhost:3009`.

```bash
yarn
```

Create `.env.local`:

```
REACT_APP_API_URL=http://localhost:3009
REACT_APP_API_GRAPHQL_URL=http://localhost:3009/graphql
REACT_APP_API_WS=ws://localhost:3009
REACT_APP_GOOGLE_CLIENT_ID=
REACT_APP_KAKAO_REST_KEY=
```

```bash
yarn dev
```

Open http://localhost:3000.

## Scripts

| Command | Description |
|---|---|
| `yarn dev` | Development server |
| `yarn build` | Production build (`standalone` output) |
| `yarn start` | Run the production build |
| `yarn lint` | ESLint |

## Author

Abdulaziz Khalilov ([@abdulazizbay](https://github.com/abdulazizbay))
