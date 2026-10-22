# রবীন্দ্র সরোবর, ধানমন্ডি, ঢাকা

Independent Bengali visitor guide for the open-air cultural venue beside Dhanmondi Lake in Dhaka, Bangladesh. This is not an operator, booking, contact or official tourism service.

## Local validation

Use the pinned Node/pnpm versions and lockfile. Run `pnpm check` and `pnpm build`; these include the content and generated-output audits. `node scripts/behavior-test.mjs` checks existing analytics controls and Worker routes. `node scripts/weather-test.mjs` checks the actual client weather bundle with success/failure fixtures. The current build output remains ignored.

The Worker consolidates HTTP requests to the HTTPS apex while preserving path/query, serves the existing routes, and gives explicit error aliases genuine404/noindex responses. `wrangler.toml` names the project identified by the repository's official build check. Source configuration is not proof of a live binding or deployment; browser and production acceptance are separate.

## Public facts and photographs

See `SOURCES.md`, `THIRD_PARTY_NOTICES.md` and `src/data/photo-provenance.json`. The two current photographs are locally hosted original bytes with individual hashes, source and licence records. Their historical dates do not establish current facilities or event schedules. `scripts/download-photos.mjs` is an optional, hash-verifying recovery tool; builds do not download photos.

The existing Google Analytics choice controls that service only. Maps, Open-Meteo weather requests and possible independent hosting performance measurement are described on the privacy/settings pages. Unused preference and marketing categories cannot be activated. No private diagnostic exports belong in this repository.
