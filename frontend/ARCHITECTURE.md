# SmartCart frontend architecture

## Boundaries

- `app/` owns application composition: router and global shell.
- `pages/` owns route-level composition and page state.
- `components/` owns reusable visual building blocks.
- `features/` owns cross-page domain state such as authentication.
- `services/` owns API transport and domain API modules.
- `types/` owns shared TypeScript contracts.
- `constants/` owns static configuration and fallback content.
- `utils/` owns pure formatters and helpers.
- `styles/` owns global tokens, resets, animations, and page styling.
- `assets/` owns local static assets. Remote catalog media comes from the backend.

## Data flow

```text
Page or feature hook
        ↓
services/*.api.ts → services/apiClient.ts
        ↓
SmartCart backend /api/v1
        ↓
typed response
        ↓
page state → reusable components
```

Pages should not contain raw fetch configuration, token handling, or duplicated formatting logic.

## Home Page composition

The Home Page will be built from independent sections in this order:

1. AnnouncementBar
2. Header
3. HeroSection
4. CategoryShowcase
5. EditorialBanner
6. NewArrivalsSection
7. CuratedProductsSection
8. TrustStrip
9. Footer

Each section receives data and callbacks through props. Sections do not own global authentication, cart, or wishlist state.

## Component rules

- One component per file.
- No intentionally minified one-line JSX.
- Keep API calls out of presentational components.
- Every async page state has loading, error, empty, and success states where applicable.
- Product cards, buttons, inputs, cards, banners, and layout primitives remain reusable across customer pages.
- Seller and admin code will live in separate feature/page namespaces later and will not be mixed into customer components.
