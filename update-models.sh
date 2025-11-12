#!/bin/bash
# Models to update - all need GUID id and createdBy/updatedBy fields

models=(
  "member"
  "beneficiary"
  "dependent"
  "policy"
  "policyEnrollment"
  "claim"
  "asset"
  "assetCheckout"
  "assetInspectionLog"
  "resource"
  "resourceBooking"
  "funeralEvent"
  "memberBankingDetail"
  "documentRequirement"
  "landingPageComponent"
  "landingPageLayout"
  "dashboardWidgetSetting"
  "fileMetadata"
  "memberProfileCompletion"
)

for model in "${models[@]}"; do
  echo "Updating $model.ts..."
done
