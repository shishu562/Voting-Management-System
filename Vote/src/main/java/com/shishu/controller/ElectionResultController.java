package com.shishu.controller;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shishu.DTO.ElectionResultRequestDTO;
import com.shishu.DTO.ElectionResultResponseDTO;
import com.shishu.entity.ElectionResult;
import com.shishu.service.ElectionResultService;

@RestController
@RequestMapping("/api/election-result")
@CrossOrigin
public class ElectionResultController {
	private ElectionResultService electionResultService;
	
	@Autowired
	public ElectionResultController(ElectionResultService electionResultService) {
		this.electionResultService = electionResultService;
	}
	
	
	@PostMapping("/declare")
	public ResponseEntity<ElectionResultResponseDTO> declareElectionResult(@RequestBody @Valid ElectionResultRequestDTO electionResultDTO){
		ElectionResult result = electionResultService.declareElectionResult(electionResultDTO.getElectionName());
		ElectionResultResponseDTO responseDTO = new ElectionResultResponseDTO();
		responseDTO.setElectionName(result.getElectionName());
		responseDTO.setTotalVotes(result.getTotalVotes());
		responseDTO.setWinnerId(result.getWinnerId());
		responseDTO.setWinnerVotes(result.getWinner().getVoteCount());
		return ResponseEntity.ok(responseDTO);
	}
	
	
	@GetMapping
	public ResponseEntity<List<ElectionResult>> getAllResults(){
		List<ElectionResult> results = electionResultService.getAllResults();
		return ResponseEntity.ok(results);
	}
	
	
}

