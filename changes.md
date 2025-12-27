## Changes by YASH

## Changes by Hemanshu

### [2025-12-27] Integration & Enhancements

**Backend:**

- **Critical Fix**: Resolved circular dependency crash between `Equipment` and `Request` models.
- **API Update**: Updated `equipmentController.js` to include associated `Request` data (for counts).

**Frontend:**

- **Equipment List**:
  - Added **Search Bar** (Name/Serial) and **Status Filter**.
  - Added **"Requests" Column** to show maintenance request counts per item.
- **Equipment Form**: Fixed submission bug by sanitizing empty optional fields to `null`.
- **Architecture**:
  - Implemented `Navbar.jsx` and `DashboardLayout.jsx` for consistent navigation and UI structure.
  - Refactored `App.jsx` to use the new layout for all protected routes.
- **UI Polish**: Standardized table styles and navigation active states.

## Changes by Vinay

## Changes by Ravindra
