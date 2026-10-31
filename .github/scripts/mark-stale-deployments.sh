#!/usr/bin/env bash
# Marks stale GitHub deployments inactive.
#
# A deployment is stale when it isn't inactive yet and either:
#   - gone:  its URL returns 404/410 (Vercel has deleted it), or
#   - old:   it's older than the environment's max age (Preview only).
# Live Production deployments are never marked by age, and the newest
# deployment per environment is never touched.
#
# Env: GH_TOKEN, REPO (owner/name), DEBUG=true for a dry run.
# Usage: mark-stale-deployments.sh "<Environment>:<max age days|0 = no age limit>" ...
set -euo pipefail

: "${REPO:?REPO is required}"
DEBUG="${DEBUG:-false}"
FAILED=()

probe() {
  # Don't follow redirects: Vercel's auth redirect (302/401) means the deployment exists.
  curl -s -o /dev/null -w '%{http_code}' --max-time 15 "$1" || echo 000
}

for SPEC in "$@"; do
  ENVIRONMENT="${SPEC%%:*}"
  MAX_AGE_DAYS="${SPEC##*:}"
  CUTOFF=""
  if [ "$MAX_AGE_DAYS" -gt 0 ]; then
    CUTOFF=$(date -u -d "$MAX_AGE_DAYS days ago" '+%Y-%m-%dT%H:%M:%SZ')
  fi

  echo "::group::$ENVIRONMENT (max age: ${MAX_AGE_DAYS}d${CUTOFF:+, cutoff $CUTOFF})"

  # Newest first. Fails the job if the listing fails.
  DEPLOYMENTS=$(gh api "repos/$REPO/deployments?environment=$ENVIRONMENT&per_page=100" \
    --paginate --jq '.[] | [.id, .created_at, .sha[0:7]] | @tsv')

  MARKED=0
  NEWEST=true
  printf '%-12s %-20s %-8s %-9s %-5s %s\n' id created_at sha state http action
  while IFS=$'\t' read -r ID CREATED SHA; do
    [ -z "$ID" ] && continue
    STATUS=$(gh api "repos/$REPO/deployments/$ID/statuses?per_page=1" \
      --jq '.[0] | [(.state // "none"), (.environment_url // .target_url // "")] | @tsv')
    STATE=$(cut -f1 <<<"$STATUS")
    URL=$(cut -f2 <<<"$STATUS")
    STATE=${STATE:-none}

    ACTION=keep
    CODE=-
    if [ "$NEWEST" = true ]; then
      ACTION="keep (newest)"
      NEWEST=false
    elif [ "$STATE" = inactive ]; then
      ACTION="skip (already inactive)"
    else
      [ -n "$URL" ] && CODE=$(probe "$URL")
      case "$CODE" in
        404|410) ACTION="mark (gone)" ;;
        *)
          if [ -n "$CUTOFF" ] && [[ "$CREATED" < "$CUTOFF" ]]; then
            ACTION="mark (older than ${MAX_AGE_DAYS}d)"
          fi
          ;;
      esac
    fi

    printf '%-12s %-20s %-8s %-9s %-5s %s\n' "$ID" "$CREATED" "$SHA" "$STATE" "$CODE" "$ACTION"

    if [[ "$ACTION" == mark* ]] && [ "$DEBUG" != true ]; then
      if gh api "repos/$REPO/deployments/$ID/statuses" \
        -f state=inactive \
        -f description="Marked inactive by cleanup workflow: ${ACTION#mark }" \
        --silent; then
        MARKED=$((MARKED + 1))
      else
        echo "::error::Failed to mark $ENVIRONMENT deployment $ID inactive"
        FAILED+=("$ID")
      fi
    fi
  done <<<"$DEPLOYMENTS"

  if [ "$DEBUG" = true ]; then
    echo "Dry run: no changes made."
  else
    echo "Marked $MARKED $ENVIRONMENT deployments inactive."
  fi
  echo "::endgroup::"
done

if [ "${#FAILED[@]}" -gt 0 ]; then
  echo "::error::Failed to mark ${#FAILED[@]} deployments inactive: ${FAILED[*]}"
  exit 1
fi
