package com.shishu.service;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shishu.entity.Candidate;
import com.shishu.entity.Vote;
import com.shishu.exception.ResourceNotFoundException;
import com.shishu.repository.CandidateRepository;


@Service
public class CandidateService {
	private CandidateRepository candidateRepository;

	// It's a contructor injection
	@Autowired
	public CandidateService(CandidateRepository candidateRepository) {
		this.candidateRepository = candidateRepository;
	}
	
	
	public Candidate addCandidate(Candidate candidate) {
		return candidateRepository.save(candidate);
	}
	
	
	public List<Candidate> getAllCandidate(){
		return candidateRepository.findAll();
	}
	
	
	public Candidate getCandidateById(Long id) {
		Candidate candidate = candidateRepository.findById(id).orElse(null);
		if(candidate == null) {
			throw new ResourceNotFoundException("Candidate with id: " + id + " not found");
		}
		return candidate;
	}
	
	
	public Candidate updateCandidate(Long id, Candidate updatedCandidate) {
		Candidate candidate = getCandidateById(id);
		if(updatedCandidate.getName() != null) {
			candidate.setName(updatedCandidate.getName());
		}
		if(updatedCandidate.getParty() != null) {
			candidate.setParty(updatedCandidate.getParty());
		}
		return candidateRepository.save(candidate);
	}
	
	
	public void deleteCandidate(Long id) {
		Candidate candidate = getCandidateById(id);
		List<Vote> votes = candidate.getVote();
		for(Vote v : votes) {
			v.setCandidate(null);
		}
		candidate.getVote().clear();
		candidateRepository.delete(candidate);
	}
	
}

