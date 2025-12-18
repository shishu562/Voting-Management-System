package com.shishu.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.shishu.entity.Candidate;
import com.shishu.entity.Vote;
import com.shishu.entity.Voter;
import com.shishu.exception.ResourceNotFoundException;
import com.shishu.exception.VoteNotAllowedException;
import com.shishu.repository.CandidateRepository;
import com.shishu.repository.VoteRepository;
import com.shishu.repository.VoterRepository;

import jakarta.transaction.Transactional;

@Service
public class VotingService {
	
	private VoterRepository voterRepository;
	private CandidateRepository candidateRepository;
	private VoteRepository voteRepository;
	
	public VotingService(VoterRepository voterRepository, CandidateRepository candidateRepository, VoteRepository voteRepository) {
		this.voterRepository = voterRepository;
		this.candidateRepository = candidateRepository;
		this.voteRepository = voteRepository;
	}
	
	
	@Transactional
	public Vote castVote(Long voterId, Long candidateID) {
		
		if(!voterRepository.existsById(voterId)) {
			throw new ResourceNotFoundException("Voter not found with id: " + voterId);
		}
		if(!voterRepository.existsById(candidateID)) {
			throw new ResourceNotFoundException("Candidate not found with id: " + candidateID);
		}
		
		Voter voter = voterRepository.findById(voterId).get();
		if(voter.isHasVoted()) {
			throw new VoteNotAllowedException("Voter Id: " + voterId + " has already casted vote");
		}
		
		Candidate candidate = candidateRepository.findById(candidateID).get();
		Vote vote = new Vote();
		vote.setVoter(voter);
		vote.setCandidate(candidate);
		voteRepository.save(vote);
		
		candidate.setVoteCount(candidate.getVoteCount()+1);
		candidateRepository.save(candidate);
		
		voter.setHasVoted(true);
		voterRepository.save(voter);
		
		return vote;
	}
	
	
	public List<Vote> getAllVotes(){
		return voteRepository.findAll();
	}
	
}

