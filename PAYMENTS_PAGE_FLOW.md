# Payments Management Page - User Flow

## Overview
The Payments Management page provides a comprehensive view of all payment transactions, allowing admins to record payments from customers and dealers, view payment history, and track outstanding balances.

---

## Page Load Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    PAGE LOADS                                │
│  (Admin navigates to /admin/payments)                        │
└────────────────────┬────────────────────────────────────────┘
                      │
                      ▼
        ┌─────────────────────────────┐
        │  Parallel Data Fetching      │
        │  (useEffect triggers)         │
        └─────────────┬─────────────────┘
                      │
        ┌─────────────┼─────────────┬─────────────┬─────────────┐
        ▼             ▼             ▼             ▼             ▼
    ┌────────┐  ┌─────────┐  ┌────────┐  ┌──────────┐  ┌──────────┐
    │Summary │  │ Ledger  │  │ Sales  │  │Invoices │  │ Recent   │
    │        │  │         │  │        │  │         │  │ Payments │
    └────┬───┘  └────┬────┘  └────┬───┘  └────┬────┘  └────┬─────┘
         │           │             │           │            │
         └───────────┴─────────────┴───────────┴────────────┘
                      │
                      ▼
        ┌─────────────────────────────┐
        │  Display Page Components     │
        └─────────────────────────────┘
```

---

## Page Structure & Components

### 1. **Top Section: Summary Cards** (Always Visible)
```
┌─────────────────────────────────────────────────────────────┐
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Total        │  │ Received     │  │ Pending      │      │
│  │ Receivable   │  │ ₹1,10,058.99 │  │ ₹0           │      │
│  │ ₹0           │  │              │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### 2. **Middle Section: Charts & Statistics** (Always Visible)
```
┌─────────────────────────────────────────────────────────────┐
│  ┌────────────────────┐  ┌────────────────────┐            │
│  │ Payment Status     │  │ Payment Statistics│            │
│  │ (Pie Chart)        │  │ - Paid: 0         │            │
│  │                    │  │ - Partial: 0       │            │
│  │                    │  │ - Pending: 0       │            │
│  └────────────────────┘  └────────────────────┘            │
└─────────────────────────────────────────────────────────────┘
```

### 3. **Bottom Section: Tabs** (Customer Ledger / Recent Payments)
```
┌─────────────────────────────────────────────────────────────┐
│  [Customer Ledger] [Recent Payments]  [+ Record Payment]    │
│  ────────────────────────────────────────────────────────   │
│                                                              │
│  [Tab Content Area - Changes based on selected tab]         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 4. **Bottom Section: Dealer Invoice Payments** (Always Visible)
```
┌─────────────────────────────────────────────────────────────┐
│  Dealer Invoice Payments                                     │
│  ────────────────────────────────────────────────────────   │
│  [Form to record dealer invoice payments]                    │
└─────────────────────────────────────────────────────────────┘
```

---

## Flow 1: Customer Ledger Tab (Default)

```
┌─────────────────────────────────────────────────────────────┐
│                    CUSTOMER LEDGER TAB                      │
└────────────────────┬────────────────────────────────────────┘
                      │
        ┌─────────────┴─────────────┐
        │                           │
        ▼                           ▼
┌───────────────┐          ┌──────────────────┐
│ View Ledger   │          │ Record Payment    │
│ Table         │          │ (Button Click)    │
└───────┬───────┘          └─────────┬─────────┘
        │                            │
        │                            ▼
        │                  ┌────────────────────┐
        │                  │ Payment Form       │
        │                  │ Appears            │
        │                  └─────────┬──────────┘
        │                            │
        │                            ▼
        │                  ┌────────────────────┐
        │                  │ Fill Form:         │
        │                  │ - Select Customer  │
        │                  │ - Enter Amount     │
        │                  │ - Payment Method   │
        │                  │ - Reference #      │
        │                  │ - Notes            │
        │                  └─────────┬──────────┘
        │                            │
        │                            ▼
        │                  ┌────────────────────┐
        │                  │ Submit Payment     │
        │                  └─────────┬──────────┘
        │                            │
        │                            ▼
        │                  ┌────────────────────┐
        │                  │ POST /api/payments │
        │                  └─────────┬──────────┘
        │                            │
        │                            ▼
        │                  ┌────────────────────┐
        │                  │ Success:            │
        │                  │ - Refresh Summary   │
        │                  │ - Refresh Ledger    │
        │                  │ - Refresh Sales     │
        │                  │ - Refresh Recent    │
        │                  │ - Hide Form         │
        │                  └─────────┬───────────┘
        │                            │
        └────────────────────────────┘
                      │
                      ▼
        ┌─────────────────────────────┐
        │  Updated Ledger Table       │
        │  (New payment reflected)    │
        └─────────────────────────────┘
```

### Customer Ledger Table Actions:

**Option A: Click "Pay Now" Button (in table row)**
```
Click "Pay Now" → Pre-fills form with customer → User completes form → Submit
```

**Option B: Click "+ Record Payment" Button (top right)**
```
Click Button → Form appears → Select customer → Fill form → Submit
```

---

## Flow 2: Recent Payments Tab

```
┌─────────────────────────────────────────────────────────────┐
│                    RECENT PAYMENTS TAB                       │
└────────────────────┬────────────────────────────────────────┘
                      │
                      ▼
        ┌─────────────────────────────┐
        │  Click "Recent Payments"    │
        │  Tab                        │
        └─────────────┬───────────────┘
                      │
                      ▼
        ┌─────────────────────────────┐
        │  Display Payments Table     │
        │  (Sorted by Date DESC)     │
        └─────────────────────────────┘
                      │
                      ▼
        ┌─────────────────────────────┐
        │  Columns Displayed:         │
        │  - Payment ID               │
        │  - Customer Name            │
        │  - Amount                   │
        │  - Date & Time              │
        │  - Mode of Payment          │
        │  - Type (Sale/Invoice/Order)│
        └─────────────────────────────┘
```

**Note:** Recent Payments is **read-only** - no actions can be performed here, only viewing.

---

## Flow 3: Dealer Invoice Payments

```
┌─────────────────────────────────────────────────────────────┐
│              DEALER INVOICE PAYMENTS SECTION                 │
└────────────────────┬────────────────────────────────────────┘
                      │
                      ▼
        ┌─────────────────────────────┐
        │  Select Invoice from        │
        │  Dropdown                   │
        └─────────────┬───────────────┘
                      │
                      ▼
        ┌─────────────────────────────┐
        │  Outstanding Amount        │
        │  Auto-calculates & displays │
        └─────────────┬───────────────┘
                      │
                      ▼
        ┌─────────────────────────────┐
        │  Fill Payment Details:      │
        │  - Payment Amount *          │
        │  - Payment Method *          │
        │  - Reference Number          │
        │  - Notes                     │
        └─────────────┬───────────────┘
                      │
                      ▼
        ┌─────────────────────────────┐
        │  Click "Record Dealer       │
        │  Payment" Button            │
        └─────────────┬───────────────┘
                      │
                      ▼
        ┌─────────────────────────────┐
        │  POST /api/payments         │
        │  (with invoiceId)            │
        └─────────────┬───────────────┘
                      │
                      ▼
        ┌─────────────────────────────┐
        │  Success:                   │
        │  - Update Invoice Status     │
        │  - Refresh Summary           │
        │  - Refresh Recent Payments   │
        │  - Clear Form                │
        └─────────────────────────────┘
```

---

## Complete User Journey Map

```
START: Admin clicks "Payments" in Sidebar
│
├─► Page Loads
│   ├─► Fetch Summary (/api/payments/summary)
│   ├─► Fetch Ledger (/api/payments/ledger)
│   ├─► Fetch Sales (/api/sales)
│   ├─► Fetch Invoices (/api/invoices)
│   └─► Fetch Recent Payments (/api/payments)
│
├─► Display Top Section
│   ├─► Summary Cards (Total Receivable, Received, Pending)
│   └─► Charts & Statistics
│
├─► Display Bottom Section (Tabs)
│   │
│   ├─► TAB 1: Customer Ledger (Default)
│   │   │
│   │   ├─► View Ledger Table
│   │   │   ├─► See Customer, Amount, Paid, Balance, Status
│   │   │   └─► Click "Pay Now" on row → Opens Payment Form
│   │   │
│   │   └─► Record Payment Flow
│   │       ├─► Click "+ Record Payment" Button
│   │       ├─► Payment Form Appears
│   │       ├─► Select Customer from Dropdown
│   │       ├─► Outstanding Balance Auto-fills
│   │       ├─► Enter Payment Amount
│   │       ├─► Select Payment Method
│   │       ├─► (Optional) Enter Reference Number
│   │       ├─► (Optional) Add Notes
│   │       ├─► Click "Record Payment"
│   │       ├─► POST /api/payments
│   │       └─► Success → Refresh All Data → Hide Form
│   │
│   └─► TAB 2: Recent Payments
│       │
│       └─► View Payments Table
│           ├─► See Payment ID, Customer, Amount, Date, Mode, Type
│           └─► Sorted by Most Recent First
│           └─► (Read-only - No actions)
│
└─► Dealer Invoice Payments (Always Visible)
    │
    ├─► Select Invoice from Dropdown
    ├─► Outstanding Amount Auto-calculates
    ├─► Fill Payment Details
    ├─► Click "Record Dealer Payment"
    ├─► POST /api/payments (with invoiceId)
    └─► Success → Refresh Data → Clear Form
```

---

## Data Refresh Flow

After any payment is recorded, the following data refreshes automatically:

```
Payment Recorded Successfully
│
├─► Refresh Summary Cards
│   └─► GET /api/payments/summary
│
├─► Refresh Customer Ledger
│   └─► GET /api/payments/ledger
│
├─► Refresh Sales List
│   └─► GET /api/sales (filter unpaid)
│
├─► Refresh Invoices List
│   └─► GET /api/invoices
│
└─► Refresh Recent Payments
    └─► GET /api/payments (sorted by date DESC)
```

---

## Key Interactions Summary

| Action | Location | Result |
|--------|----------|--------|
| **View Summary** | Top Cards | Always visible, shows totals |
| **View Charts** | Middle Section | Visual representation of payment status |
| **View Ledger** | Customer Ledger Tab | See customer balances and status |
| **Record Customer Payment** | Customer Ledger Tab → "+ Record Payment" | Opens form to record payment |
| **Quick Pay** | Customer Ledger Tab → "Pay Now" button | Pre-fills form with customer |
| **View Recent Payments** | Recent Payments Tab | See payment history (read-only) |
| **Record Dealer Payment** | Dealer Invoice Payments Section | Record payment for dealer invoice |

---

## API Endpoints Used

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/payments/summary` | GET | Get payment summary (totals, counts) |
| `/api/payments/ledger` | GET | Get customer ledger (grouped by customer) |
| `/api/payments` | GET | Get all payments (for Recent Payments tab) |
| `/api/payments` | POST | Record new payment (customer or dealer) |
| `/api/sales` | GET | Get sales (for customer dropdown) |
| `/api/invoices` | GET | Get invoices (for dealer dropdown) |

---

## State Management

The page uses React state to manage:

- `summary` - Payment summary data
- `ledger` - Customer ledger entries
- `sales` - Sales list (for customer selection)
- `invoices` - Invoice list (for dealer selection)
- `recentPayments` - Recent payments list
- `activeTab` - Current tab ('ledger' or 'recent')
- `showPaymentForm` - Toggle payment form visibility
- `selectedSaleId` - Selected customer sale
- `selectedInvoiceId` - Selected dealer invoice
- `paymentData` - Customer payment form data
- `dealerPaymentData` - Dealer payment form data
- `loading` - Loading state

---

## Error Handling

- **Failed API calls**: Toast error messages displayed
- **Invalid form data**: Validation prevents submission
- **No customers available**: "Record Payment" button disabled
- **No invoices available**: Dropdown shows "No invoices" message
- **Empty data**: Tables show "No entries found" message

---

This flow ensures admins can efficiently manage all payment-related activities in one centralized location.
