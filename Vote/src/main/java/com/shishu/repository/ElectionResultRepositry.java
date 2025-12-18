package com.shishu.repository;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.shishu.entity.ElectionResult;


public interface ElectionResultRepositry extends JpaRepository<ElectionResult, Long> {

	Optional<ElectionResult> findByElectionName(String electionName);
	
}
