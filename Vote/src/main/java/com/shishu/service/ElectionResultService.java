package com.shishu.service;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shishu.entity.Candidate;
import com.shishu.entity.ElectionResult;
import com.shishu.exception.ResourceNotFoundException;
import com.shishu.repository.CandidateRepository;
import com.shishu.repository.ElectionResultRepositry;
import com.shishu.repository.VoteRepository;


@Service
public class ElectionResultService {
	
	private CandidateRepository candidateRepository;
	private ElectionResultRepositry electionResultRepositry;
	private VoteRepository voteRepository;
	
	@Autowired
	public ElectionResultService(CandidateRepository candidateRepository, ElectionResultRepositry electionResultRepositry, VoteRepository voteRepository) {
		this.candidateRepository = candidateRepository;
		this.electionResultRepositry = electionResultRepositry;
		this.voteRepository = voteRepository;
	}
	
	
	public ElectionResult declareElectionResult(String electionName) {
		Optional<ElectionResult> existingResult = electionResultRepositry.findByElectionName(electionName);
		if(existingResult.isPresent()) {
			return existingResult.get();
		}
		if(voteRepository.count() == 0) {
			throw new IllegalStateException("Cannot Declare the result as no votes has been casted");
		}
		
		List<Candidate> allCandidates = candidateRepository.findAllByOrderByVoteCountDesc();
		if(allCandidates.isEmpty()) {
			throw new ResourceNotFoundException("No candidates available");
		}
		Candidate winner = allCandidates.get(0);
		int totalVotes = 0;
		for(Candidate candidate : allCandidates) {
			totalVotes += candidate.getVoteCount();
		}
		ElectionResult result = new ElectionResult();
		result.setElectionName(electionName);
		result.setWinner(winner);
		result.setTotalVotes(totalVotes);
	    return electionResultRepositry.save(result);
	}
	
	
	public List<ElectionResult> getAllResults(){
		return electionResultRepositry.findAll();
	}
	
	
}
