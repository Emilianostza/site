# 3D Asset Pipeline

This document covers the asset editing, optimization, and delivery format standards for the Managed Capture 3D Platform. For authentication and access control related to asset delivery, see `docs/docs.2/auth-roadmap.md` (Phase 5).

## Canonical Delivery Format

- Standardize client deliverables as **GLB (binary glTF)** for WebAR distribution (single-file, runtime-friendly).
- GLB is the primary format for MyWebAR and most WebAR viewers.

## Editor Recommendation

- Use **Blender** as the primary editor for post-processing managed-capture outputs:
  - Cleanup and mesh repair
  - Decimation and retopology
  - UV unwrapping
  - Texture baking
  - GLB export

## MyWebAR Compatibility

- Align exports to what MyWebAR accepts (GLB for animated assets; additional accepted formats as needed).
- Test deliverables in MyWebAR viewer before client delivery.

## Optimization Checklist

- [ ] **Polygon Reduction**: Decimate or retopologize to mobile-friendly poly counts for WebAR performance.
- [ ] **Texture Baking**: Bake high-poly detail into normal maps and AO maps for low-poly deliverables.
- [ ] **Texture Resolution**: Limit texture dimensions for mobile; use web-friendly formats. Consider KTX2/Basis Universal where viewer support exists.
- [ ] **Asset Validation**: Validate glTF/GLB assets prior to delivery. Automate validation in CI/CD if possible (e.g., `gltf-validator`).
- [ ] **File Size Targets**: Define maximum file size thresholds per asset type for acceptable WebAR load times.

## Storage Architecture

- **Source captures** (high-res, raw): Stored in a protected bucket/path. Accessible only to employees and admins.
- **Client deliverables** (optimized GLB): Stored in a separate bucket/path. Access scoped to the assigned tenant/client via authorization policies (see auth-roadmap.md).
