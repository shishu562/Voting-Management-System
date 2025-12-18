// js/result.js

// Helper to safely escape text before inserting into HTML
function escapeHtml(text) {
  if (!text) return "";
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

// --- DOM Elements ---
const resMsg = document.getElementById("resultMessage");
const resultsBody = document.querySelector("#resultsTable tbody");
const electionNameInput = document.getElementById("electionName");
const declareBtn = document.getElementById("declareBtn");
const resultRefresh = document.getElementById("resultRefresh");

// --- Message display ---
function rshow(msg, type = "success") {
  resMsg.innerHTML = `<div class="alert ${type === "error" ? "error" : "success"}">${msg}</div>`;
  setTimeout(() => (resMsg.innerHTML = ""), 4000);
}

// --- Declare election result ---
async function declareResult() {
  const name = electionNameInput.value.trim();
  if (!name) return rshow("Provide election name", "error");

  try {
    const res = await apiRequest("/election-result/declare", "POST", { electionName: name });
    rshow(`Declared winner: ID ${res.winnerId} with ${res.winnerVotes} votes`);
    await loadResults();
  } catch (err) {
    console.error("Declare Error:", err);
    rshow(err.message || "Failed to declare result", "error");
  }
}

// --- Load all declared results ---
async function loadResults() {
  try {
    const data = await apiRequest("/election-result");

    console.log("Fetched Results:", data); // 👈 Check browser console
    resultsBody.innerHTML = "";

    // Handle both array and single-object responses
    const results = Array.isArray(data) ? data : [data];

    if (!results || results.length === 0 || !results[0]) {
      rshow("No result data available", "error");
      return;
    }

    results.forEach((r) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${r.id ?? "—"}</td>
        <td>${escapeHtml(r.electionName)}</td>
        <td>${r.totalVotes ?? 0}</td>
        <td>${r.winnerId ?? "—"}</td>
        
      `;
      resultsBody.appendChild(tr);
    });
  } catch (err) {
    console.error("Load Results Error:", err);
    rshow(err.message || "Could not load results", "error");
  }
}

// --- Event listeners ---
declareBtn.addEventListener("click", declareResult);
resultRefresh.addEventListener("click", loadResults);

// Load on page start
loadResults();
