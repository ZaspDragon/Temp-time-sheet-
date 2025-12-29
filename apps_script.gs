/**
 * Google Apps Script: Timesheet row append endpoint.
 * Deploy as Web App (Execute as: Me, Access: Anyone).
 */

const SHEET_NAME = "Timesheet";
const REQUIRED_FIELDS = ["employeeName","staffingAgency","date","timeIn","timeOut","secret"];

/** Must match config.js */
const SHARED_SECRET = "CHANGE_ME_TO_A_RANDOM_PASSWORD";

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents || "{}");

    for (const k of REQUIRED_FIELDS) {
      if (!body[k] || String(body[k]).trim() === "") {
        return json_({ ok: false, error: `Missing field: ${k}` }, 400);
      }
    }

    if (String(body.secret) !== String(SHARED_SECRET)) {
      return json_({ ok: false, error: "Bad secret" }, 403);
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sh = ss.getSheetByName(SHEET_NAME);
    if (!sh) return json_({ ok: false, error: `Sheet tab not found: ${SHEET_NAME}` }, 404);

    // yyyy-mm-dd -> Date
    const parts = String(body.date).split("-").map(Number);
    const dateObj = new Date(parts[0], parts[1]-1, parts[2]);
    const dayName = Utilities.formatDate(dateObj, Session.getScriptTimeZone(), "EEEE");

    const lunch = body.lunch || "No";
    const lunchMinutes = (lunch === "Yes") ? (Number(body.lunchMinutes || 30) || 30) : "";

    const scheduledIn = body.scheduledIn
      ? `${String(body.scheduledIn).trim()} ${String(body.scheduledAmPm || "AM").trim()}`
      : "";

    const row = [
      dateObj,
      dayName,
      String(body.employeeName).trim(),
      String(body.staffingAgency).trim(),
      String(body.timeIn).trim(),
      String(body.inAmPm || "AM").trim(),
      String(lunch).trim(),
      lunchMinutes,
      String(body.timeOut).trim(),
      String(body.outAmPm || "PM").trim(),
      scheduledIn,
      "", // Late Minutes (formula can fill)
      ""  // Total Hours (formula can fill)
    ];

    sh.appendRow(row);
    return json_({ ok: true }, 200);

  } catch (err) {
    return json_({ ok: false, error: String(err) }, 500);
  }
}

function json_(obj, code) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
