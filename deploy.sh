#!/bin/bash
# deploy.sh — Quick deployment helper for aldrich-portfolio

APP_ID="${ALDRICH_APP_ID:-}"  # Set via: export ALDRICH_APP_ID=<your-app-id>

if [ -z "$APP_ID" ]; then
  echo "Error: ALDRICH_APP_ID environment variable not set"
  echo "Run: export ALDRICH_APP_ID=<your-app-id>"
  echo "Get your app ID from: doctl apps list"
  exit 1
fi

case "$1" in
  status)
    doctl apps list-deployments "$APP_ID" --format ID,Phase,Progress,Created | head -5
    ;;
  logs)
    doctl apps logs "$APP_ID" --type="${2:-run}" --follow
    ;;
  deploy)
    doctl apps create-deployment "$APP_ID"
    echo "Deployment triggered. Run './deploy.sh status' to monitor."
    ;;
  update-spec)
    doctl apps update "$APP_ID" --spec .do/app.yaml
    echo "App spec updated."
    ;;
  info)
    doctl apps get "$APP_ID"
    ;;
  *)
    echo "Usage: ./deploy.sh {status|logs [build|deploy|run]|deploy|update-spec|info}"
    echo ""
    echo "Commands:"
    echo "  status      - Check deployment status"
    echo "  logs        - View logs (default: run, options: build, deploy, run)"
    echo "  deploy      - Trigger a new deployment"
    echo "  update-spec - Update app from .do/app.yaml"
    echo "  info        - Show app details"
    ;;
esac
