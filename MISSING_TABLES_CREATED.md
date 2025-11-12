# Missing Tables - Created Models and Services

## Summary
The following tables were missing from the Node API (Sequelize) but exist in the C# backend. They have now been created to align both projects.

## New Models Created

### 1. Invoice
**File**: `src/models/invoice.ts`
**Table**: `Invoices`

Fields:
- `id` (UUID, Primary Key)
- `tenantId` (UUID, Required)
- `memberId` (UUID, Required) - Foreign key to Member
- `amountDue` (DECIMAL, Required)
- `dueDate` (DATE, Required)
- `issueDate` (DATE, Required)
- `isPaid` (BOOLEAN, Default: false)
- `invoiceNumber` (STRING 100, Optional)
- `createdAt`, `updatedAt` (Timestamps)
- `createdBy`, `updatedBy` (UUID, Optional)

**Service**: `src/services/invoiceService.ts`
Endpoints:
- POST `createInvoice` - Create new invoice
- GET `getInvoiceById/:id` - Get invoice by ID
- GET `getInvoicesByMember/:memberId` - Get all invoices for a member
- GET `getAllInvoices` - Get all invoices for tenant
- PUT `updateInvoice/:id` - Update invoice
- DELETE `deleteInvoice/:id` - Delete invoice

---

### 2. Payment
**File**: `src/models/payment.ts`
**Table**: `Payments`

Fields:
- `id` (UUID, Primary Key)
- `tenantId` (UUID, Required)
- `memberId` (UUID, Required) - Foreign key to Member
- `amount` (DECIMAL, Required)
- `paymentDate` (DATE, Required)
- `paymentMethod` (STRING 50, Optional) - e.g., "Cash", "Bank Transfer", "Check"
- `transactionId` (STRING 100, Optional)
- `createdAt`, `updatedAt` (Timestamps)
- `createdBy`, `updatedBy` (UUID, Optional)

**Service**: `src/services/paymentService.ts`
Endpoints:
- POST `createPayment` - Record new payment
- GET `getPaymentById/:id` - Get payment by ID
- GET `getPaymentsByMember/:memberId` - Get all payments for a member
- GET `getAllPayments` - Get all payments for tenant
- PUT `updatePayment/:id` - Update payment details
- DELETE `deletePayment/:id` - Delete payment record

---

### 3. ClaimDocument (Updated)
**File**: `src/models/claimDocument.ts`
**Table**: `ClaimDocuments`

Updated with proper enums and fields from C# backend:

Fields:
- `id` (UUID, Primary Key)
- `tenantId` (UUID, Required)
- `claimId` (UUID, Required) - Foreign key to Claim
- `fileName` (STRING 255, Required)
- `originalFileName` (STRING 255, Required)
- `filePath` (TEXT, Required)
- `contentType` (STRING 100, Required)
- `fileSize` (BIGINT, Required)
- `documentType` (INTEGER, Required) - ClaimDocumentType enum
- `status` (INTEGER, Required) - ClaimDocumentStatus enum
- `rejectionReason` (TEXT, Optional)
- `verifiedBy` (UUID, Optional)
- `verifiedAt` (DATE, Optional)
- `createdAt`, `updatedAt` (Timestamps)
- `createdBy`, `updatedBy` (UUID, Optional)

**Enums**:
```typescript
enum ClaimDocumentType {
  DeathCertificate = 1,
  IdentityDocument = 2,
  MedicalReport = 3,
  PoliceReport = 4,
  BeneficiaryIdentity = 5,
  PowerOfAttorney = 6,
  BankStatement = 7,
  MarriageCertificate = 8,
  BirthCertificate = 9,
  Other = 10
}

enum ClaimDocumentStatus {
  Pending = 1,
  UnderReview = 2,
  Approved = 3,
  Rejected = 4,
  RequiresReplacement = 5
}
```

**Service**: `src/services/claimDocumentService.ts`
Endpoints:
- POST `createClaimDocument` - Upload new claim document
- GET `getClaimDocumentById/:id` - Get document by ID
- GET `getDocumentsByClaim/:claimId` - Get all documents for a claim
- GET `getAllClaimDocuments` - Get all documents for tenant
- PUT `updateClaimDocument/:id` - Update document status/verification
- DELETE `deleteClaimDocument/:id` - Delete document

---

### 4. ClaimWorkflowHistory (New)
**File**: `src/models/claimWorkflowHistory.ts`
**Table**: `ClaimWorkflowHistories`

Tracks claim status transitions and audit trail:

Fields:
- `id` (UUID, Primary Key)
- `tenantId` (UUID, Required)
- `claimId` (UUID, Required) - Foreign key to Claim
- `oldStatus` (STRING 50, Required) - Previous claim status
- `newStatus` (STRING 50, Required) - New claim status
- `notes` (TEXT, Optional) - Reason for transition
- `changedBy` (UUID, Required) - User who made the change
- `createdAt`, `updatedAt` (Timestamps)
- `createdBy`, `updatedBy` (UUID, Optional)

**Enum**:
```typescript
enum ClaimStatus {
  Draft, Submitted, InitialReview, DocumentsRequired, DocumentReview,
  VerificationPending, VerificationFailed, Assessment, ManagerReview,
  Approved, PartiallyApproved, Rejected, PaymentPending, Paid,
  PartiallyPaid, Closed, Disputed, Cancelled, Fraudulent
}
```

**Service**: `src/services/claimWorkflowHistoryService.ts`
Endpoints:
- POST `createWorkflowHistory` - Record status transition
- GET `getWorkflowHistoryById/:id` - Get history record
- GET `getHistoryByClaim/:claimId` - Get all transitions for a claim
- GET `getAllWorkflowHistory` - Get all transitions for tenant
- DELETE `deleteWorkflowHistory/:id` - Delete history record

---

## Database Migration Notes

To create these tables in the database, run migrations:

```bash
cd NodeAPI
npm run migrate  # or appropriate migration command
```

Or manually execute SQL to create the tables with the fields above.

## Frontend Integration

Update the frontend service proxies to include:
- `InvoiceServiceProxy` for invoice CRUD
- `PaymentServiceProxy` for payment tracking
- `ClaimDocumentServiceProxy` for document uploads
- `ClaimWorkflowHistoryServiceProxy` for audit trail

## Backend Alignment

These models align with the C# backend entities:
- `Funeral/Models/Invoice.cs`
- `Funeral/Models/Payment.cs`
- `Funeral/Models/ClaimDocument.cs`
- `Funeral/Models/ClaimWorkflowHistory.cs`

All models include multi-tenancy support with `tenantId` field and audit fields (`createdBy`, `updatedBy`, `createdAt`, `updatedAt`).
