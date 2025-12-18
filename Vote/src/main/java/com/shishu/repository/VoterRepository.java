package com.shishu.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.shishu.entity.Voter;

public interface VoterRepository extends JpaRepository<Voter, Long>{
	
	boolean existsByEmail(String email);

}
