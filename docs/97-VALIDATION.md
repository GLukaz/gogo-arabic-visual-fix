---
phase: 97
slug: visual-world-layer-rebuild
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-17
---

# Phase 97 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution of the Visual/World Layer Rebuild.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest@3.0.0 with jsdom environment |
| **Config file** | `vitest.config.js` (existing) |
| **Quick run command** | `npm run test:run -- src/game/systems/__tests__/MapLoader.test.js src/game/systems/__tests__/WorldSnapshot.test.js` |
| **Full suite command** | `npm run test:run` |
| **Estimated runtime** | ~8s quick, ~90s full (2535 tests) |
| **E2E** | `npm run test:e2e` (playwright, 6 specs) |

---

## Sampling Rate

- **After every task commit:** Run quick run command (<10s feedback)
- **After every plan wave:** Run full suite (`npm run test:run`)
- **Before `/gsd-verify-work`:** Full suite + E2E + production build + manual 8-zone visual walk-through
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map (to be refined by planner)

| Req ID | Behavior | Test Type | Automated Command | File Exists |
|--------|----------|-----------|-------------------|-------------|
| WORLD-01 | Every Kenmi key in zones.js exists in KENMI_CATALOG | unit (data integrity) | `vitest run src/data/__tests__/zoneAssetIntegrity.test.js` | ❌ W0 |
| WORLD-01 | No black tiles — every ground sprite has a valid frame | integration | `vitest run src/game/systems/__tests__/MapLoader.frameValidity.test.js` | ❌ W0 |
| WORLD-02 | Each of 8 zones renders to deterministic snapshot matching fixture | integration (snapshot) | `vitest run src/game/systems/__tests__/WorldSnapshot.test.js` | ❌ W0 |
| WORLD-03 | Every NPC sprite key in NPC_KEY_MAP is in faceless whitelist | unit | `vitest run src/data/__tests__/facelessNpcs.test.js` | ❌ W0 |
| WORLD-04 | No forbidden terminology tokens in new world-layer code | lint grep | `npm run lint:world-terminology` | ❌ W0 |
| WORLD-05 | No new overlay wired in GameLayout.jsx | diff gate | manual PR review | — |
| WORLD-06 | All 2535 existing tests continue to pass | regression | `npm run test:run` | ✅ |
| WORLD-07 | 8 zone snapshot fixtures exist and parse | unit | `vitest run src/test/fixtures/__tests__/snapshotsExist.test.js` | ❌ W0 |
| WORLD-08 | WORLD-AUDIT.md exists with required sections | manual checkpoint | human-verify | — |
| WORLD-09 | mountain_village snapshot has non-zero deco/animal counts | snapshot | via WORLD-02 | (via W0) |
| WORLD-10 | farmland + coastal_port snapshots have non-zero animalCount | snapshot | via WORLD-02 | (via W0) |
| WORLD-11 | No texture key loaded twice under different keys | BootScene integration | `vitest run src/game/scenes/__tests__/BootScene.duplicateLoads.test.js` | ❌ W0 |
| WORLD-12 | Interior scenes render to valid snapshots | integration | via WORLD-02 | (via W0) |

*Status: ⬜ pending*

---

## Wave 0 Requirements (test infrastructure to add BEFORE rebuild work)

- [ ] `src/data/__tests__/zoneAssetIntegrity.test.js` — verifies every `key: 'kenmi-*'` reference in zones.js + realWorldZones.js + fantasyZones.js exists in KENMI_CATALOG (covers WORLD-01)
- [ ] `src/game/systems/__tests__/MapLoader.frameValidity.test.js` — builds each of 8 zones with mock scene, asserts every ground sprite has valid frame range (covers WORLD-01)
- [ ] `src/game/systems/world/WorldSnapshot.js` — serialisation helper: zone → deterministic tile-grid JSON
- [ ] `src/game/systems/__tests__/WorldSnapshot.test.js` — regenerates snapshot per zone, diffs against fixture (covers WORLD-02, 07, 09, 10, 12)
- [ ] `src/test/fixtures/world-snapshots/*.json` — 8 fixture files (committed AFTER zone rebuild via one-shot capture script)
- [ ] `src/data/__tests__/facelessNpcs.test.js` — asserts every NPC_KEY_MAP sprite key passes face-check (covers WORLD-03)
- [ ] `scripts/lint-world-terminology.js` + `npm run lint:world-terminology` script — greps new Phase 97 code for forbidden tokens "map"/"UI" (covers WORLD-04)
- [ ] `src/game/scenes/__tests__/BootScene.duplicateLoads.test.js` — mocks load.spritesheet/load.image, asserts no URL loaded twice under different keys (covers WORLD-11)
- [ ] Extend `src/game/systems/__tests__/mocks/sceneMock.js` to provide `textures.get(key)` returning frame enumeration for WorldSnapshot/frameValidity introspection
- [ ] `scripts/report-kenmi-coverage.js` — walks KENMI_CATALOG + zones.js, produces KENMI-COVERAGE.md listing used/unused keys

---

## Regression Artifacts to Produce

1. **Per-zone tile-grid JSON snapshots** — 8 files in `src/test/fixtures/world-snapshots/`, one per core zone. Any future MapLoader change must update intentionally.
2. **Interior snapshots** — at least `scholar_house_interior`, `merchant_house_interior`, `oasis_guild_interior`.
3. **Kenmi coverage report** — `KENMI-COVERAGE.md` listing used and unused Kenmi keys (transparency).
4. **Before/after screenshot fixtures** — `.planning/phases/97-visual-world-layer-rebuild/screenshots/{before,after}/{zoneId}.png` (8 before + 8 after, manual capture).
5. **BootScene duplicate-load detection** — test PASS/FAIL gate, no artifact beyond the test.

---

## Specific Test Files That Must NOT Regress

These 11 currently-passing system tests directly touch the visual layer:

- `src/game/systems/__tests__/MapLoader.test.js` (42 assertions)
- `src/game/systems/__tests__/NPCManager.test.js`
- `src/game/systems/__tests__/InteractableManager.test.js`
- `src/game/systems/__tests__/ZoneTransition.test.js`
- `src/game/systems/__tests__/PlayerController.test.js`
- `src/game/systems/__tests__/SceneStackManager.test.js`
- `src/game/systems/__tests__/DOMOverlay.test.js`
- `src/game/systems/__tests__/DialogueEngine.test.js`
- `src/game/systems/__tests__/EquipmentManager.test.js`
- `src/game/systems/battle/__tests__/BattleStateMachine.test.js`
- `src/game/systems/companions/__tests__/CompanionManager.test.js`

Plus the broader 2535-test-pass invariant.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| All 8 zones render visually clean on first play | WORLD-01 + WORLD-02 | Rendered pixel quality is subjective | `npm run dev`, walk through every zone, screenshot each |
| Kenmi art style feels consistent across zones | WORLD-02 | Consistency is perceptual | Side-by-side screenshot comparison |
| WORLD-AUDIT.md sections are complete | WORLD-08 | Human review of audit findings | Verify required sections present |
| No new overlay wired in GameLayout.jsx | WORLD-05 | PR-level diff inspection | `git diff main -- src/components/GameLayout.jsx` returns no new overlay imports |
| Before/after screenshots committed | Regression-artifact item 4 | Visual comparison | Count 8 before + 8 after PNGs in phase screenshots dir |

---

## Security Domain

**Applicable?** No. This phase is a pure in-canvas visual rebuild with no auth, no user input, no network, no secrets, no dynamic content. Standard project-level server controls (JWT cookies, CSRF, Helmet, Zod, rate limiting) remain in place and untouched by Phase 97.

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
