package com.shishu.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shishu.entity.Candidate;
import com.shishu.entity.Vote;
import com.shishu.entity.Voter;
import com.shishu.exception.DuplicateResourceException;
import com.shishu.exception.ResourceNotFoundException;
import com.shishu.repository.CandidateRepository;
import com.shishu.repository.VoterRepository;

import jakarta.transaction.Transactional;

@Service
public class VoterService {
	
	private VoterRepository voterRepository;
	private CandidateRepository candidateRepository;
	
	
	@Autowired
	public VoterService(VoterRepository voterRepository, CandidateRepository candidateRepository) {
	
		this.voterRepository = voterRepository;
		this.candidateRepository = candidateRepository;
	}
	
	
	public Voter registerVoter(Voter voter) {
		if(voterRepository.existsByEmail(voter.getEmail())) {
			throw new DuplicateResourceException("Voter with email id: " + voter.getEmail() + " already exists! ");
		}
		return voterRepository.save(voter);
	}
	
	
	public List<Voter> getAllVoters(){
		return voterRepository.findAll();
	}
	
	
	public Voter getVoterById(Long id) {
		Voter voter = voterRepository.findById(id).orElse(null);
		if(voter == null) {
			throw new ResourceNotFoundException("Voter with id: " + id + " not found");
		}
		return voter;
	}
	
	
	public Voter updateVoter(Long id, Voter updatedVoter) {
		Voter voter = voterRepository.findById(id).orElse(null);
		if(voter == null) {
			throw new ResourceNotFoundException("Voter with id: " + id + " not found");
		}
		if(updatedVoter.getName() != null) {
			voter.setName(updatedVoter.getName());
		}
		if(updatedVoter.getEmail() != null) {
			voter.setEmail(updatedVoter.getEmail());
		}
		return voterRepository.save(voter);
	}
	
	
	@Transactional // We used transctional here kyuki doo alg alg Repositories execute hongi, to agr ek chale aur dusre na chale to error ki bajae rollback hojae isliye. 
	public void deleteVoter(Long id) {
		Voter voter = voterRepository.findById(id).orElse(null);
		if(voter == null) {
			throw new ResourceNotFoundException("Cannot delete voter with: " + id + " as it does not exist");
		}
		
		Vote vote = voter.getVote();
		if(vote != null) {
			Candidate candidate = vote.getCandidate();
			candidate.setVoteCount(candidate.getVoteCount() - 1);
			candidateRepository.save(candidate);
		}
		
		voterRepository.delete(voter);
	}
	
	
}

