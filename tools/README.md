# Tools and Archived One-Off Scripts

This directory houses one-off migration, data-scraping, screenshot-auditing, and maintenance scripts that were used during initial catalog ingestion, design QA, and component tuning.

None of these scripts are part of the active production build (`npm run build`).

## Directory Contents

### Catalog & Ingestion Utilities
- `build_authorized_catalog.cjs`: Generates authorized brand catalogs.
- `clean_and_populate_catalog.mjs`: Catalog data cleaning script.
- `generate_authorized_catalog.cjs`: Compiles curated component subsets.
- `inspect_catalog.cjs`: Fast terminal inspector for catalog JSON structure.
- `all_collections.txt` / `collections.txt`: Raw collection name manifests.
- `scrape_and_integrate_zebronics.py`: Historical Zebronics product scraper.
- `generate_budget_cabinets.py` / `generate_prebuilt_i3_combo.py`: Prebuilt rig data generators.

### Legacy Testing & Visual Audits
- `test_brands_filter.cjs`: Checks multi-brand faceted filtering logic.
- `test_zebronics_and_cart_fix.mjs`: Legacy manual verification script for cart additions.
- `test_broken_links_and_viewports.mjs`: Early responsive audit script.
- `test_cabinets_update.cjs`: Validates cabinet spec synchronization.
- `audit_responsive.cjs` / `capture_full_pages.cjs` / `capture_remaining.cjs`: Playwright page capture tools.
- `check_mobile_btn.cjs` / `check_views.cjs` / `diagnose_clip.cjs`: Viewport debugging scripts.
- `verify_all_devices.cjs` / `verify_both.cjs` / `verify_changes.cjs` / `verify_whatsapp_button.cjs`: Visual smoke checks.
- `geonix_screenshot.cjs` / `intex_screenshot.cjs`: Product snapshot scripts.

### Historical Patch Scripts
- `apply_animations_and_logout_fix.cjs`: Legacy patcher for admin modal transitions.
- `update_app_nav.cjs` / `update_header.cjs`: Legacy AST navigation patchers.
- `wire_admin_portal.cjs` / `wire_login_modal.cjs`: Legacy modal wiring scripts.
- `push.bat`: Historical git push batch script with local machine paths (archived).
