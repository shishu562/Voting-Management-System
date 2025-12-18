// js/candidate.js
const msgEl = document.getElementById("message");
const tableBody = document.querySelector("#candidatesTable tbody");
const nameInput = document.getElementById("candidateName");
const partyInput = document.getElementById("candidateParty");
const addBtn = document.getElementById("addBtn");
const refreshBtn = document.getElementById("refreshBtn");

function showMessage(text, type="success") {
  msgEl.innerHTML = `<div class="alert ${type==='error'?'error':'success'}">${text}</div>`;
  setTimeout(()=>msgEl.innerHTML="",4000);
}

async function loadCandidates() {
  try {
    const data = await apiRequest("/candidate");
    tableBody.innerHTML = "";
    data.forEach(c => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${c.id}</td>
        <td>${escapeHtml(c.name)}</td>
        <td>${escapeHtml(c.party)}</td>
        <td>${c.voteCount ?? 0}</td>
        <td>
          <button onclick="onEditCandidate(${c.id})">Edit</button>
          <button onclick="onDeleteCandidate(${c.id})" class="inline-btn">Delete</button>
        </td>
      `;
      tableBody.appendChild(tr);
    });
  } catch (err) {
    showMessage(err.message || "Could not load candidates", "error");
  }
}

async function addCandidate() {
  const name = nameInput.value.trim();
  const party = partyInput.value.trim();
  if (!name || !party) return showMessage("Fill both fields", "error");
  try {
    await apiRequest("/candidate/add", "POST", { name, party });
    showMessage("Candidate added");
    nameInput.value = "";
    partyInput.value = "";
    loadCandidates();
  } catch (err) {
    showMessage(err.message || "Add failed", "error");
  }
}

async function onDeleteCandidate(id) {
  if (!confirm("Delete candidate?")) return;
  try {
    await apiRequest(`/candidate/delete/${id}`, "DELETE");
    showMessage("Deleted candidate");
    loadCandidates();
  } catch (err) {
    showMessage(err.message || "Delete failed", "error");
  }
}

async function onEditCandidate(id) {
  try {
    const candidate = await apiRequest(`/candidate/${id}`);
    const newName = prompt("New name:", candidate.name);
    if (newName === null) return;
    const newParty = prompt("New party:", candidate.party);
    if (newParty === null) return;
    await apiRequest(`/candidate/update/${id}`, "PUT", { name: newName.trim(), party: newParty.trim() });
    showMessage("Updated candidate");
    loadCandidates();
  } catch (err) {
    showMessage(err.message || "Update failed", "error");
  }
}

// small helper to avoid HTML injection in table
function escapeHtml(unsafe) {
  return unsafe ? unsafe.replace(/[&<"'>]/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m])) : '';
}

addBtn.addEventListener("click", addCandidate);
refreshBtn.addEventListener("click", loadCandidates);

// initial load
loadCandidates();
