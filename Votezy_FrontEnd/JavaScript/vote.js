// js/vote.js
const vmsgEl = document.getElementById("voteMessage");
const voterSelect = document.getElementById("voterSelect");
const candidateSelect = document.getElementById("candidateSelect");
const castBtn = document.getElementById("castBtn");
const voteRefresh = document.getElementById("voteRefresh");
const votesTableBody = document.querySelector("#votesTable tbody");

function vmsg(msg, type="success"){
  vmsgEl.innerHTML = `<div class="alert ${type==='error'?'error':'success'}">${msg}</div>`;
  setTimeout(()=>vmsgEl.innerHTML="",3500);
}

async function loadVotersAndCandidates(){
  try{
    // voters
    const voters = await apiRequest("/voters");
    voterSelect.innerHTML = `<option value="">-- Select Voter --</option>`;
    voters.forEach(v => {
      // show only those who haven't voted to help UX
      const label = `${v.name} (id:${v.id}) ${v.hasVoted ? " - already voted" : ""}`;
      const opt = document.createElement("option");
      opt.value = v.id;
      opt.textContent = label;
      if(v.hasVoted) opt.disabled = true;
      voterSelect.appendChild(opt);
    });

    // candidates
    const candidates = await apiRequest("/candidate");
    candidateSelect.innerHTML = `<option value="">-- Select Candidate --</option>`;
    candidates.forEach(c => {
      const opt = document.createElement("option");
      opt.value = c.id;
      opt.textContent = `${c.name} (${c.party}) — Votes: ${c.voteCount ?? 0}`;
      candidateSelect.appendChild(opt);
    });

    loadVotes();
  }catch(err){
    vmsg(err.message || "Could not load lists", "error");
  }
}

async function castVote(){
  const voterId = voterSelect.value;
  const candidateId = candidateSelect.value;
  if(!voterId || !candidateId) return vmsg("Select both voter and candidate", "error");

  try{
    await apiRequest("/votes/cast", "POST", { voterId: Number(voterId), candidateId: Number(candidateId) });
    vmsg("Vote cast successfully");
    loadVotersAndCandidates(); // refresh lists to show updated hasVoted and votes
  }catch(err){
    vmsg(err.message || "Cast failed", "error");
  }
}

async function loadVotes(){
  try{
    const votes = await apiRequest("/votes");
    votesTableBody.innerHTML = "";
    votes.forEach(v => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${v.id}</td><td>${v.voterId ?? ""}</td><td>${v.candidateId ?? ""}</td>`;
      votesTableBody.appendChild(tr);
    });
  }catch(err){
    // non-critical
  }
}

castBtn.addEventListener("click", castVote);
voteRefresh.addEventListener("click", loadVotersAndCandidates);

loadVotersAndCandidates();
