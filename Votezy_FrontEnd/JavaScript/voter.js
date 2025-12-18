// JavaScript/voter.js

// --- Helper: escape HTML safely (prevent XSS / rendering issues) ---
function escapeHtml(text) {
  if (!text) return "";
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return String(text).replace(/[&<>"']/g, (m) => map[m]);
}

// --- DOM elements ---
const vmsg = document.getElementById("voterMessage");
const vtable = document.querySelector("#votersTable tbody");
const vName = document.getElementById("voterName");
const vEmail = document.getElementById("voterEmail");
const registerBtn = document.getElementById("registerBtn");
const vRefresh = document.getElementById("voterRefresh");

// --- helper to show messages ---
function vshow(msg, type = "success") {
  vmsg.innerHTML = `<div class="alert ${type === "error" ? "error" : "success"}">${escapeHtml(msg)}</div>`;
  setTimeout(() => (vmsg.innerHTML = ""), 3500);
}

// --- Load voters from backend ---
async function loadVoters() {
  try {
    console.log("Loading voters...");
    const data = await apiRequest("/voters");
    console.log("Voters fetched:", data);
    vtable.innerHTML = "";

    if (!Array.isArray(data) || data.length === 0) {
      // show empty row or message
      vtable.innerHTML = `<tr><td colspan="5" class="small">No voters found</td></tr>`;
      return;
    }

    data.forEach((v) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${v.id ?? "—"}</td>
        <td>${escapeHtml(v.name)}</td>
        <td>${escapeHtml(v.email)}</td>
        <td>${v.hasVoted ? "Yes" : "No"}</td>
        <td>
          <button onclick="onEditVoter(${v.id})">Edit</button>
          <button onclick="onDeleteVoter(${v.id})" class="inline-btn">Delete</button>
        </td>
      `;
      vtable.appendChild(tr);
    });
  } catch (err) {
    console.error("Error loading voters:", err);
    vshow(err.message || "Could not load voters", "error");
  }
}

// --- Register new voter ---
async function registerVoter() {
  const name = vName.value.trim();
  const email = vEmail.value.trim();
  if (!name || !email) return vshow("Fill both fields", "error");
  try {
    registerBtn.disabled = true;
    await apiRequest("/voters/register", "POST", { name, email });
    vshow("Voter registered");
    vName.value = "";
    vEmail.value = "";
    await loadVoters();
  } catch (err) {
    console.error("Register error:", err);
    vshow(err.message || "Register failed", "error");
  } finally {
    registerBtn.disabled = false;
  }
}

// --- Delete voter ---
async function onDeleteVoter(id) {
  if (!confirm("Delete voter?")) return;
  try {
    await apiRequest(`/voters/delete/${id}`, "DELETE");
    vshow("Voter deleted");
    await loadVoters();
  } catch (err) {
    console.error("Delete error:", err);
    vshow(err.message || "Delete failed", "error");
  }
}

// --- Edit voter (simple prompt flow) ---
async function onEditVoter(id) {
  try {
    const voter = await apiRequest(`/voters/${id}`);
    const newName = prompt("New name:", voter.name);
    if (newName === null) return; // cancel
    const newEmail = prompt("New email:", voter.email);
    if (newEmail === null) return;
    await apiRequest(`/voters/update/${id}`, "PUT", { name: newName.trim(), email: newEmail.trim() });
    vshow("Voter updated");
    await loadVoters();
  } catch (err) {
    console.error("Edit error:", err);
    vshow(err.message || "Update failed", "error");
  }
}

// Expose edit/delete to inline onclick handlers (since functions are used from HTML)
window.onEditVoter = onEditVoter;
window.onDeleteVoter = onDeleteVoter;

// --- Event listeners ---
registerBtn.addEventListener("click", registerVoter);
vRefresh.addEventListener("click", loadVoters);

// initial load
loadVoters();
