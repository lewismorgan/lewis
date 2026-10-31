---
name: battlenet-api
description: 'Create Battle.net API DTOs and Endpoint structs for Azerdex from JSON schema. Use when adding a new Battle.net endpoint, mapping JSON responses into Rust DTOs, deciding DTO reuse across contexts, or wrapping responses in Endpoint structs. Covers character and account patterns and excludes auth endpoints.'
---

# Battle.net DTO and Endpoint Generation

Teach agents how to create DTOs, Request/Response structs, and the minimal client wiring from JSON schema while following Azerdex conventions. The goal is to reduce DTO duplication, keep endpoint responses encapsulated, and keep DTOs reusable across contexts.

## When to Use This Skill

- Adding a new Battle.net API endpoint in `crates/azerdex-api/src/endpoint/`
- Creating new DTOs in `crates/azerdex-api/src/dto/` based on JSON schema
- Refactoring DTOs to be reusable across endpoints (context-based organization)
- Mapping JSON fields to Rust structs with `serde` attributes

> Excludes auth endpoints. Auth uses a different pattern and is not covered here.

## Prerequisites

- JSON schema or example response for the endpoint
- Endpoint route and namespace
- Awareness of existing DTOs in `crates/azerdex-api/src/dto` to avoid duplication

## Step-by-Step Workflows

### 1. Identify the data context

1. Determine the context folder under `crates/azerdex-api/src/dto/` (example: `character/`, `account/`).
2. If the context does not exist, create it in both `dto/<context>/` and `endpoint/<context>/`.

### 2. Reuse existing DTOs where possible

1. Scan existing DTOs for common data shapes. Example: `CharacterSummaryDto` is reused in account and character contexts.
2. Only introduce a new DTO when the shape is different enough to justify it (example: `GuildRealmDto` vs `RealmDto`).

### 3. Create DTOs from the JSON schema

1. Create a new `*.rs` file in `dto/<context>/` (use `snake_case` filenames).
2. Define DTOs with `PascalCase` + `Dto` suffix.
3. Map JSON fields to Rust with `#[serde(rename = "...")]` when names differ.
4. Keep DTOs focused on data shapes. Avoid endpoint-specific naming in DTOs.

Use the template: [DTO template](./templates/dto.template.rs)

### 4. Create Response + Request structs (always required)

1. Add an endpoint file in `endpoint/<context>/` containing both the Response struct and the Request struct.
2. Response structs use `PascalCase` + `Response` suffix.
3. Always create a wrapper Response struct, even if it matches a DTO 1:1.
4. Use `#[serde(flatten)]` only when the endpoint response is identical to the DTO shape.
5. Otherwise, wrap DTOs in named fields that match the endpoint response.
6. Create a Request struct with `PascalCase` + `Request` suffix and implement `EndpointRequest`.
7. Add a `new()` constructor that normalizes parameters (use `to_ascii_lowercase()` for slugs/names).

Use templates:
- [Endpoint Response (flatten)](./templates/endpoint_flat.template.rs)
- [Endpoint Response (wrapped)](./templates/endpoint_wrap.template.rs)
- [Endpoint Request](./templates/request.template.rs)

### 5. Export modules

1. Re-export DTOs in `dto/<context>.rs` for clean access.
2. Re-export responses in `endpoint/<context>.rs` for clean access.

Use the template: [DTO mod template](./templates/dto_mod.template.rs)

### 6. Add client extension traits (brief)

Extension traits allow any `BattleNetClient` implementation to call the endpoint without custom boilerplate.

1. Declare a trait in `crates/azerdex-api/src/client/traits.rs` named `<EndpointName>Ext`.
2. Add a `get_*` method signature returning `ApiResult<...Response>`.
3. Add a blanket implementation in `crates/azerdex-api/src/client/trait_impl.rs` that constructs the Request and calls `self.request(&request).await`.

Use templates:
- [Extension trait](./templates/extension_trait.template.rs)
- [Trait implementation](./templates/trait_impl.template.rs)

### 7. Cross-check with current conventions

Use these in-repo references as source of truth for structure and naming:

- DTO patterns:
  - `crates/azerdex-api/src/dto/character.rs`
  - `crates/azerdex-api/src/dto/character/profile.rs`
  - `crates/azerdex-api/src/dto/character/media.rs`
- Endpoint patterns:
  - `crates/azerdex-api/src/endpoint/character.rs`
  - `crates/azerdex-api/src/endpoint/character/profile.rs`
  - `crates/azerdex-api/src/endpoint/character/media.rs`
- Client extension patterns:
  - `crates/azerdex-api/src/client/traits.rs`
  - `crates/azerdex-api/src/client/trait_impl.rs`

## Troubleshooting

| Issue | Likely Cause | Fix |
| --- | --- | --- |
| Missing data during deserialization | Field name mismatch | Add `#[serde(rename = "...")]` for JSON field names |
| Too many duplicate DTOs | DTOs created per endpoint | Move shared shapes into a context DTO and reuse it |
| Endpoint struct missing | Endpoint response deserialized directly into DTO | Always create an Endpoint wrapper and deserialize into it |
| Flatten used incorrectly | Endpoint response is not identical to the DTO | Switch to named fields instead of `#[serde(flatten)]` |

## References

- Character profile example response: [character_profile_summary_endpoint.json](./references/character_profile_summary_endpoint.json)
- DTO template: [dto.template.rs](./templates/dto.template.rs)
- Endpoint Response (flatten) template: [endpoint_flat.template.rs](./templates/endpoint_flat.template.rs)
- Endpoint Response (wrapped) template: [endpoint_wrap.template.rs](./templates/endpoint_wrap.template.rs)
- Endpoint Request template: [request.template.rs](./templates/request.template.rs)
- Extension trait template: [extension_trait.template.rs](./templates/extension_trait.template.rs)
- Trait implementation template: [trait_impl.template.rs](./templates/trait_impl.template.rs)
- DTO mod template: [dto_mod.template.rs](./templates/dto_mod.template.rs)
