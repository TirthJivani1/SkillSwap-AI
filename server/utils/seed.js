require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Skill = require('../models/Skill');
const Connection = require('../models/Connection');
const Message = require('../models/Message');
const Session = require('../models/Session');
const Roadmap = require('../models/Roadmap');
const Notification = require('../models/Notification');
const { generateRoadmapForSkill } = require('../services/roadmapService');

const SKILLS_TAXONOMY = [
  { name: 'React.js', category: 'Programming & Tech', description: 'Frontend UI library for modern web apps', iconName: 'Code' },
  { name: 'Python', category: 'Programming & Tech', description: 'High-level language for web, AI & data science', iconName: 'Terminal' },
  { name: 'Machine Learning', category: 'Data & AI', description: 'Predictive modeling, scikit-learn, and neural networks', iconName: 'Brain' },
  { name: 'Node.js', category: 'Programming & Tech', description: 'Asynchronous JavaScript backend runtime', iconName: 'Server' },
  { name: 'MongoDB', category: 'Programming & Tech', description: 'NoSQL document database design & queries', iconName: 'Database' },
  { name: 'UI/UX Design', category: 'Design & Creative', description: 'Figma wireframing, prototyping, and user testing', iconName: 'Figma' },
  { name: 'Cyber Security', category: 'Programming & Tech', description: 'Ethical hacking, network security, and cryptography', iconName: 'Shield' },
  { name: 'Graphic Design', category: 'Design & Creative', description: 'Photoshop, Illustrator, branding & visual communication', iconName: 'Palette' },
  { name: 'Video Editing', category: 'Design & Creative', description: 'Premiere Pro, DaVinci Resolve, color grading & motion graphics', iconName: 'Video' },
  { name: 'Public Speaking', category: 'Personal Development', description: 'Communication, presentation skills, & confidence building', iconName: 'Mic' },
  { name: 'Data Structures & Algorithms', category: 'Programming & Tech', description: 'Trees, graphs, dynamic programming, and problem solving', iconName: 'Cpu' },
  { name: 'Deep Learning', category: 'Data & AI', description: 'PyTorch, TensorFlow, CNNs, and Transformers', iconName: 'Sparkles' },
  { name: 'Docker & Kubernetes', category: 'Programming & Tech', description: 'Containerization, DevOps pipelines, and orchestration', iconName: 'Box' },
  { name: 'Spanish Language', category: 'Languages', description: 'Conversational Spanish grammar and vocabulary', iconName: 'Globe' },
  { name: 'Digital Marketing', category: 'Business & Marketing', description: 'SEO, Google Ads, content strategy, & analytics', iconName: 'TrendingUp' },
  { name: 'Java', category: 'Programming & Tech', description: 'Object-oriented Enterprise software development', iconName: 'Code' },
  { name: 'Flutter & Dart', category: 'Programming & Tech', description: 'Cross-platform mobile application development', iconName: 'Smartphone' },
  { name: 'Financial Literacy', category: 'Personal Development', description: 'Personal finance, investing, and budgeting strategies', iconName: 'DollarSign' },
  { name: 'Prompt Engineering', category: 'Data & AI', description: 'Optimizing AI LLM prompts and agent workflows', iconName: 'Zap' },
  { name: 'Product Management', category: 'Business & Marketing', description: 'Agile development, user stories, product roadmaps', iconName: 'Briefcase' }
];

const SEED_USERS = [
  {
    fullName: 'Alex Rivera',
    email: 'alex@example.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    bio: '7th Sem Computer Engineering student passionate about React & UI design. Seeking Python & ML expert for mutual exchange!',
    location: 'Ahmedabad, India',
    education: 'B.Tech Computer Engineering (SEM 7)',
    interests: ['Web Development', 'AI/ML', 'UI/UX Design', 'Open Source'],
    availability: ['Weekends', 'Evenings'],
    preferredMode: 'Online',
    experienceLevel: 'Intermediate',
    skillsTeach: [
      { name: 'React.js', category: 'Programming & Tech', proficiency: 'Advanced', yearsOfExperience: 3, description: 'Component architecture, Hooks, Redux & Vite apps.' },
      { name: 'UI/UX Design', category: 'Design & Creative', proficiency: 'Intermediate', yearsOfExperience: 2, description: 'Figma UI design, design systems, and wireframing.' }
    ],
    skillsLearn: [
      { name: 'Python', category: 'Programming & Tech', desiredLevel: 'Advanced', description: 'Looking to master Python for AI projects.' },
      { name: 'Machine Learning', category: 'Data & AI', desiredLevel: 'Intermediate', description: 'Want to build predictive models with scikit-learn.' }
    ]
  },
  {
    fullName: 'Sophia Chen',
    email: 'sophia@example.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
    bio: 'Data Scientist & ML Researcher. Love teaching Python & Machine Learning. Looking to build sleek Web UIs using React.js!',
    location: 'Bangalore, India',
    education: 'M.Tech Data Science & AI',
    interests: ['Machine Learning', 'Deep Learning', 'Frontend Frameworks'],
    availability: ['Weekends', 'Evenings'],
    preferredMode: 'Online',
    experienceLevel: 'Advanced',
    skillsTeach: [
      { name: 'Python', category: 'Programming & Tech', proficiency: 'Expert', yearsOfExperience: 5, description: 'Advanced Python, NumPy, Pandas, Asyncio.' },
      { name: 'Machine Learning', category: 'Data & AI', proficiency: 'Advanced', yearsOfExperience: 4, description: 'Regression, Classification, Neural Networks.' }
    ],
    skillsLearn: [
      { name: 'React.js', category: 'Programming & Tech', desiredLevel: 'Intermediate', description: 'Want to build interactive web dashboards for my ML models.' },
      { name: 'UI/UX Design', category: 'Design & Creative', desiredLevel: 'Beginner', description: 'Improve visual design of web apps.' }
    ]
  },
  {
    fullName: 'Marcus Vance',
    email: 'marcus@example.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    bio: 'Cyber Security Consultant & Ethical Hacker. Eager to swap security skills for Node.js backend development mastery.',
    location: 'Mumbai, India',
    education: 'B.Tech Information Technology',
    interests: ['Cyber Security', 'DevOps', 'Cloud Architecture'],
    availability: ['Weekdays', 'Evenings'],
    preferredMode: 'Hybrid',
    experienceLevel: 'Expert',
    skillsTeach: [
      { name: 'Cyber Security', category: 'Programming & Tech', proficiency: 'Expert', yearsOfExperience: 6, description: 'Ethical hacking, vulnerability assessments, penetration testing.' }
    ],
    skillsLearn: [
      { name: 'Node.js', category: 'Programming & Tech', desiredLevel: 'Advanced', description: 'Master asynchronous microservices and API gateways.' },
      { name: 'MongoDB', category: 'Programming & Tech', desiredLevel: 'Intermediate', description: 'Database schema optimization and indexing.' }
    ]
  },
  {
    fullName: 'Priya Sharma',
    email: 'priya@example.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    bio: 'Senior Backend Engineer proficient in Node.js & MongoDB. Wanting to learn Cyber Security and Docker containerization.',
    location: 'Pune, India',
    education: 'B.E. Computer Science',
    interests: ['Backend APIs', 'System Design', 'Cyber Security'],
    availability: ['Weekends', 'Mornings'],
    preferredMode: 'Online',
    experienceLevel: 'Advanced',
    skillsTeach: [
      { name: 'Node.js', category: 'Programming & Tech', proficiency: 'Expert', yearsOfExperience: 5, description: 'REST APIs, Express.js, JWT, Socket.IO, Performance tuning.' },
      { name: 'MongoDB', category: 'Programming & Tech', proficiency: 'Advanced', yearsOfExperience: 4, description: 'Mongoose ORM, Aggregation pipelines, performance indexes.' }
    ],
    skillsLearn: [
      { name: 'Cyber Security', category: 'Programming & Tech', desiredLevel: 'Intermediate', description: 'Securing REST APIs and web servers.' },
      { name: 'Docker & Kubernetes', category: 'Programming & Tech', desiredLevel: 'Intermediate', description: 'Containerizing Node.js applications.' }
    ]
  },
  {
    fullName: 'David Miller',
    email: 'david@example.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    bio: 'Lead Graphic Designer & Creative Director. Passionate about visual storytelling. Looking to practice Public Speaking and Spanish!',
    location: 'Delhi, India',
    education: 'Bachelor of Fine Arts (BFA)',
    interests: ['Graphic Design', 'Branding', 'Languages', 'Public Speaking'],
    availability: ['Flexible'],
    preferredMode: 'Online',
    experienceLevel: 'Expert',
    skillsTeach: [
      { name: 'Graphic Design', category: 'Design & Creative', proficiency: 'Expert', yearsOfExperience: 7, description: 'Photoshop, Illustrator, typography, brand identity.' },
      { name: 'Video Editing', category: 'Design & Creative', proficiency: 'Advanced', yearsOfExperience: 4, description: 'Premiere Pro & After Effects motion graphics.' }
    ],
    skillsLearn: [
      { name: 'Public Speaking', category: 'Personal Development', desiredLevel: 'Advanced', description: 'Keynote presentations and confidence.' },
      { name: 'Spanish Language', category: 'Languages', desiredLevel: 'Beginner', description: 'Basic conversational Spanish.' }
    ]
  },
  {
    fullName: 'Aisha Patel',
    email: 'aisha@example.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
    bio: 'Public Speaking Coach & Marketing Strategist. Excited to swap communication tips for Graphic Design skills.',
    location: 'Vadodara, India',
    education: 'MBA in Marketing',
    interests: ['Public Speaking', 'Digital Marketing', 'Graphic Design'],
    availability: ['Weekends', 'Evenings'],
    preferredMode: 'Online',
    experienceLevel: 'Advanced',
    skillsTeach: [
      { name: 'Public Speaking', category: 'Personal Development', proficiency: 'Expert', yearsOfExperience: 5, description: 'Speech structuring, vocal dynamics, stage presence.' },
      { name: 'Digital Marketing', category: 'Business & Marketing', proficiency: 'Advanced', yearsOfExperience: 4, description: 'SEO, Social Media campaigns, Brand growth.' }
    ],
    skillsLearn: [
      { name: 'Graphic Design', category: 'Design & Creative', desiredLevel: 'Intermediate', description: 'Creating visually stunning social media banners.' }
    ]
  },
  {
    fullName: 'Karan Malhotra',
    email: 'karan@example.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80',
    bio: 'Competitive Programmer & DSA Mentor. Mastering Data Structures & Algorithms. Wanting to learn Flutter for mobile apps!',
    location: 'Hyderabad, India',
    education: 'B.Tech Computer Science (SEM 7)',
    interests: ['Algorithms', 'Mobile Dev', 'Competitive Coding'],
    availability: ['Weekdays', 'Evenings'],
    preferredMode: 'Online',
    experienceLevel: 'Advanced',
    skillsTeach: [
      { name: 'Data Structures & Algorithms', category: 'Programming & Tech', proficiency: 'Expert', yearsOfExperience: 4, description: 'Trees, Graphs, DP, Dynamic Programming, LeetCode patterns.' },
      { name: 'Java', category: 'Programming & Tech', proficiency: 'Advanced', yearsOfExperience: 3, description: 'Core Java, OOPs, Collections framework.' }
    ],
    skillsLearn: [
      { name: 'Flutter & Dart', category: 'Programming & Tech', desiredLevel: 'Intermediate', description: 'Cross-platform mobile apps for Android and iOS.' }
    ]
  },
  {
    fullName: 'Emily Watson',
    email: 'emily@example.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
    bio: 'Flutter Mobile App Developer. Passionate about clean code architecture. Need help cracking advanced Data Structures & Algorithms.',
    location: 'Chennai, India',
    education: 'B.Tech Information Technology',
    interests: ['Mobile Development', 'UI Design', 'Problem Solving'],
    availability: ['Weekends', 'Mornings'],
    preferredMode: 'Online',
    experienceLevel: 'Intermediate',
    skillsTeach: [
      { name: 'Flutter & Dart', category: 'Programming & Tech', proficiency: 'Advanced', yearsOfExperience: 3, description: 'Widget trees, State management (Bloc/Provider), REST API integration.' }
    ],
    skillsLearn: [
      { name: 'Data Structures & Algorithms', category: 'Programming & Tech', desiredLevel: 'Advanced', description: 'Cracking tech interview algorithm challenges.' }
    ]
  },
  {
    fullName: 'Rahul Verma',
    email: 'rahul@example.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=300&auto=format&fit=crop&q=80',
    bio: 'Prompt Engineer & AI Specialist. Passionate about LLM workflows. Looking to learn Product Management frameworks.',
    location: 'Bengaluru, India',
    education: 'B.Tech AI & Data Engineering',
    interests: ['Generative AI', 'Prompt Engineering', 'Product Strategy'],
    availability: ['Weekends', 'Evenings'],
    preferredMode: 'Online',
    experienceLevel: 'Intermediate',
    skillsTeach: [
      { name: 'Prompt Engineering', category: 'Data & AI', proficiency: 'Advanced', yearsOfExperience: 2, description: 'Few-shot prompting, RAG architectures, LLM agent development.' }
    ],
    skillsLearn: [
      { name: 'Product Management', category: 'Business & Marketing', desiredLevel: 'Intermediate', description: 'Agile sprints, user personas, product launches.' }
    ]
  },
  {
    fullName: 'Neha Kapoor',
    email: 'neha@example.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    bio: 'Product Manager at a Tech Startup. Love building products people love. Want to master Prompt Engineering and AI integration!',
    location: 'Gurgaon, India',
    education: 'MBA & B.Tech CSE',
    interests: ['Product Strategy', 'AI Agents', 'User Growth'],
    availability: ['Weekdays', 'Evenings'],
    preferredMode: 'Online',
    experienceLevel: 'Advanced',
    skillsTeach: [
      { name: 'Product Management', category: 'Business & Marketing', proficiency: 'Expert', yearsOfExperience: 5, description: 'Roadmapping, PRDs, sprint planning, analytics.' }
    ],
    skillsLearn: [
      { name: 'Prompt Engineering', category: 'Data & AI', desiredLevel: 'Intermediate', description: 'Leveraging AI LLMs in product workflows.' }
    ]
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/skillswap_ai');
    console.log('[Seed] Connected to MongoDB...');

    // Clear existing data
    await User.deleteMany({});
    await Skill.deleteMany({});
    await Connection.deleteMany({});
    await Message.deleteMany({});
    await Session.deleteMany({});
    await Roadmap.deleteMany({});
    await Notification.deleteMany({});
    console.log('[Seed] Cleared old collections...');

    // 1. Seed Skills Taxonomy
    const createdSkills = await Skill.insertMany(SKILLS_TAXONOMY);
    console.log(`[Seed] Seeded ${createdSkills.length} skills into taxonomy.`);

    // 2. Seed Demo Users
    const createdUsers = [];
    for (const userData of SEED_USERS) {
      const user = await User.create(userData);
      createdUsers.push(user);
    }
    console.log(`[Seed] Seeded ${createdUsers.length} realistic user accounts.`);

    const alex = createdUsers.find(u => u.email === 'alex@example.com');
    const sophia = createdUsers.find(u => u.email === 'sophia@example.com');
    const marcus = createdUsers.find(u => u.email === 'marcus@example.com');
    const priya = createdUsers.find(u => u.email === 'priya@example.com');
    const david = createdUsers.find(u => u.email === 'david@example.com');
    const aisha = createdUsers.find(u => u.email === 'aisha@example.com');
    const karan = createdUsers.find(u => u.email === 'karan@example.com');
    const emily = createdUsers.find(u => u.email === 'emily@example.com');

    // 3. Seed Connection Requests & Network
    const conn1 = await Connection.create({ requester: sophia._id, recipient: alex._id, status: 'Accepted' });
    const conn2 = await Connection.create({ requester: priya._id, recipient: alex._id, status: 'Accepted' });
    const conn3 = await Connection.create({ requester: marcus._id, recipient: alex._id, status: 'Pending', note: 'Hey Alex! Would love to swap Cyber Security for React.js tips.' });
    const conn4 = await Connection.create({ requester: david._id, recipient: aisha._id, status: 'Accepted' });
    const conn5 = await Connection.create({ requester: karan._id, recipient: emily._id, status: 'Accepted' });
    console.log('[Seed] Seeded connections network.');

    // 4. Seed Real Conversations & Messages
    const messagesData = [
      { sender: sophia._id, receiver: alex._id, content: 'Hi Alex! I saw you teach React.js and want to learn Python. That matches my goals perfectly!', createdAt: new Date(Date.now() - 3600000 * 24) },
      { sender: alex._id, receiver: sophia._id, content: 'Hey Sophia! Yes, absolutely! I want to build ML applications with Python.', createdAt: new Date(Date.now() - 3600000 * 23) },
      { sender: sophia._id, receiver: alex._id, content: 'Awesome! Shall we schedule a 1-on-1 session this weekend to get started?', createdAt: new Date(Date.now() - 3600000 * 20) },
      { sender: alex._id, receiver: sophia._id, content: 'Sounds great! I just sent a session request for Saturday at 4 PM.', createdAt: new Date(Date.now() - 3600000 * 18) },
      
      { sender: priya._id, receiver: alex._id, content: 'Hey Alex, thanks for connecting! Let me know when you want to dive into Node.js API development.', createdAt: new Date(Date.now() - 3600000 * 10) },
      { sender: alex._id, receiver: priya._id, content: 'Hi Priya! I am really looking forward to learning Express middleware and JWT auth.', createdAt: new Date(Date.now() - 3600000 * 8) }
    ];
    await Message.insertMany(messagesData);
    console.log('[Seed] Seeded message conversations.');

    // 5. Seed Scheduled Learning Sessions
    const sessionsData = [
      {
        teacher: sophia._id,
        learner: alex._id,
        skill: 'Python',
        date: '2026-08-15',
        startTime: '16:00',
        endTime: '17:30',
        meetingType: 'Online',
        meetingLink: 'https://meet.google.com/skillswap-python-demo',
        notes: 'Session 1: Python Data Structures & Object-Oriented Principles.',
        status: 'Scheduled'
      },
      {
        teacher: alex._id,
        learner: sophia._id,
        skill: 'React.js',
        date: '2026-08-16',
        startTime: '11:00',
        endTime: '12:30',
        meetingType: 'Online',
        meetingLink: 'https://meet.google.com/skillswap-react-demo',
        notes: 'Session 1: React State & Vite setup for ML dashboard.',
        status: 'Scheduled'
      },
      {
        teacher: priya._id,
        learner: alex._id,
        skill: 'Node.js',
        date: '2026-08-10',
        startTime: '18:00',
        endTime: '19:00',
        meetingType: 'Online',
        meetingLink: 'https://meet.google.com/skillswap-nodejs-demo',
        notes: 'Express Routing & Middleware Architecture.',
        status: 'Completed'
      }
    ];
    await Session.insertMany(sessionsData);
    console.log('[Seed] Seeded scheduled sessions.');

    // 6. Seed Learning Roadmaps for Alex & Sophia
    const pythonRoadmapData = generateRoadmapForSkill('Python', alex._id);
    // Mark first 3 topics of level 1 as completed for demo progress
    pythonRoadmapData.levels[0].topics[0].completed = true;
    pythonRoadmapData.levels[0].topics[1].completed = true;
    pythonRoadmapData.levels[0].topics[2].completed = true;

    const reactRoadmapData = generateRoadmapForSkill('React.js', sophia._id);
    reactRoadmapData.levels[0].topics[0].completed = true;

    await Roadmap.create(pythonRoadmapData);
    await Roadmap.create(reactRoadmapData);
    console.log('[Seed] Seeded personalized skill roadmaps.');

    // 7. Seed Notifications for Alex
    await Notification.create([
      {
        user: alex._id,
        sender: marcus._id,
        type: 'connection_request',
        title: 'New Connection Request',
        message: 'Marcus Vance sent you a connection request.',
        link: '/connections',
        read: false
      },
      {
        user: alex._id,
        sender: sophia._id,
        type: 'session_scheduled',
        title: 'Session Confirmed',
        message: 'Sophia Chen confirmed Python Learning Session for Saturday 4:00 PM.',
        link: '/sessions',
        read: false
      },
      {
        user: alex._id,
        sender: priya._id,
        type: 'new_message',
        title: 'New Message from Priya',
        message: 'Hi Alex! I am really looking forward to learning Express middleware...',
        link: '/messages',
        read: true
      }
    ]);
    console.log('[Seed] Seeded user notifications.');

    console.log('====================================================');
    console.log('✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('💡 Demo Account Credentials:');
    console.log('   Email: alex@example.com | Password: password123');
    console.log('   Email: sophia@example.com | Password: password123');
    console.log('   Email: marcus@example.com | Password: password123');
    console.log('====================================================');

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedDatabase();
