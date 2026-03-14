# IELTS Testing Platform - Project Structure

## Step 1: Complete Folder Structure

```
ielts-testing-platform/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts          # Database connection & Prisma setup
│   │   │   └── env.ts               # Environment variables validation
│   │   ├── controllers/
│   │   │   ├── authController.ts    # Login, Register, JWT
│   │   │   ├── adminController.ts   # Test creation, monitoring
│   │   │   ├── studentController.ts # Test joining, answering
│   │   │   └── resultsController.ts # Results fetch & analysis
│   │   ├── middleware/
│   │   │   ├── authMiddleware.ts    # JWT verification
│   │   │   ├── roleMiddleware.ts    # Admin/Student role check
│   │   │   └── errorHandler.ts      # Global error handling
│   │   ├── routes/
│   │   │   ├── authRoutes.ts
│   │   │   ├── adminRoutes.ts
│   │   │   ├── studentRoutes.ts
│   │   │   └── resultsRoutes.ts
│   │   ├── services/
│   │   │   ├── authService.ts       # Registration, login logic
│   │   │   ├── testService.ts       # Test creation, question fetching
│   │   │   ├── sessionService.ts    # Session management
│   │   │   └── resultService.ts     # Grading & result calculation
│   │   ├── utils/
│   │   │   ├── pinGenerator.ts      # Generate 4-digit PIN
│   │   │   ├── questionLoader.ts    # Load questions from JSON files
│   │   │   ├── shuffleAnswers.ts    # Shuffle A,B,C,D options
│   │   │   └── logger.ts            # Logging utility
│   │   ├── types/
│   │   │   └── index.ts             # TypeScript interfaces & types
│   │   ├── prisma/
│   │   │   └── schema.prisma        # Prisma schema
│   │   ├── socket/
│   │   │   └── socketHandler.ts     # Socket.io real-time events
│   │   └── app.ts                   # Express app setup
│   ├── question_database/
│   │   ├── vocabulary_questions/
│   │   │   └── vocab_001.json       # Vocabulary question files
│   │   └── grammar_questions/
│   │       └── grammar_001.json     # Grammar question files
│   ├── uploads/                     # (Future: audio/image files)
│   ├── .env.example
│   ├── .env
│   ├── package.json
│   ├── tsconfig.json
│   ├── jest.config.js               # Testing configuration
│   └── server.ts                    # Express server entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout/
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   └── MainContent.tsx
│   │   │   ├── Auth/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   └── RegisterForm.tsx
│   │   │   ├── Admin/
│   │   │   │   ├── Dashboard.tsx
│   │   │   │   ├── CreateTest.tsx
│   │   │   │   ├── Students.tsx
│   │   │   │   ├── Results.tsx
│   │   │   │   ├── Settings.tsx
│   │   │   │   └── LiveMonitoring.tsx
│   │   │   ├── Student/
│   │   │   │   ├── Dashboard.tsx
│   │   │   │   ├── TestJoin.tsx
│   │   │   │   ├── TestTaking.tsx
│   │   │   │   ├── VocabularyQuestion.tsx
│   │   │   │   ├── GrammarQuestion.tsx
│   │   │   │   ├── SectionTransition.tsx
│   │   │   │   ├── MyResults.tsx
│   │   │   │   ├── ResultDetail.tsx
│   │   │   │   └── Settings.tsx
│   │   │   └── Common/
│   │   │       ├── Timer.tsx
│   │   │       ├── Modal.tsx
│   │   │       └── Loading.tsx
│   │   ├── pages/
│   │   │   ├── AdminPage.tsx
│   │   │   ├── StudentPage.tsx
│   │   │   └── LoginPage.tsx
│   │   ├── services/
│   │   │   ├── api.ts               # Axios/Fetch API calls
│   │   │   └── socketClient.ts      # Socket.io client
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useTest.ts
│   │   │   └── useTimer.ts
│   │   ├── context/
│   │   │   ├── AuthContext.tsx
│   │   │   ├── TestContext.tsx
│   │   │   └── UserContext.tsx
│   │   ├── utils/
│   │   │   ├── tokenStorage.ts      # JWT token management
│   │   │   └── validators.ts
│   │   ├── styles/
│   │   │   └── globals.css          # Tailwind CSS imports
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   │   └── (static assets)
│   ├── .env.example
│   ├── .env
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── index.html
│
├── .gitignore
└── README.md
```

---

## Step 2: PostgreSQL Database Schema (Prisma)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// USERS TABLE
model User {
  id                String      @id @default(cuid())
  fullName          String
  phoneNumber       String      @unique
  email             String?
  username          String      @unique
  password          String      // Hashed with bcrypt
  role              UserRole    @default(STUDENT)
  createdAt         DateTime    @default(now())
  updatedAt         DateTime    @updatedAt

  // Relations
  testSessions      TestSession[]
  results           Result[]

  @@index([role])
  @@index([username])
}

enum UserRole {
  ADMIN
  STUDENT
}

// TEST SESSIONS TABLE
model TestSession {
  id                String      @id @default(cuid())
  pinCode           String      @unique // 4-digit code
  title             String
  createdBy         String      // Admin user ID
  createdByUser     User        @relation(fields: [createdBy], references: [id], onDelete: Cascade)

  // Test configuration
  sections          TestSection[] // One for Vocab, one for Grammar

  // Status
  isActive          Boolean     @default(true)
  createdAt         DateTime    @default(now())
  updatedAt         DateTime    @updatedAt

  // Relations
  results           Result[]

  @@index([pinCode])
  @@index([isActive])
}

// TEST SECTIONS (Vocabulary or Grammar)
model TestSection {
  id                String      @id @default(cuid())
  testSession       TestSession @relation(fields: [testSessionId], references: [id], onDelete: Cascade)
  testSessionId     String

  // Section config
  sectionType       SectionType // VOCABULARY or GRAMMAR
  numberOfQuestions Int         // How many questions to fetch
  timeAllocated     Int         // Minutes
  sectionOrder      Int         // 1 for first, 2 for second

  createdAt         DateTime    @default(now())

  @@unique([testSessionId, sectionOrder])
  @@index([testSessionId])
}

enum SectionType {
  VOCABULARY
  GRAMMAR
}

// RESULTS TABLE
model Result {
  id                String      @id @default(cuid())
  student           User        @relation(fields: [studentId], references: [id], onDelete: Cascade)
  studentId         String
  testSession       TestSession @relation(fields: [testSessionId], references: [id], onDelete: Cascade)
  testSessionId     String

  // Answers (JSON array)
  answers           StudentAnswer[] // See below

  // Scoring
  totalScore        Float
  vocabScore        Float?      // Null if no vocab section
  grammarScore      Float?      // Null if no grammar section
  vocabCorrect      Int?
  vocabTotal        Int?
  grammarCorrect    Int?
  grammarTotal      Int?

  // Status
  submittedAt       DateTime    @default(now())
  isCompleted       Boolean     @default(true)

  @@unique([studentId, testSessionId])
  @@index([studentId])
  @@index([testSessionId])
}

// STUDENT ANSWERS (part of Result)
model StudentAnswer {
  id                String      @id @default(cuid())
  result            Result      @relation(fields: [resultId], references: [id], onDelete: Cascade)
  resultId          String

  // Question details
  questionId        String      // From JSON file
  questionType      SectionType // VOCABULARY or GRAMMAR
  selectedAnswer    String      // A, B, C, or D (or text for grammar)
  correctAnswer     String
  isCorrect         Boolean

  createdAt         DateTime    @default(now())

  @@index([resultId])
}

// ACTIVE TEST SESSIONS (for anti-cheat monitoring)
model ActiveSession {
  id                String      @id @default(cuid())
  studentId         String
  testSessionId     String
  pinCode           String

  // Current section & timing
  currentSection    SectionType
  sectionStartTime  DateTime
  sectionTimeLimit  Int         // Seconds

  // Anti-cheat
  tabSwitchCount    Int         @default(0)
  lastActive        DateTime    @default(now())
  isActive          Boolean     @default(true)

  createdAt         DateTime    @default(now())

  @@index([studentId])
  @@index([testSessionId])
  @@index([pinCode])
}
```

---

## Step 3: Perfect JSON File Structures

### Vocabulary Question Example
```json
// backend/question_database/vocabulary_questions/vocab_001.json
{
  "id": "vocab_001",
  "questionNumber": 1,
  "type": "VOCABULARY",
  "question": "The scientist made a groundbreaking _______ that changed the field forever.",
  "audio_path": null,
  "image_path": null,
  "options": {
    "A": "discovery",
    "B": "discover",
    "C": "discoverable",
    "D": "discoverment"
  },
  "correctAnswer": "A",
  "explanation": "The blank requires a noun. 'Discovery' is the noun form, while 'discover' is a verb, 'discoverable' is an adjective, and 'discoverment' is not a standard English word."
}
```

### Vocabulary with Audio Example
```json
// backend/question_database/vocabulary_questions/vocab_002.json
{
  "id": "vocab_002",
  "questionNumber": 2,
  "type": "VOCABULARY",
  "question": "Listen to the word and select the correct spelling:",
  "audio_path": "/uploads/audio/vocab_word_02.mp3",
  "image_path": null,
  "options": {
    "A": "acquiesce",
    "B": "acquesce",
    "C": "acqiesce",
    "D": "acquiesce"
  },
  "correctAnswer": "A",
  "explanation": "The correct spelling is 'acquiesce' (to agree without protest)."
}
```

### Vocabulary with Image Example
```json
// backend/question_database/vocabulary_questions/vocab_003.json
{
  "id": "vocab_003",
  "questionNumber": 3,
  "type": "VOCABULARY",
  "question": "What is the name of this object?",
  "audio_path": null,
  "image_path": "/uploads/images/vocab_object_03.jpg",
  "options": {
    "A": "prism",
    "B": "pyramid",
    "C": "cylinder",
    "D": "sphere"
  },
  "correctAnswer": "A",
  "explanation": "A prism is a transparent geometric shape that refracts light."
}
```

### Grammar Question Example (Complex with Multiple Related Questions)
```json
// backend/question_database/grammar_questions/grammar_001.json
{
  "id": "grammar_001",
  "type": "GRAMMAR",
  "passage": "The Industrial Revolution, which began in the eighteenth century, was a period of enormous social change. Factories replaced rural workshops, and millions of people ___1___ to urban centers seeking employment. However, working conditions were often appalling. Children ___2___ in dangerous factories for twelve hours a day without any protective equipment. Many reformers ___3___ for better conditions, but change came slowly. By the nineteenth century, labor laws ___4___ and workers gained some protections. The revolution also ___5___ rapid technological advancement, leading to new inventions that ___6___ modern society.",
  "audio_path": null,
  "image_path": null,
  "questions": [
    {
      "id": "grammar_001_q1",
      "questionNumber": 1,
      "blank": 1,
      "question": "____1____",
      "type": "gap-filling",
      "options": {
        "A": "migrated",
        "B": "migratory",
        "C": "migration",
        "D": "migrate"
      },
      "correctAnswer": "A",
      "explanation": "Requires past tense verb. 'Migrated' fits the historical context."
    },
    {
      "id": "grammar_001_q2",
      "questionNumber": 2,
      "blank": 2,
      "question": "____2____",
      "type": "gap-filling",
      "options": {
        "A": "work",
        "B": "worked",
        "C": "works",
        "D": "working"
      },
      "correctAnswer": "B",
      "explanation": "Past tense required. Children 'worked' in factories during the Industrial Revolution."
    },
    {
      "id": "grammar_001_q3",
      "questionNumber": 3,
      "blank": 3,
      "question": "____3____",
      "type": "gap-filling",
      "options": {
        "A": "advocated",
        "B": "advocate",
        "C": "advocating",
        "D": "advocacy"
      },
      "correctAnswer": "A",
      "explanation": "Past tense verb needed. 'Advocated' (campaigned/argued) fits the sentence."
    },
    {
      "id": "grammar_001_q4",
      "questionNumber": 4,
      "blank": 4,
      "question": "____4____",
      "type": "gap-filling",
      "options": {
        "A": "were introduced",
        "B": "introduced",
        "C": "was introduced",
        "D": "had introduced"
      },
      "correctAnswer": "A",
      "explanation": "Plural passive voice required. 'Labor laws were introduced' is grammatically correct."
    },
    {
      "id": "grammar_001_q5",
      "questionNumber": 5,
      "blank": 5,
      "question": "____5____",
      "type": "gap-filling",
      "options": {
        "A": "spurred",
        "B": "spurs",
        "C": "spurring",
        "D": "spurted"
      },
      "correctAnswer": "A",
      "explanation": "Past tense required. 'Spurred' means encouraged or promoted."
    },
    {
      "id": "grammar_001_q6",
      "questionNumber": 6,
      "blank": 6,
      "question": "____6____",
      "type": "gap-filling",
      "options": {
        "A": "shaping",
        "B": "shaped",
        "C": "shape",
        "D": "shapes"
      },
      "correctAnswer": "B",
      "explanation": "Past participle needed. 'Shaped' (past tense) describes how inventions affected modern society."
    }
  ]
}
```

### Grammar Question Example 2 (Multiple Choice + Gap Filling Combo)
```json
// backend/question_database/grammar_questions/grammar_002.json
{
  "id": "grammar_002",
  "type": "GRAMMAR",
  "passage": "Climate change is one of the most pressing issues of our time. Scientists agree that human activities, ___1___ burning fossil fuels, are the primary cause. The rising temperatures have ___2___ catastrophic effects on ecosystems. Polar bears, whose habitats are melting, face extinction. Coral reefs, which ___3___ to warming waters, are bleaching at alarming rates. Governments around the world ___4___ to implement stricter environmental policies. However, individual actions also matter. By reducing our carbon footprint, we can ___5___ contribute to a sustainable future.",
  "audio_path": null,
  "image_path": null,
  "questions": [
    {
      "id": "grammar_002_q1",
      "questionNumber": 1,
      "blank": 1,
      "question": "____1____",
      "type": "gap-filling",
      "options": {
        "A": "such that",
        "B": "such as",
        "C": "such which",
        "D": "so that"
      },
      "correctAnswer": "B",
      "explanation": "'Such as' is used to provide examples. Burning fossil fuels is an example of human activities."
    },
    {
      "id": "grammar_002_q2",
      "questionNumber": 2,
      "blank": 2,
      "question": "____2____",
      "type": "gap-filling",
      "options": {
        "A": "been",
        "B": "have",
        "C": "had",
        "D": "having"
      },
      "correctAnswer": "B",
      "explanation": "Present perfect auxiliary 'have' is needed. 'Rising temperatures have had catastrophic effects.'"
    },
    {
      "id": "grammar_002_q3",
      "questionNumber": 3,
      "blank": 3,
      "question": "____3____",
      "type": "gap-filling",
      "options": {
        "A": "are sensitive",
        "B": "are susceptible",
        "C": "are exposed",
        "D": "are vulnerable"
      },
      "correctAnswer": "D",
      "explanation": "'Vulnerable' is the most appropriate term for reefs that are at risk from warming waters."
    },
    {
      "id": "grammar_002_q4",
      "questionNumber": 4,
      "blank": 4,
      "question": "____4____",
      "type": "gap-filling",
      "options": {
        "A": "are committing",
        "B": "are committed",
        "C": "commit",
        "D": "have committed"
      },
      "correctAnswer": "B",
      "explanation": "Passive voice present 'are committed' indicates ongoing commitment to environmental policies."
    },
    {
      "id": "grammar_002_q5",
      "questionNumber": 5,
      "blank": 5,
      "question": "____5____",
      "type": "gap-filling",
      "options": {
        "A": "meaningfully",
        "B": "significantly",
        "C": "collectively",
        "D": "positively"
      },
      "correctAnswer": "B",
      "explanation": "'Significantly' means substantially and is the most appropriate adverb in this context."
    }
  ]
}
```

---

## Summary of Structures

✅ **Folder Structure**: Complete frontend & backend organization with clear separation of concerns
✅ **Prisma Schema**: 8 models (User, TestSession, TestSection, Result, StudentAnswer, ActiveSession) with proper relations
✅ **JSON Formats**:
- Vocabulary: Single question with options
- Grammar: Complex passage with 6-10 related sub-questions
- Optional audio_path and image_path fields

---

**Ready for Step 1, 2, 3 confirmation?**

Once you approve these foundations, I'll proceed with writing:
- Step 4: Backend implementation (routes, controllers, services, socket.io)
- Step 5: Frontend implementation (pages, components, hooks, context)
