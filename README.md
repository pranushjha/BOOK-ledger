# Book Detail — MongoDB Edition

This is the uploaded Book Detail inventory app converted from browser-only IndexedDB storage to a Node.js + Express + MongoDB Atlas backend.

## Features
- Class-wise inventory
- Add/edit/delete items
- Low-stock alerts
- Stock deduction when selling
- Customer management
- Customer ledger and payments
- Sales records and invoice/bill printing
- Receipt image upload and editing
- Responsive mobile UI / PWA behavior from the original app

## Setup in PowerShell

```powershell
cd .\book-detail-mongodb
npm install
Copy-Item .env.example .env
notepad .env
npm run dev
```

In `.env`, replace `<db_password>` with the real password for `jharina180_db_user`.

Then open:

`http://localhost:5000`

## MongoDB Atlas

The app uses the supplied cluster and stores its data in the `stockledger` database. Make sure the Atlas database user has read/write access and that your current IP is allowed by the Atlas Network Access rules.

## Security

Do not put the MongoDB connection string in frontend JavaScript or commit `.env` to GitHub. `.env` is ignored by `.gitignore`.

For production, add authentication/authorization before exposing the app publicly.
