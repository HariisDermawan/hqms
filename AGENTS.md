<laravel-boost-guidelines>
=== foundation rules ===

# Laravel Boost Guidelines

The Laravel Boost guidelines are specifically curated by Laravel maintainers for this application. These guidelines should be followed closely to ensure the best experience when building Laravel applications.

## Foundational Context

This application is a Laravel application running on PHP 8.3. You are an expert with the Laravel ecosystem. Always use the APIs that match the installed major version of each package — do not assume a version.

Before relying on a package's API, confirm its installed version:

- PHP packages: run `composer show --direct` to list direct dependencies with versions, or `composer show <vendor/package>` for a single package.
- JS packages: check `package.json` for the installed versions.

## Conventions

- You must follow all existing code conventions used in this application. When creating or editing a file, check sibling files for the correct structure, approach, and naming.
- Use descriptive names for variables and methods. For example, `isRegisteredForDiscounts`, not `discount()`.
- Check for existing components to reuse before writing a new one.

## Verification Scripts

- Do not create verification scripts or tinker when tests cover that functionality and prove they work. Unit and feature tests are more important.

## Application Structure & Architecture

- Stick to existing directory structure; don't create new base folders without approval.
- Do not change the application's dependencies without approval.

## Frontend Bundling

- If the user doesn't see a frontend change reflected in the UI, it could mean they need to run `npm run build`, `npm run dev`, or `composer run dev`. Ask them.

## Documentation Files

- You must only create documentation files if explicitly requested by the user.

## Replies

- Be concise in your explanations - focus on what's important rather than explaining obvious details.

=== boost rules ===

# Laravel Boost

## Project Rules

- This project contains committed, area-grouped rules in `.ai/rules` when that directory exists (settled decisions, non-obvious traps, standing constraints). Framework and package guidelines that only apply to specific paths (testing, frontend, components) also live there, under `.ai/rules/boost` — this is not just recorded decisions, it is load-bearing guidance you have not seen inline. Before you enter plan mode or create/edit any file, you MUST first: open @.ai/rules/index.md (it maps file globs to rule files), read every rule file whose globs cover the path(s) in scope, and run `grep -rin 'keyword' .ai/rules` to catch what a path match alone misses. Do not write code until you have read and are following every matching rule. If `.ai/rules` does not exist, continue without it.

## Artisan

- Run Artisan commands directly via the command line (e.g., `php artisan route:list`). Use `php artisan list` to discover available commands and `php artisan [command] --help` to check parameters.
- Inspect routes with `php artisan route:list`. Filter with: `--method=GET`, `--name=users`, `--path=api`, `--except-vendor`, `--only-vendor`.
- Read configuration values using dot notation: `php artisan config:show app.name`, `php artisan config:show database.default`. Or read config files directly from the `config/` directory.

## Tinker

- Execute PHP in app context for debugging and testing code. Do not create models without user approval, prefer tests with factories instead. Prefer existing Artisan commands over custom tinker code.
- Always use single quotes to prevent shell expansion: `php artisan tinker --execute 'Your::code();'`
    - Double quotes for PHP strings inside: `php artisan tinker --execute 'User::where("active", true)->count();'`

=== php rules ===

# PHP

- Always use curly braces for control structures, even for single-line bodies.
- Use PHP 8 constructor property promotion: `public function __construct(public GitHub $github) { }`. Do not leave empty zero-parameter `__construct()` methods unless the constructor is private.
- Use explicit return type declarations and type hints for all method parameters: `function isAccessible(User $user, ?string $path = null): bool`
- Use TitleCase for Enum keys: `FavoritePerson`, `BestLake`, `Monthly`.
- Prefer PHPDoc blocks over inline comments. Only add inline comments for exceptionally complex logic.
- Use array shape type definitions in PHPDoc blocks.

=== deployments rules ===

# Deployment

- Laravel can be deployed using [Laravel Cloud](https://cloud.laravel.com/), which is the fastest way to deploy and scale production Laravel applications.

=== inertia-laravel/core rules ===

# Inertia

- Inertia creates fully client-side rendered SPAs without modern SPA complexity, leveraging existing server-side patterns.
- Components live in `resources/js/pages` (unless specified in `vite.config.js`). Use `Inertia::render()` for server-side routing instead of Blade views.
- ALWAYS use `search-docs` tool for version-specific Inertia documentation and updated code examples.
- IMPORTANT: Activate `inertia-react-development` when working with Inertia client-side patterns.

# Inertia v3

- Use all Inertia features from v1, v2, and v3. Check the documentation before making changes to ensure the correct approach.
- New v3 features: standalone HTTP requests (`useHttp` hook), optimistic updates with automatic rollback, layout props (`useLayoutProps` hook), instant visits, simplified SSR via `@inertiajs/vite` plugin, custom exception handling for error pages.
- Carried over from v2: deferred props, infinite scroll, merging props, polling, prefetching, once props, flash data.
- When using deferred props, add an empty state with a pulsing or animated skeleton.
- Axios has been removed. Use the built-in XHR client with interceptors, or install Axios separately if needed.
- `Inertia::lazy()` / `LazyProp` has been removed. Use `Inertia::optional()` instead.
- Prop types (`Inertia::optional()`, `Inertia::defer()`, `Inertia::merge()`) work inside nested arrays with dot-notation paths.
- SSR works automatically in Vite dev mode with `@inertiajs/vite` - no separate Node.js server needed during development.
- Event renames: `invalid` is now `httpException`, `exception` is now `networkError`.
- `router.cancel()` replaced by `router.cancelAll()`.
- The `future` configuration namespace has been removed - all v2 future options are now always enabled.

=== laravel/core rules ===

# Do Things the Laravel Way

- Use `php artisan make:` commands to create new files (i.e. migrations, controllers, models, etc.). You can list available Artisan commands using `php artisan list` and check their parameters with `php artisan [command] --help`.
- If you're creating a generic PHP class, use `php artisan make:class`.
- Pass `--no-interaction` to all Artisan commands to ensure they work without user input. You should also pass the correct `--options` to ensure correct behavior.

### Model Creation

- When creating new models, create useful factories and seeders for them too. Ask the user if they need any other things, using `php artisan make:model --help` to check the available options.

## APIs & Eloquent Resources

- For APIs, default to using Eloquent API Resources and API versioning unless existing API routes do not, then you should follow existing application convention.

## URL Generation

- When generating links to other pages, prefer named routes and the `route()` function.

## Testing

- When creating models for tests, use the factories for the models. Check if the factory has custom states that can be used before manually setting up the model.
- Faker: Use methods such as `$this->faker->word()` or `fake()->randomDigit()`. Follow existing conventions whether to use `$this->faker` or `fake()`.
- When creating tests, make use of `php artisan make:test [options] {name}` to create a feature test, and pass `--unit` to create a unit test. Most tests should be feature tests.

## Vite Error

- If you receive an "Illuminate\Foundation\ViteException: Unable to locate file in Vite manifest" error, you can run `npm run build` or ask the user to run `npm run dev` or `composer run dev`.

=== wayfinder/core rules ===

# Laravel Wayfinder

Use Wayfinder to generate TypeScript functions for Laravel routes. Import from `@/actions/` (controllers) or `@/routes/` (named routes).

=== pint/core rules ===

# Laravel Pint Code Formatter

- If you have modified any PHP files, you must run `vendor/bin/pint --dirty --format agent` before finalizing changes to ensure your code matches the project's expected style.
- Do not run `vendor/bin/pint --test --format agent`, simply run `vendor/bin/pint --format agent` to fix any formatting issues.

=== pest/core rules ===

# Pest

- This project uses Pest. Create tests with `php artisan make:test --pest {name}`.
- Do not include the test suite directory in `{name}`. Use `SomeFeatureTest`, not `Feature/SomeFeatureTest`.
- Read the `testing-best-practices` skill for guidance on coverage, naming, structure, dependency isolation, and review.
- Do not delete tests or test files without approval. They are part of the application.

## Running Tests

- Run the narrowest set of tests that covers the change. Pass a file path or `--filter=testName` to `php artisan test --compact`.
- Rerun a test after each change to it.
- Run `vendor/bin/pest` to call the test runner directly. It accepts the same file path and `--filter=testName` arguments.
- After the feature tests pass, ask the user to run the complete suite with `php artisan test --compact`.

=== inertia-react/core rules ===

# Inertia + React

- IMPORTANT: Activate `inertia-react-development` when working with Inertia React client-side patterns.

</laravel-boost-guidelines>

# Repository notes (RS Merdeka / HQMS)

Stack: Laravel 13 (PHP 8.3) backend + Inertia v3 / React 19 SPA, session-based Sanctum auth, Spatie permissions. There is no `.ai/rules` directory and no repo-local OpenCode config (the boost block's project-rules step is a no-op here). Vite wrapper is `vite-plus` (`vp`), configured in `vite.config.ts` (not `.js`). CI runs in `.github/workflows/tests.yml`. The `README.md` is a stale marketing skeleton (HRS Medika branding, "Sesuaikan dengan teknologi yang digunakan") — trust these notes and the code, not it.

## Commands

- Dev: `composer run dev` (runs `php artisan dev`, starting Laravel server + Vite together). Frontend: `npm run dev` / `npm run build` (`vp build`).
- Verify after changes:
    - PHP: `vendor/bin/pint` (or `composer run lint`), then `php artisan test --compact`. (`composer run types:check` = phpstan, currently broken — see below.)
    - TS: `npm run types:check` (`tsc --noEmit`); `npm run check` (`vp check`, vite-plus formatter/lint gate, `denyWarnings: true`). Only the generated dirs `resources/js/actions|routes|wayfinder` and `resources/js/components/ui/*` are ignore-listed in `vite.config.ts` — `resources/js/api/*` are hand-written and linted, so keep them formatted.
    - `composer run test` runs the full gate: config:clear → `pint --test` → phpstan → `php artisan test`. `composer run ci:check` = `npm run check` + `npm run types:check` + `composer run test`.
    - `npm run check` may fail on formatting even when `npm run types:check` passes — run `npm run check --fix` (or `vp check --fix`) to apply formatter.
- CI (`.github/workflows/tests.yml`): on push to `main` and PRs runs `composer setup` (installs deps, copies `.env`, `key:generate`, migrates with `--force`, builds frontend; it does NOT seed) then `composer ci:check` — PHP 8.3, Node 22. Feature tests run against in-memory SQLite there, so new migrations must work on SQLite too.
- Tests are Pest; feature tests run on in-memory SQLite (`phpunit.xml` sets `DB_CONNECTION=sqlite`, `:memory:`) and authenticate via `Sanctum::actingAs()` + `User::factory()` (see `tests/Feature/AntrianApiTest.php`). Run one test with `php artisan test --compact --filter=...` or `vendor/bin/pest <file>`.

## Database divergence

- Dev `.env` uses MySQL (`hqms_db`), but tests/CI run on in-memory SQLite. Keep migrations portable to both; avoid MySQL-only column types or raw SQL that SQLite rejects. Run tests locally (SQLite) before pushing.

## Known broken gate (verified, not caused by your diff)

- **PHPStan currently cannot run** — `composer run test` and `composer run types:check` fail at bootstrap with `Undefined constant "Larastan\Larastan\LARAVEL_VERSION"` in `LarastanStubFilesExtension.php:25`. This is a Larastan 3.x / Laravel 13 environment incompatibility that fails before analyzing any code — it is NOT caused by app changes. Fall back to `vendor/bin/pint` + `vendor/bin/pest` for PHP verification, and treat `composer run ci:check` / the GitHub `tests` workflow as failing at the phpstan step regardless of your diff.
- `vendor/bin/pint --test` is repo-wide; run `vendor/bin/pint` to fix files (or `--dirty` for just changes) to keep the gate green.

## Architecture & conventions

- API is versioned in `routes/api.php` under `Route::prefix('v1')->middleware(StartSession::class)`. This group has no `web` middleware, so the explicitly-added `StartSession::class` (`routes/api.php:24`) is what makes session auth work outside the web group — do not remove it.
    - **Public (no auth):** `auth/register`, `auth/login`, and the `kiosk` group (polis, tickets, now-serving, attendance/scan).
    - **`auth:sanctum`:** `auth/me`, `auth/me` PUT, `auth/me/password`, `auth/logout`; apiResources for `polis`, `ruangans`, `pasiens`, `pendaftarans`, `antrians`, `dokters`, `perawats`, `presensis`, `jadwal-dokters`, `pemeriksaans`, `obats`, `pembayarans`, `faqs`, `testimonials`, `messages`; custom ruangan sub-routes (`ruangans/{ruangan}/antrians`, `ruangans/{ruangan}/pasiens` POST/DELETE); and `monitoring` GET.
- Per-resource pattern: `Api/*Controller` (thin, calls `Gate::authorize`) → `Services/*Service` (owns DB transactions) → `Requests/*Request` → `Resources/*Resource`.
- Every API JSON response uses the envelope `{ success, message, data }`; list endpoints return `data.items` + `data.pagination` (see `PoliController::index`).
- Frontend: pages in `resources/js/pages` (per resource: `Index`/`Create`/`Edit`/`Show`, plus Kiosk, Dashboard, Monitoring, Auth, Profile). `routes/web.php` holds Inertia closures. Query-string-driven pages: `Pendaftaran/Create` (`?antrian_id=N`), `Pemeriksaan/Create` (`?antrian_id=N&pasien_id=N&poli_id=N`), `Obat/Create` and `Pembayaran/Create` (`?pemeriksaan_id=N`), `Message/Edit` (`?reply=1`). Kiosk routes: `/ticket`, `/antrians-ticker`, `/absen-karyawan`.
- API wrappers in `resources/js/api/*.ts` share the axios instance in `resources/js/lib/axios.ts`. TS alias `@/*` → `resources/js/*`.
- Wayfinder (`@laravel/vite-plugin-wayfinder`, `formVariants: true`) generates typed route functions at build/dev time into `resources/js/actions/**` (controllers) and `resources/js/routes|wayfinder/**` — treat those as generated; import from `@/actions/...` or `@/routes/...`.
- User resource exposes roles via Spatie (`UserResource` → `getRoleNames()`). Seeders: `RolePermissionSeeder`, `AdminSeeder`, plus one seeder per resource.

## Domain rules (non-obvious)

- **Queue number format** is `"{$poli->queue_prefix}-NNN"` (e.g. `B-001`; no poli name prefix), built in `AntrianService::create` (per poli + date, including soft-deleted rows via `withTrashed()`) and `PendaftaranService::generateQueueNumber`. `queue_prefix` lives on `polis` (A–Z, one letter per poli, seeded). Carefully check the current format before writing tests or assertions — it changed with the ticket rework.
- **Ticket ↔ Pendaftaran link**: the `antrian_id` FK lives on `pendaftarans` (migration `rework_antrian_ticket_and_pendaftaran_link`). When a Pendaftaran is created with `antrian_id` set, it copies the Antrian's `queue_number`/`poli_id`, assigns a `REG-YYYYMMDD-{prefix}NNN` registration number, and marks the Antrian `called`. `Pendaftaran` status mirrors `Antrian` status in `AntrianService::update`: `called`/`serving`/`completed` copy directly; Antrian `skipped` resets Pendaftaran to `waiting`; deleting an Antrian reverts its Pendaftaran to `waiting`.
- `Antrian` and `Pendaftaran` each have their own `queue_number`; the Antrian number is generated independently at ticket time (per poli/date), while Pendaftaran copies it when linked to a ticket.

## Auth gotchas (hard-won)

- Auth is cookie/session-based (Sanctum "stateful" requests), NOT bearer tokens. Stateful hosts come from `SANCTUM_STATEFUL_DOMAINS` env or the `config/sanctum.php` fallback (`localhost,localhost:3000,127.0.0.1,127.0.0.1:8000,::1` — `.env.example` does not set it, though the local `.env` sets `127.0.0.1:8000,localhost:8000`). If the host:port you open the app with is missing from the effective list: login succeeds, but the first authenticated API call after a page load returns 401 and the SPA bounces back to login.
- Seeded accounts (all password `password`, see `AdminSeeder`): `admin@hqms` (Super Admin), `staf_loket@hqms` (Staf Loket), `staf_obat@hqms` (Staf Obat), and five Dokter logins (`dr.budi@hqms`, `drg.siti@hqms`, `dr.andi@hqms`, `dr.dewi@hqms`, `dr.rahmat@hqms`).
- Never hardcode the API base URL; keep `axios` requests same-origin (`resources/js/lib/axios.ts` uses `import.meta.env.VITE_API_URL || ''` with `withCredentials` + `withXSRFToken`). Leave `VITE_API_URL` unset unless the API is deliberately hosted elsewhere.
- Manual API testing (curl/PowerShell) must replay the browser flow: load a web page or `/sanctum/csrf-cookie` to obtain the `XSRF-TOKEN` cookie, send it as `X-XSRF-TOKEN` on stateful POSTs, and reuse the cookie jar. In PowerShell, call `curl.exe` (plain `curl` aliases to `Invoke-WebRequest`).
