# Kartik Furniture House

## Current State
The DesignWizardSection in Home.tsx has a 5-step wizard:
- Step 1: Furniture Type (card selector)
- Step 2: Dimensions & Material
- Step 3: Your Details (Name, Phone, City, Budget, Description)
- Step 4: Upload Images
- Step 5: Review & Submit

The section heading is not "Get a Free Quote" style. WhatsApp floating button exists but may overlap CTAs. No post-submit popup with WhatsApp redirect. No step indicator text like "Step 1 of 3".

## Requested Changes (Diff)

### Add
- Step indicator text: "Step 1 of 3", "Step 2 of 3", "Step 3 of 3" above the progress bar
- New heading: "Get Your Custom Furniture Quote in 10 Minutes"
- Subheading: "Direct from manufacturer • Best price • Free consultation"
- Trust badges below form: "500+ Happy Customers", "5+ Years Experience", "Direct Factory Pricing"
- Urgency line: "Limited bookings today – Contact now"
- Submit button text: "Get Free Quote on WhatsApp"
- Line below submit: "⚡ Response within 15 minutes"
- Post-submit popup/modal: "Thank you! We will contact you shortly" then auto-open WhatsApp with prefilled message including form data
- Note on Step 3 image upload: "If not uploading, you can send images on WhatsApp after submission"
- WhatsApp floating button: pulse animation, repositioned slightly higher/inward to avoid overlap

### Modify
- Collapse 5 steps → 3 steps:
  - Step 1: Full Name, Phone Number (10-digit validation), City
  - Step 2: Furniture Type (dropdown: Bed, Sofa, Table, Repair, Custom), Budget Range (₹5k–10k, ₹10k–25k, ₹25k+), Material (Sheesham, Teak, Plywood, Other)
  - Step 3: Description (textarea), Image Upload (multiple, preview before submit, blob storage upload)
- Remove dimension fields (Length/Width/Height) and Color/Finish fields
- Remove the old 5-step structure
- WhatsApp message template updated to include: Furniture Type, Material, Budget, Name, City, Description
- Step 3 image upload uses existing blob storage (uploadImageToStorage util)
- Validation: Step 1 validates Name/Phone/City before advancing

### Remove
- Old 5-step wizard structure (furniture type card grid, dimensions step, color field, separate review/submit step)
- Static furniture type previews per step (since type is now a simple dropdown in step 2)

## Implementation Plan
1. Replace WIZARD_STEPS constant with 3-step version
2. Rewrite DesignWizardSection state (remove dimension/color state, keep name/phone/city/furnitureType/budget/material/description/images)
3. Implement renderStep1 (Name, Phone, City with large mobile-friendly inputs)
4. Implement renderStep2 (Furniture Type dropdown, Budget Range dropdown, Material dropdown)
5. Implement renderStep3 (Description textarea, multi-image upload with preview, WhatsApp backup note)
6. Add step indicator text "Step X of 3" above progress indicator
7. Update section heading/subheading
8. Update CTA button text + response time line
9. Add trust badges + urgency line below form
10. Add post-submit success modal with WhatsApp redirect
11. Update WhatsApp pulse animation + adjust position classes on floating button
12. Validate Step 1 before advancing
