// DevPath curriculum — data-driven, 600 days across 7 Levels.
// Designed like an internal engineering training program, not a tutorial playlist.
// Goal track: Python Backend + Cloud + AI Engineer, with working React fluency.
// Every day: learning objective + coding task + outcome. Weeks end with a build.

export type MissionType =
  | "learn"
  | "code"
  | "practice"
  | "build"
  | "review"
  | "project"
  | "interview";

export type Difficulty = "easy" | "medium" | "hard" | "elite";

export interface Mission {
  day: number;
  levelId: number;
  week: number;
  title: string;
  objective: string;
  outcome: string;
  type: MissionType;
  difficulty: Difficulty;
  estMinutes: number;
  xp: number;
  skills: string[];
  subtopics: string[];
  resources?: { label: string; url?: string }[];
}

export interface Level {
  id: number;
  name: string;
  tagline: string;
  startDay: number;
  endDay: number;
  color: string; // css var name
  emoji: string;
  summary: string;
  skills: string[];
}

export interface Milestone {
  day: number;
  title: string;
  emoji: string;
  description: string;
}

export interface ProjectQuest {
  id: string;
  levelId: number;
  unlockDay: number;
  name: string;
  tagline: string;
  description: string;
  skills: string[];
  requirements: string[];
  difficulty: Difficulty;
  portfolioValue: 1 | 2 | 3 | 4 | 5;
  estDays: number;
  xpReward: number;
  tasks: string[];
}

export interface AchievementRequirement {
  type: "days" | "streak" | "level" | "project";
  value: number;
  // If set, "project" achievements check for this specific project id being
  // shipped instead of a raw completed-project count. Keeps achievements like
  // "ship your first RAG project" tied to the actual project, not a headcount.
  projectId?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  requirement: AchievementRequirement;
}

export const LEVELS: Level[] = [
  {
    id: 1,
    name: "Python Foundation",
    tagline: "From zero to fluent Python",
    startDay: 1,
    endDay: 60,
    color: "--level-1",
    emoji: "🐍",
    summary:
      "Master Python syntax, data structures, functions, files, errors, modules, and OOP through daily building.",
    skills: ["Python", "Git", "GitHub", "Linux basics", "OOP"],
  },
  {
    id: 2,
    name: "Core Computer Science",
    tagline: "The fundamentals engineers actually use",
    startDay: 61,
    endDay: 140,
    color: "--level-2",
    emoji: "🧠",
    summary:
      "DSA in Python, SQL & databases, operating systems, and networks — the interview-critical foundation.",
    skills: ["DSA", "SQL", "DBMS", "OS", "Networks"],
  },
  {
    id: 3,
    name: "Backend Engineering",
    tagline: "Ship real APIs — and the UIs on top of them",
    startDay: 141,
    endDay: 240,
    color: "--level-3",
    emoji: "⚙️",
    summary:
      "FastAPI, REST design, PostgreSQL, MongoDB, Redis, JWT/OAuth authentication, testing, and enough React to ship a real full-stack product instead of an API nobody can see.",
    skills: ["FastAPI", "PostgreSQL", "MongoDB", "Redis", "Auth", "Testing", "React"],
  },
  {
    id: 4,
    name: "Cloud Engineering",
    tagline: "Deploy like a senior engineer",
    startDay: 241,
    endDay: 400,
    color: "--level-4",
    emoji: "☁️",
    summary:
      "Docker, AWS (EC2, S3, IAM, RDS, Lambda, CloudFront, API Gateway), CI/CD, autoscaling, cost & monitoring — including deploying your React frontend alongside your APIs. Reach Job Ready.",
    skills: ["Docker", "AWS", "CI/CD", "Nginx", "Serverless", "Monitoring"],
  },
  {
    id: 5,
    name: "Backend Mastery",
    tagline: "Systems that scale",
    startDay: 401,
    endDay: 460,
    color: "--level-5",
    emoji: "🏛️",
    summary:
      "System design, distributed systems, microservices, message queues, caching at scale, and advanced database patterns.",
    skills: ["System Design", "Distributed Systems", "Microservices", "Kafka"],
  },
  {
    id: 6,
    name: "Cloud Mastery",
    tagline: "Production-grade infrastructure",
    startDay: 461,
    endDay: 500,
    color: "--level-6",
    emoji: "🚀",
    summary:
      "Kubernetes, GitOps, Terraform, advanced AWS, observability, security, and cost engineering.",
    skills: ["Kubernetes", "Terraform", "GitOps", "Observability", "Security"],
  },
  {
    id: 7,
    name: "Modern AI",
    tagline: "Elite AI Software Engineer",
    startDay: 501,
    endDay: 600,
    color: "--level-7",
    emoji: "🤖",
    summary:
      "NumPy, Pandas, ML foundations, LLMs, embeddings, vector DBs, RAG, agents, fine-tuning, multi-modal AI, and the React interfaces that make all of it into a usable product.",
    skills: ["NumPy", "Pandas", "ML", "LLMs", "RAG", "LangChain", "Agents", "React"],
  },
];

export const MILESTONES: Milestone[] = [
  { day: 100, title: "Python Programmer", emoji: "🥉", description: "You can build real Python programs and reason about code." },
  { day: 200, title: "Backend Developer", emoji: "🥈", description: "You can design and ship production REST APIs." },
  { day: 300, title: "Cloud Developer", emoji: "🥇", description: "You can containerize and deploy services on AWS." },
  { day: 400, title: "Job Ready Engineer", emoji: "🏆", description: "Portfolio-ready, interview-ready, hire-ready." },
  { day: 500, title: "AI Engineer", emoji: "⭐", description: "You build production AI features with LLMs and RAG." },
  { day: 600, title: "Elite AI Software Engineer", emoji: "👑", description: "You architect and lead modern AI systems end-to-end." },
];

export const ACHIEVEMENTS: Achievement[] = [
  { id: "first-commit", title: "First Commit", description: "Complete your first mission.", emoji: "✨", requirement: { type: "days", value: 1 } },
  { id: "python-explorer", title: "Python Explorer", description: "Complete Level 1.", emoji: "🐍", requirement: { type: "level", value: 1 } },
  { id: "cs-scholar", title: "CS Scholar", description: "Complete Level 2.", emoji: "🧠", requirement: { type: "level", value: 2 } },
  { id: "rest-builder", title: "REST API Builder", description: "Complete Level 3.", emoji: "⚙️", requirement: { type: "level", value: 3 } },
  { id: "cloud-deployer", title: "Cloud Deployer", description: "Complete Level 4 — Job Ready.", emoji: "☁️", requirement: { type: "level", value: 4 } },
  { id: "systems-architect", title: "Systems Architect", description: "Complete Level 5.", emoji: "🏛️", requirement: { type: "level", value: 5 } },
  { id: "kube-captain", title: "Kube Captain", description: "Complete Level 6.", emoji: "🚀", requirement: { type: "level", value: 6 } },
  { id: "ai-explorer", title: "AI Explorer", description: "Reach the AI level.", emoji: "🤖", requirement: { type: "days", value: 501 } },
  { id: "fullstack-engineer", title: "Full-Stack Engineer", description: "Ship a project with a real React frontend wired to your API.", emoji: "🧩", requirement: { type: "project", value: 1, projectId: "fullstack-dashboard" } },
  { id: "rag-builder", title: "RAG Builder", description: "Ship your first RAG project.", emoji: "📚", requirement: { type: "project", value: 1, projectId: "pdf-chat" } },
  { id: "streak-10", title: "10 Day Streak", description: "Learn 10 days in a row.", emoji: "🔥", requirement: { type: "streak", value: 10 } },
  { id: "streak-30", title: "30 Day Streak", description: "One month, unbroken.", emoji: "🔥", requirement: { type: "streak", value: 30 } },
  { id: "streak-100", title: "100 Day Streak", description: "Legendary discipline.", emoji: "💎", requirement: { type: "streak", value: 100 } },
  { id: "job-ready", title: "Job Ready", description: "Reach day 400.", emoji: "🏆", requirement: { type: "days", value: 400 } },
  { id: "elite", title: "Elite Engineer", description: "Reach day 600.", emoji: "👑", requirement: { type: "days", value: 600 } },
  { id: "portfolio-complete", title: "Portfolio Complete", description: "Ship every project quest in the curriculum.", emoji: "🗂️", requirement: { type: "project", value: 16 } },
];

// -----------------------------------------------------------------------------
// Curriculum generation — deterministic, data-driven.
// Weekly themes per level. Each week gets 7 day-missions with rotating types.
//
// IMPORTANT: weeks.length must equal the level's computed weekCount
// (ceil(totalDays / 7)) exactly. getAllMissions() asserts this in dev and
// falls back to repeating the *last* (usually capstone/review) week rather
// than silently wrapping to week 1 if it's ever short, so a future mismatch
// degrades gracefully instead of dumping "Big-O basics" after a capstone.

interface WeekTheme {
  theme: string;
  topics: string[]; // one per day (Mon–Sat), Sun = build
  buildOutcome: string;
  skills: string[];
  // Optional per-day type overrides for the 6 non-build days (index 0-5).
  // Falls back to the standard learn/code/practice rotation when omitted.
  dayTypes?: MissionType[];
  // Optional curated resources attached to the build-day mission.
  resources?: { label: string; url: string }[];
}

const L1_WEEKS: WeekTheme[] = [
  { theme: "Python Setup & First Programs", topics: ["Install Python, VS Code, write first script","Variables, numbers, strings","Input, output, formatting","Conditionals & boolean logic","Loops: while & for","Debugging fundamentals"], buildOutcome: "CLI unit converter", skills: ["Python", "Git"], resources: [{ label: "Official Python Docs", url: "https://docs.python.org/3/" }] },
  { theme: "Core Data Structures", topics: ["Lists in depth","List comprehensions","Tuples & unpacking","Dictionaries","Sets","Nested structures"], buildOutcome: "Contact book (JSON persistence)", skills: ["Python"] },
  { theme: "Functions & Modules", topics: ["Defining functions","Args, kwargs, *args, **kwargs","Scope & closures","Lambda & higher-order functions","Modules & imports","The standard library tour"], buildOutcome: "Password generator + strength checker", skills: ["Python"] },
  { theme: "Files, IO & Errors", topics: ["Reading & writing files","CSV & JSON","Path handling with pathlib","Exceptions & try/except","Custom exceptions","Logging basics"], buildOutcome: "Expense tracker (CSV backend)", skills: ["Python"] },
  { theme: "Object-Oriented Python", topics: ["Classes & instances","Attributes & methods","Inheritance","Encapsulation & properties","Dunder methods","Composition over inheritance"], buildOutcome: "Library management OOP model", skills: ["OOP", "Python"] },
  { theme: "Iterators, Generators & Decorators", topics: ["Iterators & iter protocol","Generators & yield","Decorators","functools essentials","Context managers","Type hints"], buildOutcome: "Log analyzer with generators", skills: ["Python"] },
  { theme: "Git, GitHub & Linux", topics: ["Linux shell basics","Git init/add/commit","Branches & merges","GitHub push, PRs","Markdown READMEs","Semantic commits"], buildOutcome: "Publish first project to GitHub", skills: ["Git", "GitHub", "Linux"] },
  { theme: "Pythonic Patterns", topics: ["Enumerate, zip, itertools","collections module","dataclasses","Pattern matching","Virtual environments","pip & requirements.txt"], buildOutcome: "File organizer utility (pathlib)", skills: ["Python"] },
  { theme: "Testing & Quality", topics: ["Assertions & unittest","pytest fundamentals","Fixtures & parameterization","Mocking","Code coverage","Linting with ruff"], buildOutcome: "Test suite for expense tracker", skills: ["Python", "Testing"] },
];

const L2_WEEKS: WeekTheme[] = [
  { theme: "Complexity & Arrays", topics: ["Big-O & analysis","Array operations","Two pointers","Sliding window","Prefix sums","Kadane & subarray patterns"], buildOutcome: "10 LeetCode-style array problems", skills: ["DSA"] },
  { theme: "Strings & Hashing", topics: ["String manipulation","Hash maps in problems","Anagrams & frequency","Sliding window on strings","Palindromes","Trie intro"], buildOutcome: "Text search mini-engine", skills: ["DSA"] },
  { theme: "Linked Lists & Stacks", topics: ["Singly & doubly linked lists","Reversal patterns","Stack applications","Monotonic stacks","Queues & deques","BFS with queues"], buildOutcome: "Undo/redo history engine", skills: ["DSA"] },
  { theme: "Recursion & Trees", topics: ["Recursion mental model","Backtracking","Binary trees","BST operations","Tree traversals","Recursion → iteration"], buildOutcome: "Filesystem tree explorer", skills: ["DSA"] },
  { theme: "Graphs & Heaps", topics: ["Graph representations","BFS & DFS","Topological sort","Heaps & priority queues","Dijkstra","Union-find"], buildOutcome: "Dependency resolver", skills: ["DSA"] },
  { theme: "Dynamic Programming", topics: ["Memoization","Tabulation","Classic 1D DP","2D DP","Knapsack family","Practice set"], buildOutcome: "Solve 15 DP problems", skills: ["DSA"] },
  { theme: "SQL Foundations", topics: ["Relational model","SELECT, WHERE, ORDER","JOINs deep dive","Aggregations & GROUP BY","Subqueries","Window functions"], buildOutcome: "Analytics queries on sample DB", skills: ["SQL"] },
  { theme: "Advanced SQL & DBMS", topics: ["Indexes & EXPLAIN","Transactions & ACID","Normalization","Constraints & schemas","Views & CTEs","Postgres essentials"], buildOutcome: "Design & seed a school DB", skills: ["SQL", "DBMS"] },
  { theme: "Operating Systems", topics: ["Processes vs threads","Memory model","File systems","Scheduling basics","Concurrency primitives","Signals & IPC"], buildOutcome: "Threaded downloader", skills: ["OS"] },
  { theme: "Computer Networks", topics: ["OSI & TCP/IP","HTTP deep dive","DNS & routing","TLS & HTTPS","Sockets in Python","Rate limiting basics"], buildOutcome: "TCP chat server", skills: ["Networks"] },
  { theme: "Consolidation & Mock Assessments", topics: ["Review: arrays, strings & hashing","Review: linked lists, trees & graphs","Review: DP patterns","Review: SQL & DBMS","Review: OS & networks","Timed mixed mock exam"], buildOutcome: "Full mock technical assessment (DSA + SQL + CS)", skills: ["DSA", "SQL", "OS", "Networks"], dayTypes: ["review", "review", "review", "review", "practice", "interview"] },
  { theme: "Interview DSA Sprint", topics: ["Mixed medium set","Pattern recognition","Timed problems","Complexity trade-offs","Explain-your-solution drills","Mock problem review"], buildOutcome: "50-problem interview sheet", skills: ["DSA", "Interview"], dayTypes: ["practice", "practice", "interview", "practice", "interview", "review"] },
];

const L3_WEEKS: WeekTheme[] = [
  { theme: "HTTP & REST Design", topics: ["HTTP methods & status codes","REST principles","Resource modeling","Idempotency & caching","API versioning","OpenAPI basics"], buildOutcome: "Design REST spec for a blog", skills: ["REST"] },
  { theme: "FastAPI Fundamentals", topics: ["FastAPI setup & first endpoint","Path & query params","Pydantic models","Request/response validation","Dependency injection","Error handling"], buildOutcome: "Todo API with FastAPI", skills: ["FastAPI"], resources: [{ label: "FastAPI Docs", url: "https://fastapi.tiangolo.com/" }] },
  { theme: "PostgreSQL & ORMs", topics: ["Postgres setup","SQLAlchemy models","Migrations with Alembic","Relationships","Async DB access","Query optimization"], buildOutcome: "Persist Todo API in Postgres", skills: ["PostgreSQL", "SQLAlchemy"] },
  { theme: "Authentication", topics: ["Password hashing","Sessions vs tokens","JWT deep dive","OAuth 2.0 flows","Refresh tokens","Role-based access"], buildOutcome: "Auth service with JWT", skills: ["Auth", "JWT"] },
  { theme: "Blog API Project", topics: ["Domain modeling","CRUD endpoints","Pagination & filtering","Comments & relations","Search endpoints","API tests"], buildOutcome: "Full Blog API", skills: ["FastAPI", "PostgreSQL"] },
  { theme: "MongoDB & Redis", topics: ["Document modeling","MongoDB CRUD","Aggregation pipelines","Redis basics","Caching patterns","Rate limiting with Redis"], buildOutcome: "Add Redis cache to Blog API", skills: ["MongoDB", "Redis"] },
  { theme: "Background Jobs & Async", topics: ["asyncio deep dive","Concurrent HTTP with httpx","Task queues (RQ/Celery)","Scheduled jobs","WebSockets","Server-sent events"], buildOutcome: "Notification service with queue", skills: ["Async"] },
  { theme: "Testing & Quality", topics: ["pytest for APIs","Test DB & fixtures","Contract testing","Load testing basics","Mutation testing intro","Coverage gates"], buildOutcome: "80%+ coverage on Blog API", skills: ["Testing"] },
  { theme: "Observability & Security", topics: ["Structured logging","Metrics with Prometheus","Tracing basics","Input validation & sanitization","OWASP top 10","Secrets management"], buildOutcome: "Secure & instrument Blog API", skills: ["Security", "Observability"] },
  { theme: "React Fundamentals for Backend Engineers", topics: ["JSX & the component model","Props, state & useState","Event handling & forms","Lists, keys & conditional rendering","Component composition","Styling with Tailwind"], buildOutcome: "Static React dashboard shell (no backend yet)", skills: ["React", "JavaScript", "Tailwind"], resources: [{ label: "React Docs", url: "https://react.dev/" }] },
  { theme: "React Hooks & API Integration", topics: ["useEffect & data fetching","Loading & error states","Custom hooks","Controlled forms","React Query basics","CORS & environment configs"], buildOutcome: "React frontend wired live to your Blog API", skills: ["React", "React Query", "REST"] },
  { theme: "Full-Stack Auth & Protected Routes", topics: ["Storing JWTs safely on the client","Fetch/Axios interceptors","React Router & protected routes","Global auth state with Context","Refresh-token flow in the client","Role-based UI rendering"], buildOutcome: "Authenticated React admin panel for your Auth API", skills: ["React", "Auth", "React Router"] },
  { theme: "File Uploads & Cloud Storage", topics: ["Multipart uploads in FastAPI","Pre-signed S3 URLs","Client-side upload UI in React","Image validation & resizing","CDN basics for static assets","Storage cost & lifecycle rules"], buildOutcome: "End-to-end file upload feature (API + S3 + React UI)", skills: ["FastAPI", "S3", "React"] },
  { theme: "Clean Architecture & Advanced API Patterns", topics: ["Service & repository layers","Dependency inversion in FastAPI","Rate limiting middleware","GraphQL vs REST — when to use each","API gateway patterns","Contract-first design with OpenAPI"], buildOutcome: "Refactor Blog API into clean, testable layers", skills: ["FastAPI", "Architecture"] },
  { theme: "Capstone: Task Manager API", topics: ["Domain design","Auth & multi-tenant","Complex queries","React admin dashboard","Webhooks","Docs & polish"], buildOutcome: "Portfolio-grade Task Manager API + React dashboard", skills: ["FastAPI", "PostgreSQL", "Auth", "React"] },
];

const L4_WEEKS: WeekTheme[] = [
  { theme: "Docker Fundamentals", topics: ["Containers vs VMs","Dockerfile essentials","Layers & caching","Volumes & networks","Multi-stage builds","Best practices"], buildOutcome: "Dockerize Task Manager API", skills: ["Docker"] },
  { theme: "Docker Compose & Local Stacks", topics: ["Compose files","Multi-service stacks","Env & secrets","Healthchecks","Local Postgres + Redis","Compose overrides"], buildOutcome: "Full local dev stack", skills: ["Docker"] },
  { theme: "Linux for Servers", topics: ["Users & permissions","systemd services","Networking & firewalls","SSH keys & hardening","tmux & workflow","Log inspection"], buildOutcome: "Provision a Linux VM", skills: ["Linux"] },
  { theme: "AWS Foundations", topics: ["AWS account & IAM","EC2 basics","VPC & subnets","Security groups","Elastic IPs","AWS CLI"], buildOutcome: "Deploy API to EC2", skills: ["AWS", "EC2", "IAM"], resources: [{ label: "AWS Documentation", url: "https://docs.aws.amazon.com/" }] },
  { theme: "AWS Data & Storage", topics: ["S3 buckets & policies","RDS Postgres","ElastiCache Redis","Parameter Store & Secrets Manager","CloudWatch logs","Cost basics"], buildOutcome: "Migrate DB to RDS", skills: ["AWS", "S3", "RDS"] },
  { theme: "Nginx & TLS", topics: ["Nginx reverse proxy","TLS with Let's Encrypt","HTTP/2 & gzip","Rate limiting","Static hosting","Zero-downtime reloads"], buildOutcome: "Nginx + HTTPS in front of API", skills: ["Nginx"] },
  { theme: "CI/CD with GitHub Actions", topics: ["Workflows & jobs","Matrix builds","Docker build & push","Secrets in Actions","Release automation","Environment gates"], buildOutcome: "Full CI/CD to EC2", skills: ["CI/CD", "GitHub Actions"] },
  { theme: "Observability in Production", topics: ["Structured logs to CloudWatch","Metrics dashboards","Error tracking (Sentry)","Alerting","Uptime monitoring","Incident basics"], buildOutcome: "Observability stack for API", skills: ["Observability"] },
  { theme: "Security & Reliability", topics: ["IAM least privilege","SSM Session Manager","Backups & restore","Blue/green intro","Load testing","Disaster runbook"], buildOutcome: "Backup + restore drill", skills: ["Security"] },
  { theme: "Serverless & AWS Lambda", topics: ["Serverless mental model","Lambda functions in Python","API Gateway + Lambda","Event triggers (S3, SQS)","Cold starts & limits","When serverless wins vs loses"], buildOutcome: "Serverless webhook handler on Lambda", skills: ["AWS", "Lambda", "Serverless"] },
  { theme: "Managed Auth & API Gateway", topics: ["API Gateway deep dive","Cognito user pools","Social login basics","Gateway-level throttling","Custom domains & mTLS","API keys & usage plans"], buildOutcome: "Gateway-fronted API with Cognito auth", skills: ["AWS", "API Gateway", "Cognito"] },
  { theme: "DNS, CDN & Frontend Hosting", topics: ["Route 53 basics","CloudFront distributions","S3 static site hosting","Cache invalidation","Deploying your React frontend to S3 + CloudFront","Custom domain + HTTPS for the frontend"], buildOutcome: "React frontend live on CloudFront with a custom domain", skills: ["AWS", "CloudFront", "React"] },
  { theme: "Advanced Docker & Registries", topics: ["Private registries (ECR)","Multi-arch builds","Image scanning & hardening","Slim base images","Build caching strategies","Supply-chain basics (SBOM)"], buildOutcome: "Push a hardened image to ECR", skills: ["Docker", "AWS", "Security"] },
  { theme: "Autoscaling & Load Balancing", topics: ["Application Load Balancer","Target groups & health checks","Auto Scaling Groups","Launch templates","Scaling policies","Zero-downtime rolling deploys"], buildOutcome: "Auto-scaling API behind an ALB", skills: ["AWS", "EC2", "Scaling"] },
  { theme: "Monitoring & Cost Optimization", topics: ["CloudWatch dashboards & alarms","Cost Explorer & budgets","Right-sizing instances","Reserved vs spot vs on-demand","Tagging strategy","FinOps basics"], buildOutcome: "Cost + monitoring dashboard for your stack", skills: ["AWS", "Observability", "FinOps"] },
  { theme: "Blue-Green & Canary Deployments", topics: ["Deployment strategies compared","Blue/green with ALB","Canary releases","Feature flags","Rollback playbooks","Release checklists"], buildOutcome: "Blue/green deploy pipeline", skills: ["CI/CD", "AWS"] },
  { theme: "Site Reliability Basics", topics: ["SLIs, SLOs & error budgets intro","Incident response basics","On-call & runbooks","Postmortem culture","Load testing with Locust","Capacity planning"], buildOutcome: "SLO doc + load test report", skills: ["SRE", "Performance"] },
  { theme: "Second Capstone: Full-Stack SaaS", topics: ["Multi-tenant schema","Billing basics (Stripe)","React dashboard for the SaaS","Usage metering","Admin & support tooling","Launch checklist"], buildOutcome: "Full-stack SaaS (FastAPI + React + billing) deployed live", skills: ["FastAPI", "React", "AWS", "Stripe"] },
  { theme: "Capstone: URL Shortener SaaS", topics: ["Design & schema","Analytics with Redis","Custom domains","Rate limiting","Dockerize & ship","Public launch"], buildOutcome: "Live URL shortener on AWS", skills: ["Backend", "Cloud"] },
  { theme: "Portfolio & Resume", topics: ["Portfolio site","Case studies for 3 projects","Resume that lands interviews","LinkedIn optimization","GitHub polish","README engineering"], buildOutcome: "Public portfolio & polished resume", skills: ["Career"] },
  { theme: "Interview Prep — Systems", topics: ["System design template","Design URL shortener","Design Instagram feed","Design rate limiter","Design chat app","Whiteboard drills"], buildOutcome: "5 system-design write-ups", skills: ["System Design", "Interview"], dayTypes: ["learn", "practice", "interview", "interview", "interview", "review"] },
  { theme: "Interview Prep — Coding", topics: ["Mixed DSA sprint","Behavioral STAR stories","Live coding drills","Mock interviews","Company research","Offer negotiation"], buildOutcome: "3 mock interviews", skills: ["Interview"], dayTypes: ["practice", "review", "practice", "interview", "interview", "interview"] },
  { theme: "Job Ready Sprint", topics: ["Apply to 20 roles","Referrals outreach","Take-home strategy","Weekly review cadence","Interview retros","Momentum plan"], buildOutcome: "Active pipeline of interviews", skills: ["Career"], dayTypes: ["practice", "practice", "interview", "review", "practice", "review"] },
];

const L5_WEEKS: WeekTheme[] = [
  { theme: "System Design Foundations", topics: ["Scalability primitives","Load balancing","Caching layers","Database scaling","CAP & consistency","Design template"], buildOutcome: "Design doc: read-heavy service", skills: ["System Design"] },
  { theme: "Distributed Systems", topics: ["Replication","Sharding & partitioning","Consensus (Raft/Paxos intro)","Idempotency & retries","Eventual consistency","CRDTs overview"], buildOutcome: "Design a distributed counter", skills: ["Distributed Systems"] },
  { theme: "Message Queues & Streaming", topics: ["Kafka fundamentals","Producers & consumers","Exactly-once semantics","Redis Streams","Event-driven design","Outbox pattern"], buildOutcome: "Event pipeline with Kafka", skills: ["Kafka"] },
  { theme: "Microservices", topics: ["Service boundaries","Contracts & API gateways","Service discovery","Saga & orchestration","Bulkheads & circuit breakers","Testing microservices"], buildOutcome: "Split monolith into 3 services", skills: ["Microservices"] },
  { theme: "Advanced Databases", topics: ["Postgres internals","Indexing strategies","Query plans","Partitioning","Read replicas","Postgres at scale"], buildOutcome: "Optimize a slow schema", skills: ["PostgreSQL"] },
  { theme: "Caching & CDN at Scale", topics: ["Cache-aside vs write-through","Distributed caching (Redis Cluster)","CDN edge caching strategies","Cache invalidation patterns","Hot key problems","Cache stampede protection"], buildOutcome: "Multi-layer caching design doc", skills: ["Redis", "Caching", "System Design"] },
  { theme: "Consensus & Service Discovery", topics: ["Consensus algorithms (Raft) revisited","etcd / Zookeeper basics","Service discovery patterns","Leader election","Distributed locks","Health checking at scale"], buildOutcome: "Service discovery prototype with etcd", skills: ["Distributed Systems"] },
  { theme: "Capstone: Ride-Sharing Backend", topics: ["Domain model","Geospatial queries","Matching engine","Payments flow","Metrics & SLOs","Design review"], buildOutcome: "Production-shaped backend design", skills: ["System Design"] },
  { theme: "Performance & Reliability", topics: ["Profiling Python","Async at scale","Backpressure","SLOs & error budgets","Chaos engineering intro","Postmortems"], buildOutcome: "Perf report on capstone", skills: ["Performance"] },
];

const L6_WEEKS: WeekTheme[] = [
  { theme: "Kubernetes Fundamentals", topics: ["Pods, Deployments, Services","ConfigMaps & Secrets","Ingress","Probes & scaling","Helm intro","kubectl mastery"], buildOutcome: "Run app on local k8s", skills: ["Kubernetes"], resources: [{ label: "Kubernetes Docs", url: "https://kubernetes.io/docs/home/" }] },
  { theme: "K8s in Production", topics: ["EKS setup","Rolling updates","HPA & VPA","Persistent volumes","Namespaces & RBAC","Cost & right-sizing"], buildOutcome: "Deploy service on EKS", skills: ["Kubernetes", "AWS"] },
  { theme: "Terraform & IaC", topics: ["Terraform basics","Modules","State management","Workspaces","Drift detection","Plan/apply pipelines"], buildOutcome: "IaC for full stack", skills: ["Terraform"] },
  { theme: "GitOps & Progressive Delivery", topics: ["GitOps principles","ArgoCD / Flux setup","Automated sync & drift correction","Progressive delivery (canary via Argo Rollouts)","Multi-cluster basics","Rollback via Git revert"], buildOutcome: "GitOps pipeline deploying to EKS via ArgoCD", skills: ["Kubernetes", "GitOps", "ArgoCD"] },
  { theme: "Observability Deep Dive", topics: ["Prometheus + Grafana","OpenTelemetry tracing","Structured logs pipelines","SLIs, SLOs, SLAs","Alert design","On-call ergonomics"], buildOutcome: "Golden signals dashboards", skills: ["Observability"] },
  { theme: "Security & Cost Engineering", topics: ["IAM patterns","Network security","Secret rotation","Container hardening","Cost dashboards","FinOps intro"], buildOutcome: "Security & cost audit", skills: ["Security", "FinOps"] },
];

const L7_WEEKS: WeekTheme[] = [
  { theme: "NumPy & Pandas", topics: ["NumPy arrays","Vectorization","Pandas DataFrames","Cleaning & joining","Groupby & pivots","Real dataset EDA"], buildOutcome: "EDA notebook on real dataset", skills: ["NumPy", "Pandas"] },
  { theme: "ML Foundations", topics: ["Supervised learning","Train/test/val splits","Linear & logistic regression","Trees & ensembles","Evaluation metrics","Feature engineering"], buildOutcome: "End-to-end ML pipeline", skills: ["ML", "Scikit Learn"] },
  { theme: "Deep Learning Essentials", topics: ["Tensors with PyTorch","Autograd & training loops","MLP for tabular","CNN intro","Transfer learning","When NOT to use DL"], buildOutcome: "Image classifier with PyTorch", skills: ["PyTorch"] },
  { theme: "LLMs from an Engineer's Lens", topics: ["Tokenization","Attention & transformer intuition","Prompt engineering","Structured outputs","Function calling","Evals for LLMs"], buildOutcome: "LLM-powered assistant CLI", skills: ["LLMs"], resources: [{ label: "Anthropic API Docs", url: "https://docs.claude.com" }] },
  { theme: "Embeddings & Vector DBs", topics: ["Embedding models","Similarity search","Pinecone/Chroma basics","Chunking strategies","Hybrid search","Retrieval evals"], buildOutcome: "Semantic search over your notes", skills: ["Embeddings", "Vector DB"] },
  { theme: "RAG in Production", topics: ["Ingestion pipelines","Chunking & metadata","LangChain / LlamaIndex","Guardrails","Grounding & citations","Latency & cost"], buildOutcome: "Production RAG service", skills: ["RAG", "LangChain"] },
  { theme: "AI Agents", topics: ["Agent loops","Tool use","Planning & reflection","Multi-agent patterns","Memory","Agent evals"], buildOutcome: "Task-completing AI agent", skills: ["Agents"] },
  { theme: "AI Product Engineering", topics: ["AI UX patterns","Streaming & partial UI","Cost & rate limits","Observability for LLMs","Safety & abuse","AI product analytics"], buildOutcome: "Ship AI feature end-to-end", skills: ["AI Product"] },
  { theme: "AI Systems at Scale", topics: ["Batch vs online inference","Model serving","Caching & routing","Fine-tuning overview","Data flywheels","MLOps overview"], buildOutcome: "Scalable inference design", skills: ["MLOps"] },
  { theme: "Building AI Chat Interfaces in React", topics: ["Streaming responses in React","Server-sent events & fetch streaming","Chat UI state management","Markdown & code-block rendering","Optimistic UI & typing indicators","Accessibility for chat UIs"], buildOutcome: "Streaming AI chat UI in React wired to your LLM backend", skills: ["React", "LLMs", "Streaming"] },
  { theme: "Fine-Tuning & Model Customization", topics: ["When to fine-tune vs prompt","LoRA / PEFT basics","Dataset prep for fine-tuning","Evaluating before/after tuning","Hosting a fine-tuned model","Cost & latency trade-offs"], buildOutcome: "Fine-tune a small model on a custom dataset", skills: ["Fine-tuning", "ML"] },
  { theme: "Multi-Modal & Voice AI", topics: ["Vision-language models","Image understanding APIs","Speech-to-text & text-to-speech","Multi-modal RAG","Real-time voice agents overview","Cost & latency for multi-modal"], buildOutcome: "Multi-modal assistant (image + voice input)", skills: ["Multi-modal AI"] },
  { theme: "AI Safety, Evals & Guardrails", topics: ["Eval-driven development for LLM apps","Automated eval suites","Prompt-injection & jailbreak defenses","PII & content filtering","Human-in-the-loop review","Monitoring model drift"], buildOutcome: "Eval + guardrail suite for your RAG service", skills: ["Evals", "AI Safety"] },
  { theme: "Elite Capstone", topics: ["AI agent platform design","Multi-model orchestration","Retrieval + tools + memory","React frontend, auth & billing","Observability & evals","Launch"], buildOutcome: "Portfolio-defining AI platform (full-stack)", skills: ["AI", "Backend", "Cloud", "React"] },
  { theme: "Career: Senior & AI Roles", topics: ["Senior engineer expectations","AI engineer interviews","System design for AI","Portfolio site v2","Open-source contributions","Long-term compounding"], buildOutcome: "Senior-ready portfolio & pitch", skills: ["Career"] },
];

const LEVEL_WEEKS: Record<number, WeekTheme[]> = {
  1: L1_WEEKS,
  2: L2_WEEKS,
  3: L3_WEEKS,
  4: L4_WEEKS,
  5: L5_WEEKS,
  6: L6_WEEKS,
  7: L7_WEEKS,
};

const DIFFICULTY_BY_LEVEL: Record<number, Difficulty> = {
  1: "easy", 2: "medium", 3: "medium", 4: "hard", 5: "hard", 6: "hard", 7: "elite",
};

const XP_BY_TYPE: Record<MissionType, number> = {
  learn: 60, code: 90, practice: 100, build: 150, review: 50, project: 250, interview: 120,
};

const TYPE_ROTATION: MissionType[] = ["learn", "code", "code", "practice", "code", "practice", "build"];

function typeForDayIndex(dayInWeek: number): MissionType {
  return TYPE_ROTATION[dayInWeek % 7];
}

function estMinutesFor(type: MissionType, levelId: number): number {
  const base: Record<MissionType, number> = {
    learn: 45, code: 75, practice: 90, build: 150, review: 40, project: 180, interview: 90,
  };
  return base[type] + (levelId - 1) * 5;
}

// ---- Subtopic breakdowns ----------------------------------------------------
// Curated, day-specific headlines for what "today's topic" actually covers —
// not the broad week-level skill tags. Fully authored for Level 1 (the topics
// every new user sees first). Every other level falls back to a deterministic
// split of the topic string itself, so newer weeks still get real headline
// bullets instead of nothing — fill in SUBTOPICS entries over time to upgrade
// any specific day.
const SUBTOPICS: Record<string, string[]> = {
  "Install Python, VS Code, write first script": ["Install Python 3 & confirm with `python --version`", "Set up VS Code + Python extension", "Write & run your first .py script", "REPL vs running a file"],
  "Variables, numbers, strings": ["Variable naming & assignment", "int, float, bool basics", "String creation & basic operations", "type() and dynamic typing"],
  "Input, output, formatting": ["input() and type casting", "print() with sep/end", "f-strings & .format()", "Number formatting (decimals, padding)"],
  "Conditionals & boolean logic": ["if / elif / else", "Comparison & logical operators (and/or/not)", "Truthy vs falsy values", "Nested conditionals"],
  "Loops: while & for": ["for loops over ranges & sequences", "while loops & loop control (break/continue)", "Nested loops", "Common loop pitfalls (off-by-one, infinite loops)"],
  "Debugging fundamentals": ["Reading tracebacks", "print-debugging vs a real debugger", "VS Code breakpoints & step-through", "Common beginner error types"],
  "Lists in depth": ["Indexing & slicing", "Mutating methods (append, insert, pop, remove)", "Sorting & reversing", "Copying lists (shallow vs deep)"],
  "List comprehensions": ["Basic comprehension syntax", "Conditional (filter) comprehensions", "Nested comprehensions", "When NOT to use them"],
  "Tuples & unpacking": ["Tuple immutability", "Multiple assignment / unpacking", "Tuples as return values", "Named tuples intro"],
  "Dictionaries": ["Creating & accessing key-value pairs", ".get(), .keys(), .values(), .items()", "Dict comprehensions", "Nested dictionaries"],
  "Sets": ["Set creation & uniqueness", "Union, intersection, difference", "Set comprehensions", "When to use a set vs a list"],
  "Nested structures": ["Lists of dicts, dicts of lists", "Traversing nested data", "JSON-like structures in Python", "Deep access & mutation patterns"],
  "Defining functions": ["def syntax & return values", "Default arguments", "Docstrings", "Multiple return values"],
  "Args, kwargs, *args, **kwargs": ["Positional vs keyword arguments", "*args for variable positional args", "**kwargs for variable keyword args", "Argument unpacking when calling"],
  "Scope & closures": ["Local vs global scope", "The global/nonlocal keywords", "Closures & captured variables", "Common scope bugs"],
  "Lambda & higher-order functions": ["Lambda syntax & use cases", "map(), filter(), reduce()", "Functions as arguments", "sorted() with key="],
  "Modules & imports": ["import vs from...import", "Creating your own modules", '__name__ == "__main__"', "Package structure basics"],
  "The standard library tour": ["os & sys", "datetime", "random & math", "json"],
  "Reading & writing files": ["open() modes (r/w/a/rb)", "Context managers (with)", "Reading line-by-line vs whole file", "Writing & appending"],
  "CSV & JSON": ["csv.reader / csv.writer", "DictReader / DictWriter", "json.load / json.dump", "Handling malformed data"],
  "Path handling with pathlib": ["Path objects vs string paths", "Joining & resolving paths", "Checking existence & creating dirs", "Iterating directories (glob)"],
  "Exceptions & try/except": ["try/except/else/finally", "Catching specific exception types", "Raising exceptions", "Exception chaining"],
  "Custom exceptions": ["Subclassing Exception", "Adding custom attributes/messages", "When to create your own exception types", "Exception hierarchies"],
  "Logging basics": ["logging vs print", "Log levels (DEBUG/INFO/WARNING/ERROR)", "Configuring a basic logger", "Logging to file vs console"],
  "Classes & instances": ["class syntax & __init__", "Instance vs class attributes", "Creating & using objects", "self explained"],
  "Attributes & methods": ["Instance methods", "Class methods & @classmethod", "Static methods & @staticmethod", "Method resolution basics"],
  "Inheritance": ["Base & derived classes", "super() and method overriding", "Multiple inheritance basics", "is-a vs has-a relationships"],
  "Encapsulation & properties": ['Public vs "private" (_ and __)', "@property and setters", "Getter/setter patterns", "Why encapsulation matters"],
  "Dunder methods": ["__str__ vs __repr__", "__eq__, __lt__ for comparisons", "__len__, __getitem__", "Operator overloading basics"],
  "Composition over inheritance": ["Composing objects instead of subclassing", "When composition beats inheritance", "Delegation pattern", "Refactoring inheritance into composition"],
  "Iterators & iter protocol": ["__iter__ and __next__", "StopIteration", "Building a custom iterator class", "iter() and next() built-ins"],
  "Generators & yield": ["yield vs return", "Generator functions", "Generator expressions", "Memory efficiency of generators"],
  "Decorators": ["Functions as first-class objects", "Writing a basic decorator", "Decorators with arguments", "functools.wraps"],
  "functools essentials": ["lru_cache for memoization", "partial", "reduce", "wraps & total_ordering"],
  "Context managers": ["with statement mechanics", "__enter__ / __exit__", "contextlib.contextmanager", "Custom context managers"],
  "Type hints": ["Basic type annotations", "Optional, Union, List, Dict types", "mypy / static checking intro", "Type hints for function signatures"],
  "Linux shell basics": ["Navigating (cd, ls, pwd)", "File ops (cp, mv, rm, mkdir)", "Permissions (chmod, chown)", "Piping & redirection"],
  "Git init/add/commit": ["git init & repo structure", "Staging with git add", "Writing good commit messages", "git status & git log"],
  "Branches & merges": ["Creating & switching branches", "Merging vs conflicts", "git merge vs rebase (intro)", "Deleting merged branches"],
  "GitHub push, PRs": ["Remote repos & git push/pull", "Opening a pull request", "Code review basics", "Forking vs branching workflow"],
  "Markdown READMEs": ["Markdown syntax essentials", "Structuring a good README", "Badges & screenshots", "Documenting setup/usage"],
  "Semantic commits": ["Conventional commit format (feat/fix/docs)", "Why commit style matters", "Squashing & rewriting history", "Linking commits to issues"],
  "Enumerate, zip, itertools": ["enumerate() for index+value", "zip() for parallel iteration", "itertools.chain, product, groupby", "Combining iterables efficiently"],
  "collections module": ["Counter", "defaultdict", "OrderedDict / deque", "namedtuple recap"],
  "dataclasses": ["@dataclass basics", "Default values & field()", "Comparing dataclass instances", "frozen dataclasses"],
  "Pattern matching": ["match/case syntax", "Matching literals & types", "Destructuring in match", "When to use match vs if/elif"],
  "Virtual environments": ["Why isolate dependencies", "venv creation & activation", "Installing packages inside a venv", ".gitignore for venvs"],
  "pip & requirements.txt": ["pip install/uninstall/freeze", "requirements.txt workflow", "Pinning versions", "Intro to pyproject.toml"],
  "Assertions & unittest": ["assert statements", "unittest.TestCase basics", "setUp/tearDown", "Running tests from the CLI"],
  "pytest fundamentals": ["pytest vs unittest", "Writing test functions", "Assertions in pytest", "Test discovery conventions"],
  "Fixtures & parameterization": ["@pytest.fixture basics", "Fixture scope", "@pytest.mark.parametrize", "Reusable test data"],
  "Mocking": ["unittest.mock basics", "Mocking functions & objects", "patch() decorator/context manager", "When (not) to mock"],
  "Code coverage": ["Installing coverage/pytest-cov", "Reading a coverage report", "Meaningful vs vanity coverage", "Coverage in CI"],
  "Linting with ruff": ["What linting catches", "Running ruff & fixing issues", "Configuring rules", "Linting in pre-commit hooks"],
};

// Deterministic fallback for any topic without a curated entry above: split
// multi-part topic strings ("ConfigMaps & Secrets", "Pods, Deployments,
// Services") into their real headline parts instead of showing one vague
// tag. Single-concept topics ("EC2 basics") stay as one headline — still
// today's actual topic, not a generic skill word.
function subtopicsFor(topic: string): string[] {
  const curated = SUBTOPICS[topic];
  if (curated) return curated;
  const parts = topic
    .split(/,|&|\//)
    .map((p) => p.trim())
    .filter(Boolean);
  return parts.length > 1 ? parts : [topic];
}

let cachedMissions: Mission[] | null = null;

export function getAllMissions(): Mission[] {
  if (cachedMissions) return cachedMissions;
  const missions: Mission[] = [];
  let day = 1;
  for (const level of LEVELS) {
    const weeks = LEVEL_WEEKS[level.id];
    const totalDaysInLevel = level.endDay - level.startDay + 1;
    const weekCount = Math.ceil(totalDaysInLevel / 7);

    if (weeks.length < weekCount && typeof console !== "undefined") {
      // Defensive: this should never fire if week themes are kept in sync
      // with each level's day range, but if it ever does, we'd rather repeat
      // the level's final (usually capstone/review) week than silently loop
      // back to its very first, most basic week.
      console.warn(
        `[curriculum] Level ${level.id} ("${level.name}") needs ${weekCount} week themes but only has ${weeks.length}. Repeating the final week to fill the gap — add more WeekTheme entries to fix this properly.`
      );
    }

    let remaining = totalDaysInLevel;
    for (let w = 0; w < weekCount; w++) {
      const week = weeks[w] ?? weeks[weeks.length - 1];
      const daysThisWeek = Math.min(7, remaining);
      for (let d = 0; d < daysThisWeek; d++) {
        const isBuild = d === daysThisWeek - 1;
        const type: MissionType = isBuild ? "build" : week.dayTypes?.[d] ?? typeForDayIndex(d);
        const topic = week.topics[d] || `${week.theme} — deep practice`;
        const title = isBuild ? `Build: ${week.buildOutcome}` : topic;
        const objective = isBuild
          ? `Ship a working ${week.buildOutcome.toLowerCase()} that demonstrates this week's skills.`
          : `Learn and immediately apply: ${topic.toLowerCase()}.`;
        const outcome = isBuild
          ? `A committed repo containing ${week.buildOutcome.toLowerCase()} with a README.`
          : `Working code you wrote yourself that demonstrates ${topic.toLowerCase()}.`;
        missions.push({
          day,
          levelId: level.id,
          week: w + 1,
          title,
          objective,
          outcome,
          type,
          difficulty: DIFFICULTY_BY_LEVEL[level.id],
          estMinutes: estMinutesFor(type, level.id),
          xp: XP_BY_TYPE[type],
          skills: week.skills,
          subtopics: isBuild ? [] : subtopicsFor(topic),
          resources: isBuild ? week.resources : undefined,
        });
        day++;
      }
      remaining -= daysThisWeek;
      if (remaining <= 0) break;
    }
  }
  cachedMissions = missions;
  return missions;
}

export function getMission(day: number): Mission | undefined {
  return getAllMissions().find((m) => m.day === day);
}

export function getLevelForDay(day: number): Level {
  return LEVELS.find((l) => day >= l.startDay && day <= l.endDay) ?? LEVELS[LEVELS.length - 1];
}

export function totalDays(): number {
  return LEVELS[LEVELS.length - 1].endDay;
}

// ---- Projects ---------------------------------------------------------------

export const PROJECTS: ProjectQuest[] = [
  { id: "expense-tracker", levelId: 1, unlockDay: 28, name: "Expense Tracker", tagline: "CLI + CSV persistence", description: "A personal expense tracker that reads and writes CSV, computes summaries by category, and exports monthly reports.", skills: ["Python", "Files", "OOP"], requirements: ["Add / list / delete entries","Monthly summary","CSV import/export"], difficulty: "easy", portfolioValue: 2, estDays: 4, xpReward: 400, tasks: ["Data model","CLI interface","CSV backend","Summary logic","Tests","README"] },
  { id: "password-manager", levelId: 1, unlockDay: 45, name: "Password Manager", tagline: "Encrypted local vault", description: "Password vault using Fernet symmetric encryption. Master password unlocks a JSON vault.", skills: ["Python", "Crypto"], requirements: ["Master password KDF","Encrypted storage","Search & clipboard copy"], difficulty: "medium", portfolioValue: 3, estDays: 5, xpReward: 500, tasks: ["Crypto layer","Storage layer","CLI","Search","Tests"] },
  { id: "file-organizer", levelId: 1, unlockDay: 58, name: "File Organizer", tagline: "Sort thousands of files intelligently", description: "Automate cleaning a messy folder — sort by type, date, or custom rules.", skills: ["Python", "Pathlib"], requirements: ["Rule engine","Dry-run mode","Undo support"], difficulty: "medium", portfolioValue: 2, estDays: 3, xpReward: 350, tasks: ["Scanner","Rule engine","Executor","Undo log","CLI"] },
  { id: "student-mgmt", levelId: 2, unlockDay: 120, name: "Student Management System", tagline: "SQL-backed CRUD app", description: "Manage students, courses, grades. Postgres schema with reports.", skills: ["SQL", "Postgres", "Python"], requirements: ["Normalized schema","CRUD","Reports with joins"], difficulty: "medium", portfolioValue: 3, estDays: 6, xpReward: 600, tasks: ["Schema design","Migrations","CRUD","Reports","Seed data"] },
  { id: "auth-api", levelId: 3, unlockDay: 170, name: "Authentication API", tagline: "JWT + refresh tokens", description: "Production-quality auth service: signup, login, refresh, password reset, RBAC.", skills: ["FastAPI", "JWT", "Postgres"], requirements: ["Password hashing","Access + refresh tokens","RBAC","Rate limiting"], difficulty: "hard", portfolioValue: 4, estDays: 7, xpReward: 800, tasks: ["Schema","Auth flows","Token rotation","Rate limits","Tests","Docs"] },
  { id: "blog-api", levelId: 3, unlockDay: 200, name: "Blog API", tagline: "Full REST with comments & search", description: "Feature-complete blog backend: posts, comments, tags, search, pagination.", skills: ["FastAPI", "Postgres"], requirements: ["Auth-gated writes","Comments","Search","Pagination"], difficulty: "hard", portfolioValue: 4, estDays: 8, xpReward: 900, tasks: ["Domain model","CRUD","Comments","Search","Tests","Docs"] },
  { id: "fullstack-dashboard", levelId: 3, unlockDay: 220, name: "Full-Stack Admin Dashboard", tagline: "React + FastAPI, real auth", description: "A React admin dashboard wired to your Blog and Auth APIs — login, protected routes, CRUD tables, file uploads. The project that proves you can ship a product, not just an endpoint.", skills: ["React", "FastAPI", "Auth"], requirements: ["JWT login flow","Protected routes","CRUD tables with pagination","File upload UI"], difficulty: "hard", portfolioValue: 4, estDays: 6, xpReward: 700, tasks: ["Auth flow","Routing","Data tables","Upload UI","Polish & deploy"] },
  { id: "task-manager-api", levelId: 3, unlockDay: 235, name: "Task Manager API", tagline: "Multi-tenant with webhooks", description: "Production-grade task manager backend with teams, webhooks, and background jobs.", skills: ["FastAPI", "PostgreSQL", "Redis"], requirements: ["Teams & permissions","Webhooks","Background jobs","OpenAPI docs"], difficulty: "hard", portfolioValue: 5, estDays: 10, xpReward: 1200, tasks: ["Design","Auth","Core CRUD","Webhooks","Jobs","Tests","Docs"] },
  { id: "dockerized-backend", levelId: 4, unlockDay: 260, name: "Dockerized Backend", tagline: "Full local stack in one command", description: "Multi-service Docker Compose stack with API, Postgres, Redis, Nginx.", skills: ["Docker", "Compose"], requirements: ["Multi-stage builds","Compose stack","Healthchecks","Env management"], difficulty: "hard", portfolioValue: 3, estDays: 4, xpReward: 500, tasks: ["Dockerfile","Compose","Healthchecks","Docs"] },
  { id: "aws-deploy", levelId: 4, unlockDay: 320, name: "AWS Production Deploy", tagline: "EC2 + RDS + S3 + Nginx + HTTPS", description: "Deploy Task Manager API to AWS with RDS Postgres, S3 uploads, Nginx + TLS.", skills: ["AWS", "EC2", "RDS", "Nginx"], requirements: ["IAM least-privilege","RDS Postgres","S3 file uploads","HTTPS"], difficulty: "hard", portfolioValue: 5, estDays: 7, xpReward: 1000, tasks: ["Provision","Deploy","RDS","S3","Nginx + TLS","Runbook"] },
  { id: "url-shortener", levelId: 4, unlockDay: 380, name: "URL Shortener SaaS", tagline: "Live product with analytics", description: "Production URL shortener with click analytics, rate limiting, custom domains, live on AWS.", skills: ["Backend", "AWS", "Redis"], requirements: ["Analytics","Rate limiting","Custom domains","CI/CD"], difficulty: "hard", portfolioValue: 5, estDays: 10, xpReward: 1400, tasks: ["Design","Core API","Analytics","Ratelimit","Deploy","Launch"] },
  { id: "k8s-deploy", levelId: 6, unlockDay: 480, name: "Kubernetes Deployment", tagline: "EKS with IaC & autoscaling", description: "Deploy your backend to EKS with Terraform, HPA, Ingress, and observability.", skills: ["Kubernetes", "Terraform", "AWS"], requirements: ["EKS via Terraform","HPA","Ingress + TLS","Dashboards"], difficulty: "elite", portfolioValue: 5, estDays: 8, xpReward: 1500, tasks: ["Terraform","EKS","Helm chart","HPA","Observability"] },
  { id: "pdf-chat", levelId: 7, unlockDay: 540, name: "PDF Chat (RAG)", tagline: "Chat with your documents", description: "Upload PDFs, chunk + embed, retrieve, and chat with grounding and citations.", skills: ["RAG", "LangChain", "Vector DB"], requirements: ["Ingestion pipeline","Retrieval","Citations","Streaming UI"], difficulty: "elite", portfolioValue: 5, estDays: 8, xpReward: 1600, tasks: ["Ingest","Embed","Retrieve","Chat","Citations","Evals"] },
  { id: "resume-analyzer", levelId: 7, unlockDay: 560, name: "AI Resume Analyzer", tagline: "LLM-powered feedback tool", description: "Analyze resumes with LLM, produce structured feedback and rewrites.", skills: ["LLMs", "Structured Output"], requirements: ["Structured outputs","Rubric-based scoring","Rewrite mode"], difficulty: "elite", portfolioValue: 4, estDays: 5, xpReward: 1200, tasks: ["Prompting","Scoring","Rewrite","UI","Evals"] },
  { id: "ai-chat-ui", levelId: 7, unlockDay: 575, name: "AI Chat Interface", tagline: "Streaming React chat UI over your RAG backend", description: "A polished, streaming chat interface in React connected to your RAG/agent backend — markdown rendering, citations, and conversation history. Pairs directly with the PDF Chat and AI Agent Platform projects.", skills: ["React", "LLMs", "RAG"], requirements: ["Streaming responses","Markdown + code rendering","Citations UI","Conversation history"], difficulty: "elite", portfolioValue: 5, estDays: 6, xpReward: 1000, tasks: ["Chat UI shell","Streaming wire-up","Citations","History & persistence","Polish"] },
  { id: "ai-agent-platform", levelId: 7, unlockDay: 595, name: "AI Agent Platform", tagline: "Portfolio-defining capstone", description: "Multi-tool AI agent platform with auth, memory, evals, billing, and observability.", skills: ["Agents", "RAG", "Backend", "Cloud"], requirements: ["Agent loop","Tools & memory","Auth & billing","Evals & observability"], difficulty: "elite", portfolioValue: 5, estDays: 14, xpReward: 3000, tasks: ["Design","Agent core","Tools","Memory","Auth","Billing","Evals","Launch"] },
];