require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Skill = require('../models/Skill');
const Connection = require('../models/Connection');
const Message = require('../models/Message');
const Session = require('../models/Session');
const Roadmap = require('../models/Roadmap');
const Notification = require('../models/Notification');
const { generateRoadmapForSkill } = require('../services/roadmapService');

// Output folder for Compass JSON files
const OUTPUT_DIR = path.join(__dirname, '..', 'mongo_compass_dumps');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Fixed ObjectIds for consistent cross-referencing
const id = (hex) => new mongoose.Types.ObjectId(hex.padStart(24, '0'));

const SKILLS_TAXONOMY = [
  { _id: id('101'), name: 'React.js', category: 'Programming & Tech', description: 'Frontend UI library for modern web apps', iconName: 'Code' },
  { _id: id('102'), name: 'Python', category: 'Programming & Tech', description: 'High-level language for web, AI & data science', iconName: 'Terminal' },
  { _id: id('103'), name: 'Machine Learning', category: 'Data & AI', description: 'Predictive modeling, scikit-learn, and neural networks', iconName: 'Brain' },
  { _id: id('104'), name: 'Node.js', category: 'Programming & Tech', description: 'Asynchronous JavaScript backend runtime', iconName: 'Server' },
  { _id: id('105'), name: 'MongoDB', category: 'Programming & Tech', description: 'NoSQL document database design & queries', iconName: 'Database' },
  { _id: id('106'), name: 'UI/UX Design', category: 'Design & Creative', description: 'Figma wireframing, prototyping, and user testing', iconName: 'Figma' },
  { _id: id('107'), name: 'Cyber Security', category: 'Programming & Tech', description: 'Ethical hacking, network security, and cryptography', iconName: 'Shield' },
  { _id: id('108'), name: 'Graphic Design', category: 'Design & Creative', description: 'Photoshop, Illustrator, branding & visual communication', iconName: 'Palette' },
  { _id: id('109'), name: 'Video Editing', category: 'Design & Creative', description: 'Premiere Pro, DaVinci Resolve, color grading & motion graphics', iconName: 'Video' },
  { _id: id('110'), name: 'Public Speaking', category: 'Personal Development', description: 'Communication, presentation skills, & confidence building', iconName: 'Mic' },
  { _id: id('111'), name: 'Data Structures & Algorithms', category: 'Programming & Tech', description: 'Trees, graphs, dynamic programming, and problem solving', iconName: 'Cpu' },
  { _id: id('112'), name: 'Deep Learning', category: 'Data & AI', description: 'PyTorch, TensorFlow, CNNs, and Transformers', iconName: 'Sparkles' },
  { _id: id('113'), name: 'Docker & Kubernetes', category: 'Programming & Tech', description: 'Containerization, DevOps pipelines, and orchestration', iconName: 'Box' },
  { _id: id('114'), name: 'Spanish Language', category: 'Languages', description: 'Conversational Spanish grammar and vocabulary', iconName: 'Globe' },
  { _id: id('115'), name: 'Digital Marketing', category: 'Business & Marketing', description: 'SEO, Google Ads, content strategy, & analytics', iconName: 'TrendingUp' },
  { _id: id('116'), name: 'Java', category: 'Programming & Tech', description: 'Object-oriented Enterprise software development', iconName: 'Code' },
  { _id: id('117'), name: 'Flutter & Dart', category: 'Programming & Tech', description: 'Cross-platform mobile application development', iconName: 'Smartphone' },
  { _id: id('118'), name: 'Financial Literacy', category: 'Personal Development', description: 'Personal finance, investing, and budgeting strategies', iconName: 'DollarSign' },
  { _id: id('119'), name: 'Prompt Engineering', category: 'Data & AI', description: 'Optimizing AI LLM prompts and agent workflows', iconName: 'Zap' },
  { _id: id('120'), name: 'Product Management', category: 'Business & Marketing', description: 'Agile development, user stories, product roadmaps', iconName: 'Briefcase' }
];

const SEED_USERS_INDIAN = [
  {
    _id: id('201'),
    fullName: 'Aarav Patel',
    email: 'aarav.patel@example.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    bio: '7th Sem Computer Engineering student at CHARUSAT. Passionate about React.js & UI design. Seeking Python & ML expert for mutual exchange!',
    location: 'Ahmedabad, Gujarat',
    education: 'B.Tech Computer Engineering (SEM 7)',
    interests: ['Web Development', 'AI/ML', 'UI/UX Design', 'Open Source'],
    availability: ['Weekends', 'Evenings'],
    preferredMode: 'Online',
    experienceLevel: 'Intermediate',
    skillsTeach: [
      { _id: id('301'), name: 'React.js', category: 'Programming & Tech', proficiency: 'Advanced', yearsOfExperience: 3, description: 'Component architecture, Hooks, Redux & Vite apps.' },
      { _id: id('302'), name: 'UI/UX Design', category: 'Design & Creative', proficiency: 'Intermediate', yearsOfExperience: 2, description: 'Figma UI design, design systems, and wireframing.' }
    ],
    skillsLearn: [
      { _id: id('401'), name: 'Python', category: 'Programming & Tech', desiredLevel: 'Advanced', description: 'Looking to master Python for AI projects.' },
      { _id: id('402'), name: 'Machine Learning', category: 'Data & AI', desiredLevel: 'Intermediate', description: 'Want to build predictive models with scikit-learn.' }
    ],
    createdAt: new Date('2026-07-09T10:00:00Z')
  },
  {
    _id: id('202'),
    fullName: 'Ananya Sharma',
    email: 'ananya.sharma@example.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
    bio: 'Data Scientist & ML Researcher in Bangalore. Love teaching Python & Machine Learning. Looking to build sleek Web UIs using React.js!',
    location: 'Bengaluru, Karnataka',
    education: 'M.Tech Data Science & AI',
    interests: ['Machine Learning', 'Deep Learning', 'Frontend Frameworks'],
    availability: ['Weekends', 'Evenings'],
    preferredMode: 'Online',
    experienceLevel: 'Advanced',
    skillsTeach: [
      { _id: id('303'), name: 'Python', category: 'Programming & Tech', proficiency: 'Expert', yearsOfExperience: 5, description: 'Advanced Python, NumPy, Pandas, Asyncio.' },
      { _id: id('304'), name: 'Machine Learning', category: 'Data & AI', proficiency: 'Advanced', yearsOfExperience: 4, description: 'Regression, Classification, Neural Networks.' }
    ],
    skillsLearn: [
      { _id: id('403'), name: 'React.js', category: 'Programming & Tech', desiredLevel: 'Intermediate', description: 'Want to build interactive web dashboards for my ML models.' },
      { _id: id('404'), name: 'UI/UX Design', category: 'Design & Creative', desiredLevel: 'Beginner', description: 'Improve visual design of web apps.' }
    ],
    createdAt: new Date('2026-07-11T14:30:00Z')
  },
  {
    _id: id('203'),
    fullName: 'Rohan Gupta',
    email: 'rohan.gupta@example.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    bio: 'Cyber Security Consultant & Ethical Hacker based in Mumbai. Eager to swap security skills for Node.js backend development mastery.',
    location: 'Mumbai, Maharashtra',
    education: 'B.Tech Information Technology',
    interests: ['Cyber Security', 'DevOps', 'Cloud Architecture'],
    availability: ['Weekdays', 'Evenings'],
    preferredMode: 'Hybrid',
    experienceLevel: 'Expert',
    skillsTeach: [
      { _id: id('305'), name: 'Cyber Security', category: 'Programming & Tech', proficiency: 'Expert', yearsOfExperience: 6, description: 'Ethical hacking, vulnerability assessments, penetration testing.' }
    ],
    skillsLearn: [
      { _id: id('405'), name: 'Node.js', category: 'Programming & Tech', desiredLevel: 'Advanced', description: 'Master asynchronous microservices and API gateways.' },
      { _id: id('406'), name: 'MongoDB', category: 'Programming & Tech', desiredLevel: 'Intermediate', description: 'Database schema optimization and indexing.' }
    ],
    createdAt: new Date('2026-07-14T09:15:00Z')
  },
  {
    _id: id('204'),
    fullName: 'Priya Verma',
    email: 'priya.verma@example.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    bio: 'Senior Backend Engineer proficient in Node.js & MongoDB. Wanting to learn Cyber Security and Docker containerization.',
    location: 'Pune, Maharashtra',
    education: 'B.E. Computer Science',
    interests: ['Backend APIs', 'System Design', 'Cyber Security'],
    availability: ['Weekends', 'Mornings'],
    preferredMode: 'Online',
    experienceLevel: 'Advanced',
    skillsTeach: [
      { _id: id('306'), name: 'Node.js', category: 'Programming & Tech', proficiency: 'Expert', yearsOfExperience: 5, description: 'REST APIs, Express.js, JWT, Socket.IO, Performance tuning.' },
      { _id: id('307'), name: 'MongoDB', category: 'Programming & Tech', proficiency: 'Advanced', yearsOfExperience: 4, description: 'Mongoose ORM, Aggregation pipelines, performance indexes.' }
    ],
    skillsLearn: [
      { _id: id('407'), name: 'Cyber Security', category: 'Programming & Tech', desiredLevel: 'Intermediate', description: 'Securing REST APIs and web servers.' },
      { _id: id('408'), name: 'Docker & Kubernetes', category: 'Programming & Tech', desiredLevel: 'Intermediate', description: 'Containerizing Node.js applications.' }
    ],
    createdAt: new Date('2026-07-16T11:00:00Z')
  },
  {
    _id: id('205'),
    fullName: 'Aditya Mehta',
    email: 'aditya.mehta@example.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    bio: 'Graphic Designer & Motion Artist in Delhi. Passionate about brand identity. Looking to practice Public Speaking and Spanish!',
    location: 'New Delhi, Delhi',
    education: 'Bachelor of Fine Arts (BFA)',
    interests: ['Graphic Design', 'Branding', 'Languages', 'Public Speaking'],
    availability: ['Flexible'],
    preferredMode: 'Online',
    experienceLevel: 'Expert',
    skillsTeach: [
      { _id: id('308'), name: 'Graphic Design', category: 'Design & Creative', proficiency: 'Expert', yearsOfExperience: 7, description: 'Photoshop, Illustrator, typography, brand identity.' },
      { _id: id('309'), name: 'Video Editing', category: 'Design & Creative', proficiency: 'Advanced', yearsOfExperience: 4, description: 'Premiere Pro & After Effects motion graphics.' }
    ],
    skillsLearn: [
      { _id: id('409'), name: 'Public Speaking', category: 'Personal Development', desiredLevel: 'Advanced', description: 'Keynote presentations and confidence.' },
      { _id: id('410'), name: 'Spanish Language', category: 'Languages', desiredLevel: 'Beginner', description: 'Basic conversational Spanish.' }
    ],
    createdAt: new Date('2026-07-18T16:20:00Z')
  },
  {
    _id: id('206'),
    fullName: 'Snigdha Roy',
    email: 'snigdha.roy@example.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
    bio: 'Public Speaking Coach & Marketing Strategist in Kolkata. Excited to swap communication tips for Graphic Design skills.',
    location: 'Kolkata, West Bengal',
    education: 'MBA in Marketing',
    interests: ['Public Speaking', 'Digital Marketing', 'Graphic Design'],
    availability: ['Weekends', 'Evenings'],
    preferredMode: 'Online',
    experienceLevel: 'Advanced',
    skillsTeach: [
      { _id: id('310'), name: 'Public Speaking', category: 'Personal Development', proficiency: 'Expert', yearsOfExperience: 5, description: 'Speech structuring, vocal dynamics, stage presence.' },
      { _id: id('311'), name: 'Digital Marketing', category: 'Business & Marketing', proficiency: 'Advanced', yearsOfExperience: 4, description: 'SEO, Social Media campaigns, Brand growth.' }
    ],
    skillsLearn: [
      { _id: id('411'), name: 'Graphic Design', category: 'Design & Creative', desiredLevel: 'Intermediate', description: 'Creating visually stunning social media banners.' }
    ],
    createdAt: new Date('2026-07-20T08:45:00Z')
  },
  {
    _id: id('207'),
    fullName: 'Vikramaditya Singh',
    email: 'vikram.singh@example.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80',
    bio: 'Competitive Programmer & DSA Mentor in Jaipur. Mastering Data Structures & Algorithms. Wanting to learn Flutter for mobile apps!',
    location: 'Jaipur, Rajasthan',
    education: 'B.Tech Computer Science (SEM 7)',
    interests: ['Algorithms', 'Mobile Dev', 'Competitive Coding'],
    availability: ['Weekdays', 'Evenings'],
    preferredMode: 'Online',
    experienceLevel: 'Advanced',
    skillsTeach: [
      { _id: id('312'), name: 'Data Structures & Algorithms', category: 'Programming & Tech', proficiency: 'Expert', yearsOfExperience: 4, description: 'Trees, Graphs, DP, Dynamic Programming, LeetCode patterns.' },
      { _id: id('313'), name: 'Java', category: 'Programming & Tech', proficiency: 'Advanced', yearsOfExperience: 3, description: 'Core Java, OOPs, Collections framework.' }
    ],
    skillsLearn: [
      { _id: id('412'), name: 'Flutter & Dart', category: 'Programming & Tech', desiredLevel: 'Intermediate', description: 'Cross-platform mobile apps for Android and iOS.' }
    ],
    createdAt: new Date('2026-07-22T13:10:00Z')
  },
  {
    _id: id('208'),
    fullName: 'Ishita Joshi',
    email: 'ishita.joshi@example.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
    bio: 'Flutter Mobile App Developer in Chennai. Passionate about clean code architecture. Need help cracking advanced Data Structures & Algorithms.',
    location: 'Chennai, Tamil Nadu',
    education: 'B.Tech Information Technology',
    interests: ['Mobile Development', 'UI Design', 'Problem Solving'],
    availability: ['Weekends', 'Mornings'],
    preferredMode: 'Online',
    experienceLevel: 'Intermediate',
    skillsTeach: [
      { _id: id('314'), name: 'Flutter & Dart', category: 'Programming & Tech', proficiency: 'Advanced', yearsOfExperience: 3, description: 'Widget trees, State management (Bloc/Provider), REST API integration.' }
    ],
    skillsLearn: [
      { _id: id('413'), name: 'Data Structures & Algorithms', category: 'Programming & Tech', desiredLevel: 'Advanced', description: 'Cracking tech interview algorithm challenges.' }
    ],
    createdAt: new Date('2026-07-25T15:00:00Z')
  },
  {
    _id: id('209'),
    fullName: 'Siddharth Malhotra',
    email: 'siddharth.m@example.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=300&auto=format&fit=crop&q=80',
    bio: 'Prompt Engineer & AI Specialist in Hyderabad. Passionate about LLM workflows. Looking to learn Product Management frameworks.',
    location: 'Hyderabad, Telangana',
    education: 'B.Tech AI & Data Engineering',
    interests: ['Generative AI', 'Prompt Engineering', 'Product Strategy'],
    availability: ['Weekends', 'Evenings'],
    preferredMode: 'Online',
    experienceLevel: 'Intermediate',
    skillsTeach: [
      { _id: id('315'), name: 'Prompt Engineering', category: 'Data & AI', proficiency: 'Advanced', yearsOfExperience: 2, description: 'Few-shot prompting, RAG architectures, LLM agent development.' }
    ],
    skillsLearn: [
      { _id: id('414'), name: 'Product Management', category: 'Business & Marketing', desiredLevel: 'Intermediate', description: 'Agile sprints, user personas, product launches.' }
    ],
    createdAt: new Date('2026-07-28T09:30:00Z')
  },
  {
    _id: id('210'),
    fullName: 'Tanvi Deshmukh',
    email: 'tanvi.d@example.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    bio: 'Product Manager at a Tech Startup in Gurgaon. Love building products people love. Want to master Prompt Engineering and AI integration!',
    location: 'Gurgaon, Haryana',
    education: 'MBA & B.Tech CSE',
    interests: ['Product Strategy', 'AI Agents', 'User Growth'],
    availability: ['Weekdays', 'Evenings'],
    preferredMode: 'Online',
    experienceLevel: 'Advanced',
    skillsTeach: [
      { _id: id('316'), name: 'Product Management', category: 'Business & Marketing', proficiency: 'Expert', yearsOfExperience: 5, description: 'Roadmapping, PRDs, sprint planning, analytics.' }
    ],
    skillsLearn: [
      { _id: id('415'), name: 'Prompt Engineering', category: 'Data & AI', desiredLevel: 'Intermediate', description: 'Leveraging AI LLMs in product workflows.' }
    ],
    createdAt: new Date('2026-08-01T11:45:00Z')
  }
];

const main = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/skillswap_ai');
    console.log('[Generator] Connected to MongoDB...');

    // Clear existing collections
    await User.deleteMany({});
    await Skill.deleteMany({});
    await Connection.deleteMany({});
    await Message.deleteMany({});
    await Session.deleteMany({});
    await Roadmap.deleteMany({});
    await Notification.deleteMany({});

    // 1. Insert Skills
    const skills = await Skill.insertMany(SKILLS_TAXONOMY);
    console.log(`[Generator] Seeded ${skills.length} skills.`);

    // 2. Hash passwords & insert Users
    const salt = await bcrypt.genSalt(10);
    const usersToInsert = [];
    for (const u of SEED_USERS_INDIAN) {
      const hashedPassword = await bcrypt.hash(u.password, salt);
      usersToInsert.push({
        ...u,
        password: hashedPassword,
        isOnline: false,
        lastActive: new Date()
      });
    }
    const users = await User.insertMany(usersToInsert);
    console.log(`[Generator] Seeded ${users.length} Indian user profiles.`);

    const aarav = users.find(u => u.email === 'aarav.patel@example.com');
    const ananya = users.find(u => u.email === 'ananya.sharma@example.com');
    const rohan = users.find(u => u.email === 'rohan.gupta@example.com');
    const priya = users.find(u => u.email === 'priya.verma@example.com');
    const aditya = users.find(u => u.email === 'aditya.mehta@example.com');
    const snigdha = users.find(u => u.email === 'snigdha.roy@example.com');
    const vikram = users.find(u => u.email === 'vikram.singh@example.com');
    const ishita = users.find(u => u.email === 'ishita.joshi@example.com');
    const siddharth = users.find(u => u.email === 'siddharth.m@example.com');
    const tanvi = users.find(u => u.email === 'tanvi.d@example.com');

    // 3. Insert Connections over 1-month timeline
    const connectionsData = [
      {
        _id: id('501'),
        requester: ananya._id,
        recipient: aarav._id,
        status: 'Accepted',
        note: 'Hey Aarav! Let us exchange Python for React.js.',
        createdAt: new Date('2026-07-12T10:00:00Z'),
        updatedAt: new Date('2026-07-12T14:20:00Z')
      },
      {
        _id: id('502'),
        requester: priya._id,
        recipient: aarav._id,
        status: 'Accepted',
        note: 'Hi Aarav, looking forward to swapping Node.js & React!',
        createdAt: new Date('2026-07-17T12:00:00Z'),
        updatedAt: new Date('2026-07-17T15:30:00Z')
      },
      {
        _id: id('503'),
        requester: rohan._id,
        recipient: aarav._id,
        status: 'Pending',
        note: 'Hey Aarav! Would love to swap Cyber Security for React.js tips.',
        createdAt: new Date('2026-08-05T09:00:00Z'),
        updatedAt: new Date('2026-08-05T09:00:00Z')
      },
      {
        _id: id('504'),
        requester: aditya._id,
        recipient: snigdha._id,
        status: 'Accepted',
        note: 'Excited to practice Public Speaking in exchange for Graphic Design!',
        createdAt: new Date('2026-07-21T11:00:00Z'),
        updatedAt: new Date('2026-07-21T16:00:00Z')
      },
      {
        _id: id('505'),
        requester: vikram._id,
        recipient: ishita._id,
        status: 'Accepted',
        note: 'Hey Ishita! Let us swap DSA for Flutter.',
        createdAt: new Date('2026-07-26T14:00:00Z'),
        updatedAt: new Date('2026-07-26T18:00:00Z')
      },
      {
        _id: id('506'),
        requester: siddharth._id,
        recipient: tanvi._id,
        status: 'Accepted',
        note: 'Prompt Engineering for Product Management swap.',
        createdAt: new Date('2026-08-02T10:00:00Z'),
        updatedAt: new Date('2026-08-02T12:00:00Z')
      }
    ];
    const connections = await Connection.insertMany(connectionsData);
    console.log(`[Generator] Seeded ${connections.length} connections across 1-month history.`);

    // 4. Insert Messages over 1-month timeline
    const messagesData = [
      // Aarav & Ananya Chat History (July 12 to July 15)
      { _id: id('601'), sender: ananya._id, receiver: aarav._id, content: 'Namaste Aarav! I saw your profile on SkillSwap AI. You teach React.js and want to learn Python?', read: true, createdAt: new Date('2026-07-12T14:30:00Z') },
      { _id: id('602'), sender: aarav._id, receiver: ananya._id, content: 'Namaste Ananya! Yes, absolutely! I want to master Python for Data Science and AI models.', read: true, createdAt: new Date('2026-07-12T14:35:00Z') },
      { _id: id('603'), sender: ananya._id, receiver: aarav._id, content: 'Great! I can guide you through Python basics, Pandas, and Scikit-Learn.', read: true, createdAt: new Date('2026-07-13T10:00:00Z') },
      { _id: id('604'), sender: aarav._id, receiver: ananya._id, content: 'Awesome! And I will help you build your ML interactive web dashboard using React & Vite.', read: true, createdAt: new Date('2026-07-13T10:15:00Z') },
      { _id: id('605'), sender: ananya._id, receiver: aarav._id, content: 'Sounds like a plan! Let us schedule our first session on Saturday.', read: true, createdAt: new Date('2026-07-15T16:00:00Z') },
      { _id: id('606'), sender: aarav._id, receiver: ananya._id, content: 'Perfect! I just sent the session request for Saturday 4 PM.', read: true, createdAt: new Date('2026-07-15T16:10:00Z') },

      // Aarav & Priya Chat History (July 18 to Aug 4)
      { _id: id('607'), sender: priya._id, receiver: aarav._id, content: 'Hi Aarav! Thanks for accepting my connection. Whenever you are free, we can start Node.js API sessions.', read: true, createdAt: new Date('2026-07-18T09:00:00Z') },
      { _id: id('608'), sender: aarav._id, receiver: priya._id, content: 'Hi Priya! Yes, I really want to learn Express middleware, JWT tokens, and Mongoose ORM.', read: true, createdAt: new Date('2026-07-18T11:20:00Z') },
      { _id: id('609'), sender: priya._id, receiver: aarav._id, content: 'I completed our Session 1 notes. Check the Node.js API design guidelines.', read: true, createdAt: new Date('2026-08-04T18:30:00Z') },
      { _id: id('610'), sender: aarav._id, receiver: priya._id, content: 'Thank you Priya! The Express routing lesson was super clear.', read: false, createdAt: new Date('2026-08-05T08:10:00Z') },

      // Vikram & Ishita Chat History (July 27)
      { _id: id('611'), sender: vikram._id, receiver: ishita._id, content: 'Hi Ishita, let us start with Binary Trees & Graph algorithms this week.', read: true, createdAt: new Date('2026-07-27T15:00:00Z') },
      { _id: id('612'), sender: ishita._id, receiver: vikram._id, content: 'Hi Vikram! Sounds great. I will prepare the Flutter Dart state management session for you.', read: true, createdAt: new Date('2026-07-27T15:30:00Z') }
    ];
    const messages = await Message.insertMany(messagesData);
    console.log(`[Generator] Seeded ${messages.length} messages with 1-month conversation history.`);

    // 5. Insert Sessions (Past Completed & Upcoming Scheduled)
    const sessionsData = [
      {
        _id: id('701'),
        teacher: ananya._id,
        learner: aarav._id,
        skill: 'Python Basics & Data Structures',
        date: '2026-07-19',
        startTime: '16:00',
        endTime: '17:30',
        meetingType: 'Online',
        meetingLink: 'https://meet.google.com/skillswap-python-demo',
        notes: 'Session 1: Python syntax, lists, tuples, dictionaries, and list comprehensions.',
        status: 'Completed',
        createdAt: new Date('2026-07-15T16:10:00Z')
      },
      {
        _id: id('702'),
        teacher: priya._id,
        learner: aarav._id,
        skill: 'Node.js & Express API Design',
        date: '2026-08-04',
        startTime: '18:00',
        endTime: '19:30',
        meetingType: 'Online',
        meetingLink: 'https://meet.google.com/skillswap-nodejs-demo',
        notes: 'Session 1: Express routing, JWT authentication, and MongoDB connection.',
        status: 'Completed',
        createdAt: new Date('2026-07-30T10:00:00Z')
      },
      {
        _id: id('703'),
        teacher: ananya._id,
        learner: aarav._id,
        skill: 'Machine Learning Fundamentals',
        date: '2026-08-15',
        startTime: '16:00',
        endTime: '17:30',
        meetingType: 'Online',
        meetingLink: 'https://meet.google.com/skillswap-ml-session',
        notes: 'Session 2: Linear Regression, Logistic Regression, and Scikit-Learn modeling.',
        status: 'Scheduled',
        createdAt: new Date('2026-08-06T11:00:00Z')
      },
      {
        _id: id('704'),
        teacher: aarav._id,
        learner: ananya._id,
        skill: 'React.js State & Hooks',
        date: '2026-08-16',
        startTime: '11:00',
        endTime: '12:30',
        meetingType: 'Online',
        meetingLink: 'https://meet.google.com/skillswap-react-session',
        notes: 'Session 1: React useState, useEffect, and component modularity for ML UI.',
        status: 'Scheduled',
        createdAt: new Date('2026-08-06T11:30:00Z')
      }
    ];
    const sessions = await Session.insertMany(sessionsData);
    console.log(`[Generator] Seeded ${sessions.length} past and upcoming sessions.`);

    // 6. Insert Roadmaps with 1-month progress
    const pythonRoadmapData = generateRoadmapForSkill('Python', aarav._id);
    pythonRoadmapData._id = id('801');
    pythonRoadmapData.levels[0].topics[0].completed = true;
    pythonRoadmapData.levels[0].topics[0].completedAt = new Date('2026-07-20T10:00:00Z');
    pythonRoadmapData.levels[0].topics[1].completed = true;
    pythonRoadmapData.levels[0].topics[1].completedAt = new Date('2026-07-22T14:00:00Z');
    pythonRoadmapData.levels[0].topics[2].completed = true;
    pythonRoadmapData.levels[0].topics[2].completedAt = new Date('2026-07-25T11:00:00Z');

    const reactRoadmapData = generateRoadmapForSkill('React.js', ananya._id);
    reactRoadmapData._id = id('802');
    reactRoadmapData.levels[0].topics[0].completed = true;
    reactRoadmapData.levels[0].topics[0].completedAt = new Date('2026-07-28T09:00:00Z');

    await Roadmap.create(pythonRoadmapData);
    await Roadmap.create(reactRoadmapData);
    console.log('[Generator] Seeded skill roadmaps.');

    // 7. Insert Notifications spanning 1 month
    const notificationsData = [
      {
        _id: id('901'),
        user: aarav._id,
        sender: rohan._id,
        type: 'connection_request',
        title: 'New Connection Request',
        message: 'Rohan Gupta sent you a connection request to swap Cyber Security for React.js.',
        link: '/connections',
        read: false,
        createdAt: new Date('2026-08-05T09:00:00Z')
      },
      {
        _id: id('902'),
        user: aarav._id,
        sender: ananya._id,
        type: 'session_scheduled',
        title: 'Session Confirmed',
        message: 'Ananya Sharma confirmed Machine Learning Session for Saturday 4:00 PM.',
        link: '/sessions',
        read: false,
        createdAt: new Date('2026-08-06T11:05:00Z')
      },
      {
        _id: id('903'),
        user: aarav._id,
        sender: priya._id,
        type: 'new_message',
        title: 'Message from Priya Verma',
        message: 'Thank you Aarav! The Express routing lesson was super clear.',
        link: '/messages',
        read: true,
        createdAt: new Date('2026-08-05T08:10:00Z')
      }
    ];
    await Notification.insertMany(notificationsData);
    console.log('[Generator] Seeded user notifications.');

    // 8. EXPORT EVERYTHING TO MONGODB COMPASS COMPATIBLE JSON FILES
    console.log('\n📦 Exporting MongoDB Compass Extended JSON Dump Files...');

    const collectionsToExport = [
      { name: 'users', model: User },
      { name: 'skills', model: Skill },
      { name: 'connections', model: Connection },
      { name: 'messages', model: Message },
      { name: 'sessions', model: Session },
      { name: 'roadmaps', model: Roadmap },
      { name: 'notifications', model: Notification }
    ];

    for (const item of collectionsToExport) {
      const docs = await item.model.find({}).lean();
      
      // Convert standard objects to MongoDB Extended JSON v1 / Compass standard
      const compassJsonContent = JSON.stringify(docs, null, 2);
      const filePath = path.join(OUTPUT_DIR, `${item.name}.json`);
      fs.writeFileSync(filePath, compassJsonContent);
      console.log(`  📄 Exported ${item.name}.json (${docs.length} documents) -> ${filePath}`);
    }

    console.log('\n======================================================');
    console.log('✅ ALL MONGODB COMPASS JSON FILES CREATED SUCCESSFULLY!');
    console.log(`📁 Files saved in directory: ${OUTPUT_DIR}`);
    console.log('======================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('[Generator Error]:', error);
    process.exit(1);
  }
};

main();
