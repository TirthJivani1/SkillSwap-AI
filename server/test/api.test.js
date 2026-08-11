/**
 * SkillSwap AI - API Integration & Logic Verification Test Suite
 */
const mongoose = require('mongoose');
const { calculateUserMatch, generateRecommendations } = require('../services/aiMatchingService');
const { generateRoadmapForSkill } = require('../services/roadmapService');

async function runTests() {
  console.log('🧪 Starting SkillSwap AI Automated Verification Tests...');
  let passed = 0;
  let total = 0;

  function assert(condition, testName) {
    total++;
    if (condition) {
      console.log(`  ✅ PASSED: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAILED: ${testName}`);
    }
  }

  // TEST 1: AI Skill Matching Algorithm
  const userA = {
    _id: new mongoose.Types.ObjectId(),
    fullName: 'Test User A',
    skillsTeach: [{ name: 'React.js', category: 'Programming & Tech', proficiency: 'Advanced' }],
    skillsLearn: [{ name: 'Python', category: 'Programming & Tech', desiredLevel: 'Advanced' }],
    availability: ['Weekends'],
    preferredMode: 'Online',
    experienceLevel: 'Intermediate',
    interests: ['Web']
  };

  const userB = {
    _id: new mongoose.Types.ObjectId(),
    fullName: 'Test User B',
    skillsTeach: [{ name: 'Python', category: 'Programming & Tech', proficiency: 'Expert' }],
    skillsLearn: [{ name: 'React.js', category: 'Programming & Tech', desiredLevel: 'Intermediate' }],
    availability: ['Weekends'],
    preferredMode: 'Online',
    experienceLevel: 'Intermediate',
    interests: ['Web']
  };

  const matchResult = calculateUserMatch(userA, userB);
  assert(matchResult !== null, 'Match calculation returned non-null result');
  assert(matchResult.overallScore >= 80, `High mutual compatibility score generated (${matchResult.overallScore}%)`);
  assert(matchResult.matchedSkillsToLearn.includes('Python'), 'Correctly detected skill User A wants to learn');
  assert(matchResult.matchedSkillsToTeach.includes('React.js'), 'Correctly detected skill User A can teach');

  // TEST 2: Recommendation Generation & Ranking
  const candidates = [userB];
  const recs = generateRecommendations(userA, candidates);
  assert(recs.length === 1, 'Recommendations list returns ranked candidates');
  assert(recs[0].user.fullName === 'Test User B', 'Top match user correctly identified');

  // TEST 3: Roadmap Generator
  const roadmap = generateRoadmapForSkill('Python', userA._id);
  assert(roadmap.skillTitle === 'Python Programming', 'Predefined roadmap matched for Python');
  assert(roadmap.levels.length === 6, 'Roadmap contains 6 levels of progression');
  assert(roadmap.levels[0].topics.length >= 3, 'Level 1 contains detailed topics');

  // TEST 4: Arbitrary Skill Roadmap Generation
  const customRoadmap = generateRoadmapForSkill('Quantum Computing', userA._id);
  assert(customRoadmap.skillTitle === 'Quantum Computing', 'Dynamic roadmap fallback generated for custom skill');
  assert(customRoadmap.levels.length === 6, 'Dynamic roadmap has 6 structured levels');

  console.log(`\n📊 Test Summary: ${passed}/${total} assertions passed successfully.`);
  if (passed === total) {
    console.log('🎉 All verification tests passed cleanly!');
    process.exit(0);
  } else {
    console.error('⚠️ Some tests failed!');
    process.exit(1);
  }
}

runTests();
