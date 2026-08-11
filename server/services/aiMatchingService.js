/**
 * SkillSwap AI - Intelligent Skill Exchange & Peer Recommendation Engine
 * 
 * Multi-criteria heuristic scoring algorithm:
 * - Skill Mutual Compatibility (40%)
 * - Proficiency Level Alignment (20%)
 * - Experience Level Compatibility (15%)
 * - Availability Overlap (15%)
 * - Learning Mode & Domain Interest Fit (10%)
 * 
 * Designed with a pluggable adapter pattern to seamlessly integrate external LLM APIs (e.g. Gemini, OpenAI) in the future.
 */

const PROFICIENCY_RANK = {
  'Beginner': 1,
  'Intermediate': 2,
  'Advanced': 3,
  'Expert': 4
};

function calculateUserMatch(currentUser, targetUser) {
  if (currentUser._id.toString() === targetUser._id.toString()) {
    return null; // Cannot match with oneself
  }

  const reasons = [];

  // 1. SKILL FIT ANALYSIS (Max 40 points)
  let skillPoints = 0;
  const userWants = currentUser.skillsLearn || [];
  const targetTeaches = targetUser.skillsTeach || [];
  const userTeaches = currentUser.skillsTeach || [];
  const targetWants = targetUser.skillsLearn || [];

  const matchedSkillsToLearn = [];
  const matchedSkillsToTeach = [];

  // Check what target user can teach current user
  userWants.forEach(want => {
    const found = targetTeaches.find(teach => 
      teach.name.toLowerCase().trim() === want.name.toLowerCase().trim()
    );
    if (found) {
      matchedSkillsToLearn.push(found.name);
      reasons.push(`✓ They teach ${found.name} (which you want to learn)`);
    } else {
      // Category level match fallback
      const categoryMatch = targetTeaches.find(teach => 
        teach.category && want.category && teach.category.toLowerCase() === want.category.toLowerCase()
      );
      if (categoryMatch && !matchedSkillsToLearn.includes(want.name)) {
        reasons.push(`✓ They offer expertise in ${categoryMatch.category} (${want.name})`);
      }
    }
  });

  // Check what current user can teach target user
  targetWants.forEach(want => {
    const found = userTeaches.find(teach => 
      teach.name.toLowerCase().trim() === want.name.toLowerCase().trim()
    );
    if (found) {
      matchedSkillsToTeach.push(found.name);
      reasons.push(`✓ You teach ${found.name} (which they want to learn)`);
    }
  });

  if (matchedSkillsToLearn.length > 0 && matchedSkillsToTeach.length > 0) {
    skillPoints = 40;
    reasons.unshift(`✓ Strong mutual skill swap opportunity (${matchedSkillsToLearn.join(', ')} ↔ ${matchedSkillsToTeach.join(', ')})`);
  } else if (matchedSkillsToLearn.length > 0) {
    skillPoints = 25;
  } else if (matchedSkillsToTeach.length > 0) {
    skillPoints = 20;
  } else {
    skillPoints = 5;
  }

  // 2. PROFICIENCY ALIGNMENT (Max 20 points)
  let proficiencyPoints = 10;
  if (matchedSkillsToLearn.length > 0) {
    const targetTeacherProf = targetTeaches.find(t => matchedSkillsToLearn.includes(t.name))?.proficiency || 'Intermediate';
    const userDesiredProf = userWants.find(w => matchedSkillsToLearn.includes(w.name))?.desiredLevel || 'Intermediate';
    
    const teacherRank = PROFICIENCY_RANK[targetTeacherProf] || 2;
    const learnerDesiredRank = PROFICIENCY_RANK[userDesiredProf] || 2;

    if (teacherRank >= learnerDesiredRank) {
      proficiencyPoints = 20;
      reasons.push(`✓ ${targetUser.fullName.split(' ')[0]} has high proficiency (${targetTeacherProf}) matching your goal`);
    } else {
      proficiencyPoints = 14;
    }
  }

  // 3. EXPERIENCE LEVEL FIT (Max 15 points)
  let expPoints = 10;
  const userExpRank = PROFICIENCY_RANK[currentUser.experienceLevel] || 2;
  const targetExpRank = PROFICIENCY_RANK[targetUser.experienceLevel] || 2;
  const expDiff = Math.abs(userExpRank - targetExpRank);

  if (expDiff === 0) {
    expPoints = 15;
    reasons.push(`✓ Identical overall experience level (${currentUser.experienceLevel})`);
  } else if (expDiff === 1) {
    expPoints = 12;
    reasons.push(`✓ Compatible experience levels (${currentUser.experienceLevel} & ${targetUser.experienceLevel})`);
  } else {
    expPoints = 8;
  }

  // 4. AVAILABILITY OVERLAP (Max 15 points)
  let availPoints = 5;
  const userAvail = currentUser.availability || [];
  const targetAvail = targetUser.availability || [];
  const commonAvail = userAvail.filter(a => targetAvail.includes(a));

  if (commonAvail.length > 0) {
    availPoints = Math.min(15, 8 + commonAvail.length * 4);
    reasons.push(`✓ Common availability: ${commonAvail.join(', ')}`);
  }

  // 5. PREFERRED MODE & INTERESTS (Max 10 points)
  let modePoints = 0;
  if (currentUser.preferredMode === targetUser.preferredMode || currentUser.preferredMode === 'Hybrid' || targetUser.preferredMode === 'Hybrid') {
    modePoints += 5;
    reasons.push(`✓ Matching learning mode (${targetUser.preferredMode})`);
  }

  const userInterests = currentUser.interests || [];
  const targetInterests = targetUser.interests || [];
  const commonInterests = userInterests.filter(i => targetInterests.some(ti => ti.toLowerCase() === i.toLowerCase()));

  if (commonInterests.length > 0) {
    modePoints += 5;
    reasons.push(`✓ Shared interests in ${commonInterests.slice(0, 2).join(', ')}`);
  }

  // Total Percentage
  const rawScore = skillPoints + proficiencyPoints + expPoints + availPoints + modePoints;
  const overallScore = Math.min(99, Math.max(35, rawScore));

  return {
    user: targetUser,
    overallScore,
    breakdown: {
      skillCompatibility: Math.round((skillPoints / 40) * 100),
      proficiencyCompatibility: Math.round((proficiencyPoints / 20) * 100),
      experienceCompatibility: Math.round((expPoints / 15) * 100),
      availabilityCompatibility: Math.round((availPoints / 15) * 100),
      interestCompatibility: Math.round((modePoints / 10) * 100),
    },
    matchedSkillsToLearn,
    matchedSkillsToTeach,
    reasons: [...new Set(reasons)] // Remove duplicate reason strings
  };
}

/**
 * Ranks all available candidate users against the current user
 */
function generateRecommendations(currentUser, candidates) {
  const matches = candidates
    .map(candidate => calculateUserMatch(currentUser, candidate))
    .filter(match => match !== null)
    .sort((a, b) => b.overallScore - a.overallScore);

  return matches;
}

module.exports = {
  calculateUserMatch,
  generateRecommendations
};
