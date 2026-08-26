# Assumptions

Product decisions made where the brief did not specify behavior:

- The product is a personal spending dashboard, so no multi-user account model was added.
- Currency is displayed as INR (`₹`) because the seeded data uses `INR` and the existing UI is Indian-localized.
- The dashboard bill is a single fixed demo bill of INR 24,580, due September 5.
- "Pay Bill" means a demo confirmation only. It does not charge a card, connect to a payment provider, or persist a payment record.
- Transaction search matches merchant name or transaction ID and is submitted explicitly rather than searching on every keystroke.
- Search results use the same 20-record server-side pagination as the full transaction list.
- Transaction status values are treated as `SUCCESS`, `FAILED`, or another pending/unknown value for display purposes.
- The UI does not require authentication because no user identity or authorization contract was provided.
- The existing seeded transaction fields are the source of truth for the initial schema.
- The current frontend deployment URL was not present in repository configuration, so it is intentionally not guessed in the README.
