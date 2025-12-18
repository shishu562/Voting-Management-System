package com.shishu.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.shishu.entity.Vote;


public interface VoteRepository extends JpaRepository<Vote, Long>{

}
