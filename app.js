function $(id){ return document.getElementById(id); }

function setStatus(msg, ok=true){
  const el = $("status");
  el.textContent = msg;
  el.style.color = ok ? "#065f46" : "#b91c1c";
}

function getPayload(){
  const lunch = $("lunch").value;
  const lunchMinutes = lunch === "Yes" ? Number($("lunchMinutes").value || 30) : "";
  return {
    employeeName: $("employeeName").value.trim(),
    staffingAgency: $("staffingAgency").value.trim(),
    date: $("date").value,
    timeIn: $("timeIn").value.trim(),
    inAmPm: $("inAmPm").value,
    lunch,
    lunchMinutes,
    timeOut: $("timeOut").value.trim(),
    outAmPm: $("outAmPm").value,
    scheduledIn: $("scheduledIn").value.trim(),
    scheduledAmPm: $("scheduledAmPm").value,
    secret: window.TIMESHEET_CONFIG?.SHARED_SECRET || ""
  };
}

async function submitTimesheet(e){
  e.preventDefault();
  const cfg = window.TIMESHEET_CONFIG || {};
  if(!cfg.WEB_APP_URL || cfg.WEB_APP_URL.includes("PASTE_")){
    setStatus("Set WEB_APP_URL in config.js first.", false);
    return;
  }

  const payload = getPayload();
  if(!payload.employeeName || !payload.staffingAgency || !payload.date || !payload.timeIn || !payload.timeOut){
    setStatus("Please fill Employee, Agency, Date, Time In, and Time Out.", false);
    return;
  }

  $("submitBtn").disabled = true;
  setStatus("Submitting…");

  try{
    const res = await fetch(cfg.WEB_APP_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json().catch(() => ({}));
    if(!res.ok || data.ok !== true) throw new Error(data.error || "Submit failed.");

    setStatus("Saved ✔️");
    $("timeIn").value = "";
    $("timeOut").value = "";
    $("scheduledIn").value = "";
    $("lunch").value = "No";
    $("lunchMinutes").value = 30;

  }catch(err){
    setStatus(String(err.message || err), false);
  }finally{
    $("submitBtn").disabled = false;
  }
}

function clearForm(){
  $("timesheetForm").reset();
  setStatus("");
  $("lunchMinutes").disabled = true;
}

document.addEventListener("DOMContentLoaded", () => {
  $("timesheetForm").addEventListener("submit", submitTimesheet);
  $("clearBtn").addEventListener("click", clearForm);

  $("lunch").addEventListener("change", () => {
    if($("lunch").value === "Yes"){
      if(!$("lunchMinutes").value) $("lunchMinutes").value = 30;
      $("lunchMinutes").disabled = false;
    } else {
      $("lunchMinutes").disabled = true;
    }
  });

  $("lunchMinutes").disabled = true;
});
