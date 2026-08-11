/**
 * SkillSwap AI - Dynamic Learning Roadmap Engine
 * Generates structured level-by-level skill roadmaps with topics, descriptions, and estimated hours.
 */

const PREDEFINED_ROADMAPS = {
  'python': {
    skillTitle: 'Python Programming',
    category: 'Programming & Tech',
    levels: [
      {
        levelNumber: 1,
        title: 'Python Basics & Fundamentals',
        description: 'Variables, data types, control flow, loops, and primitive operations.',
        difficulty: 'Beginner',
        estimatedHours: 8,
        topics: [
          { name: 'Environment Setup & Syntax', description: 'Installing Python, VS Code, running scripts and interactive shell.', resourceUrl: 'https://docs.python.org/3/tutorial/appetite.html' },
          { name: 'Variables & Data Types', description: 'Strings, Integers, Floats, Booleans, Type Casting.', resourceUrl: 'https://docs.python.org/3/tutorial/introduction.html' },
          { name: 'Conditional Statements', description: 'if, elif, else logic and Boolean comparisons.', resourceUrl: 'https://docs.python.org/3/tutorial/controlflow.html' },
          { name: 'Loops & Iteration', description: 'for loops, while loops, range(), break and continue.', resourceUrl: 'https://docs.python.org/3/tutorial/controlflow.html#for-statements' }
        ]
      },
      {
        levelNumber: 2,
        title: 'Data Structures & Functions',
        description: 'Built-in data containers and modular function architecture.',
        difficulty: 'Beginner',
        estimatedHours: 10,
        topics: [
          { name: 'Lists & Tuples', description: 'Indexing, slicing, list comprehensions, immutable tuples.', resourceUrl: 'https://docs.python.org/3/tutorial/datastructures.html' },
          { name: 'Dictionaries & Sets', description: 'Key-value pairs, hash sets, membership testing.', resourceUrl: 'https://docs.python.org/3/tutorial/datastructures.html#dictionaries' },
          { name: 'Functions & Scope', description: 'Def, arguments, *args, **kwargs, return values, LEGB scope.', resourceUrl: 'https://docs.python.org/3/tutorial/controlflow.html#defining-functions' },
          { name: 'Lambda & Higher-Order Functions', description: 'map(), filter(), reduce(), anonymous functions.', resourceUrl: 'https://docs.python.org/3/tutorial/controlflow.html#lambda-expressions' }
        ]
      },
      {
        levelNumber: 3,
        title: 'Object-Oriented Programming (OOP)',
        description: 'Classes, inheritance, encapsulation, polymorphism, and magic methods.',
        difficulty: 'Intermediate',
        estimatedHours: 12,
        topics: [
          { name: 'Classes & Objects', description: 'Class definition, __init__ constructor, self reference, instance attributes.', resourceUrl: 'https://docs.python.org/3/tutorial/classes.html' },
          { name: 'Inheritance & Polymorphism', description: 'Parent/child classes, method overriding, super() call.', resourceUrl: 'https://docs.python.org/3/tutorial/classes.html#inheritance' },
          { name: 'Encapsulation & Properties', description: 'Private variables, @property decorators, getters and setters.', resourceUrl: 'https://docs.python.org/3/library/functions.html#property' },
          { name: 'Dunder Methods', description: '__str__, __repr__, __len__, __eq__ operator overloading.', resourceUrl: 'https://docs.python.org/3/reference/datamodel.html#special-method-names' }
        ]
      },
      {
        levelNumber: 4,
        title: 'File Handling & Exception Management',
        description: 'Reading/writing files, error catching, and custom exceptions.',
        difficulty: 'Intermediate',
        estimatedHours: 8,
        topics: [
          { name: 'File I/O Operations', description: 'open(), context manager (with open), JSON and CSV parsing.', resourceUrl: 'https://docs.python.org/3/tutorial/inputoutput.html#reading-and-writing-files' },
          { name: 'Try-Except Blocks', description: 'Handling exceptions, try, except, else, finally blocks.', resourceUrl: 'https://docs.python.org/3/tutorial/errors.html' },
          { name: 'Modules & Packages', description: 'Importing modules, sys.path, creating custom PyPI-ready packages.', resourceUrl: 'https://docs.python.org/3/tutorial/modules.html' }
        ]
      },
      {
        levelNumber: 5,
        title: 'Web APIs & Data Processing',
        description: 'Making HTTP requests, working with REST APIs, and database integration.',
        difficulty: 'Advanced',
        estimatedHours: 14,
        topics: [
          { name: 'Requests & HTTP APIs', description: 'GET/POST requests, headers, JSON payload handling.', resourceUrl: 'https://requests.readthedocs.io/' },
          { name: 'Database Connectivity', description: 'SQLite3, PostgreSQL via psycopg2 or SQLAlchemy ORM.', resourceUrl: 'https://docs.python.org/3/library/sqlite3.html' },
          { name: 'Web Frameworks Overview', description: 'Introduction to Flask or FastAPI backend APIs.', resourceUrl: 'https://fastapi.tiangolo.com/' }
        ]
      },
      {
        levelNumber: 6,
        title: 'Advanced Python & Capstone Project',
        description: 'Concurrency, decorators, generators, and full-stack project building.',
        difficulty: 'Expert',
        estimatedHours: 20,
        topics: [
          { name: 'Decorators & Generators', description: 'Function decorators, yield statement, memory-efficient generators.', resourceUrl: 'https://docs.python.org/3/howto/functional.html' },
          { name: 'Asyncio & Concurrency', description: 'Async/await syntax, event loops, multithreading vs multiprocessing.', resourceUrl: 'https://docs.python.org/3/library/asyncio.html' },
          { name: 'Capstone Project Build', description: 'Build a production REST API / CLI application with full test coverage.', resourceUrl: 'https://docs.python.org/3/library/unittest.html' }
        ]
      }
    ]
  },
  'react.js': {
    skillTitle: 'React.js Frontend Development',
    category: 'Programming & Tech',
    levels: [
      {
        levelNumber: 1,
        title: 'React Core Concepts & JSX',
        description: 'Understanding components, JSX syntax, Virtual DOM, and rendering.',
        difficulty: 'Beginner',
        estimatedHours: 8,
        topics: [
          { name: 'JSX & Component Structure', description: 'Writing JSX, functional components, fragment usage.', resourceUrl: 'https://react.dev/learn' },
          { name: 'Props & Dynamic Rendering', description: 'Passing props, default props, destructuring, list mapping with keys.', resourceUrl: 'https://react.dev/learn/passing-props-to-a-component' },
          { name: 'Event Handling', description: 'OnClick, onChange, preventDefault, synthetic events.', resourceUrl: 'https://react.dev/learn/responding-to-events' }
        ]
      },
      {
        levelNumber: 2,
        title: 'State & Component Lifecycle',
        description: 'Managing local state with useState and handling side effects with useEffect.',
        difficulty: 'Beginner',
        estimatedHours: 10,
        topics: [
          { name: 'useState Hook', description: 'State initialization, state immutability, updater functions.', resourceUrl: 'https://react.dev/reference/react/useState' },
          { name: 'useEffect & Side Effects', description: 'Dependency arrays, cleanup functions, data fetching pattern.', resourceUrl: 'https://react.dev/reference/react/useEffect' },
          { name: 'Conditional Rendering', description: 'Ternary operators, logical AND (&&) short-circuiting.', resourceUrl: 'https://react.dev/learn/conditional-rendering' }
        ]
      },
      {
        levelNumber: 3,
        title: 'Forms, User Input & Routing',
        description: 'Controlled components, form validation, and multi-page routing with React Router.',
        difficulty: 'Intermediate',
        estimatedHours: 12,
        topics: [
          { name: 'Controlled vs Uncontrolled Forms', description: 'Form state binding, multi-input handlers, submission.', resourceUrl: 'https://react.dev/learn/sharing-state-between-components' },
          { name: 'React Router DOM', description: 'BrowserRouter, Routes, Route, Link, useNavigate, useParams.', resourceUrl: 'https://reactrouter.com/' },
          { name: 'Custom Hooks', description: 'Extracting reusable stateful logic into custom hooks.', resourceUrl: 'https://react.dev/learn/reusing-logic-with-custom-hooks' }
        ]
      },
      {
        levelNumber: 4,
        title: 'Global State Management',
        description: 'Prop drilling solutions using React Context API and Redux Toolkit.',
        difficulty: 'Intermediate',
        estimatedHours: 14,
        topics: [
          { name: 'React Context API', description: 'createContext, Provider, useContext for auth & theme state.', resourceUrl: 'https://react.dev/learn/passing-data-deeply-with-context' },
          { name: 'Redux Toolkit Fundamentals', description: 'Slices, createSlice, configureStore, useSelector, useDispatch.', resourceUrl: 'https://redux-toolkit.js.org/' }
        ]
      },
      {
        levelNumber: 5,
        title: 'Performance & Optimization',
        description: 'Memoization, lazy loading, code splitting, and bundle size reduction.',
        difficulty: 'Advanced',
        estimatedHours: 12,
        topics: [
          { name: 'useMemo & useCallback', description: 'Preventing unnecessary re-computations and function recreations.', resourceUrl: 'https://react.dev/reference/react/useMemo' },
          { name: 'React.memo & Pure Components', description: 'Component re-render optimization based on prop changes.', resourceUrl: 'https://react.dev/reference/react/memo' },
          { name: 'Code Splitting with Suspense', description: 'React.lazy dynamic imports for routes.', resourceUrl: 'https://react.dev/reference/react/lazy' }
        ]
      },
      {
        levelNumber: 6,
        title: 'Testing & Modern React Stack',
        description: 'Testing components with Vitest/RTL and deploying production SPAs.',
        difficulty: 'Expert',
        estimatedHours: 16,
        topics: [
          { name: 'React Testing Library', description: 'Unit & component integration testing, querying elements.', resourceUrl: 'https://testing-library.com/docs/react-testing-library/intro/' },
          { name: 'Production Build & Deployment', description: 'Vite build optimization, environment variables, Vercel/Netlify hosting.', resourceUrl: 'https://vitejs.dev/guide/build.html' }
        ]
      }
    ]
  }
};

function generateRoadmapForSkill(skillTitle, userId) {
  const normalizedKey = skillTitle.toLowerCase().trim();
  const existingTemplate = PREDEFINED_ROADMAPS[normalizedKey];

  if (existingTemplate) {
    return {
      user: userId,
      skillTitle: existingTemplate.skillTitle,
      category: existingTemplate.category,
      currentLevel: 1,
      levels: existingTemplate.levels
    };
  }

  // Generic 6-level generator for any arbitrary skill
  return {
    user: userId,
    skillTitle: skillTitle,
    category: 'General Development',
    currentLevel: 1,
    levels: [
      {
        levelNumber: 1,
        title: `${skillTitle} Fundamentals & Core Syntax`,
        description: `Introduction to foundational principles, basic syntax, and setup for ${skillTitle}.`,
        difficulty: 'Beginner',
        estimatedHours: 6,
        topics: [
          { name: 'Overview & Setup', description: 'Tooling, configuration, and hello-world execution.', completed: false },
          { name: 'Core Building Blocks', description: 'Primary syntax, variables, and essential patterns.', completed: false },
          { name: 'Basic Operations', description: 'Common workflows and fundamental operations.', completed: false }
        ]
      },
      {
        levelNumber: 2,
        title: `Intermediate ${skillTitle} Concepts`,
        description: `Building practical features and understanding structured logic in ${skillTitle}.`,
        difficulty: 'Beginner',
        estimatedHours: 8,
        topics: [
          { name: 'Data Management', description: 'Structuring state and data effectively.', completed: false },
          { name: 'Modular Architecture', description: 'Organizing code into clean, reusable modules.', completed: false },
          { name: 'Error Handling', description: 'Catching runtime exceptions and debugging strategies.', completed: false }
        ]
      },
      {
        levelNumber: 3,
        title: 'Practical Workflows & Libraries',
        description: 'Integrating popular libraries and ecosystem tooling.',
        difficulty: 'Intermediate',
        estimatedHours: 10,
        topics: [
          { name: 'Ecosystem Overview', description: 'Top third-party libraries and extensions.', completed: false },
          { name: 'API & Integration', description: 'Connecting with external services and data sources.', completed: false }
        ]
      },
      {
        levelNumber: 4,
        title: 'Architecture & Design Patterns',
        description: 'Applying clean code principles and scalable architectural patterns.',
        difficulty: 'Intermediate',
        estimatedHours: 12,
        topics: [
          { name: 'Design Patterns', description: 'Common architectural patterns and best practices.', completed: false },
          { name: 'State & Resource Management', description: 'Managing lifecycle and memory efficiently.', completed: false }
        ]
      },
      {
        levelNumber: 5,
        title: 'Optimization & Security',
        description: 'Performance tuning, security considerations, and production readiness.',
        difficulty: 'Advanced',
        estimatedHours: 14,
        topics: [
          { name: 'Performance Profiling', description: 'Identifying bottlenecks and optimizing execution.', completed: false },
          { name: 'Security Best Practices', description: 'Protecting against common vulnerabilities.', completed: false }
        ]
      },
      {
        levelNumber: 6,
        title: 'Mastery & Capstone Project',
        description: `Building a complex real-world project demonstrating complete mastery of ${skillTitle}.`,
        difficulty: 'Expert',
        estimatedHours: 20,
        topics: [
          { name: 'Capstone Implementation', description: 'End-to-end full-scale application development.', completed: false },
          { name: 'Deployment & CI/CD', description: 'Publishing and maintaining the application.', completed: false }
        ]
      }
    ]
  };
}

module.exports = {
  generateRoadmapForSkill
};
