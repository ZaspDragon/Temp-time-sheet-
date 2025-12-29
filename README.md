# Timesheet GitHub Website (GitHub Pages → Google Sheet)

GitHub Pages is static, so the website needs a small “writer” service to put rows into your spreadsheet.
The easiest option is **Google Sheets + Google Apps Script**.

## What you get
- A one-employee-at-a-time web form (hosted on GitHub Pages)
- On submit, it appends a row to your Google Sheet tab named `Timesheet`
- Your existing formulas can compute Total Hours, Late Minutes, etc.

## Setup (15 minutes)
### 1) Convert your Excel to Google Sheets
Upload your Excel to Google Drive → open with Google Sheets.

Make sure you have a tab named `Timesheet` with these headers (row 1):
1. Date
2. Day
3. Employee Name
4. Staffing Agency
5. Time In
6. In AM/PM
7. Lunch
8. Lunch Minutes (if Yes)
9. Time Out
10. Out AM/PM
11. Scheduled In (optional)
12. Late Minutes
13. Total Hours

(Your sheet can have more columns; this app just fills these.)

### 2) Add the Apps Script endpoint
In the Sheet: Extensions → Apps Script
Paste the contents of `apps_script.gs`.
Set `SHARED_SECRET` to a password.

Deploy → New deployment → Web app:
- Execute as: Me
- Who has access: Anyone
Copy the Web App URL (ends with `/exec`).

### 3) Connect the website
Edit `config.js`:
- WEB_APP_URL = your /exec url
- SHARED_SECRET = same password as Apps Script

### 4) Publish on GitHub Pages
Repo Settings → Pages → Deploy from branch → main / root.

Done.
