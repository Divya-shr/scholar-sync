# ScholarSync – Resume & Google Scholar Integration App

## Objective

Develop a full‑stack web application using Next.js that integrates a user’s resume and Google Scholar profile to suggest suitable projects based on their skills, education, and academic work. The app will:

1. Parse the resume to extract key details (name, contact, skills, experience, education).  
2. Fetch the Google Scholar profile to gather research interests, publications, citations, and h‑index.  
3. Run a recommendation engine that suggests projects categorized by the user’s skills and academic expertise.  

---

## Table of Contents

1. [Frontend Specifications](#frontend-specifications)  
2. [Backend Specifications](#backend-specifications)  
3. [State Management & Async Patterns](#state-management--async-patterns)  
4. [Security Considerations](#security-considerations)  
5. [Design Patterns](#design-patterns)  
6. [Testing](#testing)  
7. [Linting & Tooling](#linting--tooling)  


---

## Frontend Specifications

### 1. Core Technologies

- **Framework**: Next.js (App Router, SSR/SSG)  
- **Language**: TypeScript  
- **Styling**: Tailwind CSS + shadcn/ui components  
- **State Management**: Redux Toolkit (with Thunks)  
- **Animations**: Framer Motion  

### 2. Key UI Components

- **ResumeUploader**:  
  - Drag & drop or click to upload PDF/DOCX  
  - Shows upload progress, file metadata  
  - “Analyze Resume” button  

- **ScholarProfileInput**:  
  - URL input field for Google Scholar  
  - Validates URL format, shows loader on fetch  
  - Displays researcher name, affiliation, citations, h‑index, interests, recent publications  

- **ProjectSuggestions**:  
  - Lists recommended projects with title, description, match score badge  
  - Tags for matched skills & research areas  
  - “Refine Analysis” & “Save Results” buttons  

- **ResultsPage**:  
  - Summary cards for resume & scholar data  
  - Grid of suggested projects with dynamic gradients and hover effects  

---

## Backend Specifications

### 1. Resume Parsing API

- **Route**: `POST /api/parse-resume`  
- **Implementation**: Next.js API Route  
- **Parser**: `pdf-parse` (PDF) and `mammoth.js` (DOCX)  
- **Output**:  
  ```json
  {
    "name": "John Doe",
    "emails": ["john@example.com"],
    "phone": "+1-555-123-4567",
    "skills": ["JavaScript","React","AWS",…],
    "education": ["B.Sc. Computer Science 2020",…],
    "experience": ["Frontend Intern – XYZ Corp (2021–22)",…]
  }

## 2. Google Scholar API

- **Route**: `POST /api/scrape-scholar`  
- **Implementation**: Next.js API Route using Puppeteer  
- **Data Extracted**:  
  - `name` (selector `#gsc_prf_in`)  
  - `affiliation` (selector `.gsc_prf_il`)  
  - `interests` (selector `.gsc_prf_ila`)  
  - `citations`, `hIndex` (from `td.gsc_rsb_std`)  
  - `publications` (first 20 rows, selector `.gsc_a_tr`)

---

## 3. Project Suggestion Logic

- **Route**: `POST /api/suggest-projects`  
- **Input**: Parsed resume JSON + scholar JSON  
- **Engine**:  
  1. **Embeddings**: Sentence‑Transformers `all‑mpnet‑base‑v2` served via a FastAPI microservice (`embed-engine/`)  
  2. **Matcher**: Cosine similarity between the concatenated profile embedding and each project’s embedding  
  3. **Fallback**: If no high‑score matches are found, return the top 3 generic projects with a forced 50% match score  
- **Storage**: Supabase table `results` with columns:
  - `id` UUID (primary key)  
  - `created_at` TIMESTAMP  
  - `resume_data` JSONB  
  - `scholar_data` JSONB  
  - `project_suggestions` JSONB  

---

## State Management & Async Patterns

### Redux Slices

- **resumeSlice** — stores parsed resume data  
- **scholarSlice** — stores Google Scholar profile data  
- **suggestionSlice** — stores project suggestions  

### Async Thunks

- **fetchResume** — calls `/api/parse-resume`  
- **fetchScholar** — calls `/api/scrape-scholar`  
- **fetchSuggestions** — invokes the embedding engine, then saves to Supabase  

### Promise Patterns

- `Promise.all()` — run resume parse and scholar scrape in parallel  
- `Promise.race()` — optionally fallback to the fastest parser if multiple are configured  
- Sequential chaining — resume ⟶ scholar ⟶ embed ⟶ database save

---

## Security Considerations

### Input Validation

- File type & size checks on resume uploads  
- URL pattern validation for Scholar profile endpoint  

### API Security

- Rate limiting on `/api/scrape-scholar` to prevent abuse  
- Secrets (Supabase keys, service roles) stored exclusively in environment variables  
- Supabase Row‑Level Security (RLS) with a policy allowing only the service role to insert  

### Sanitization & Headers

- Strip any HTML from parsed text to prevent XSS  
- Use `dangerouslySetInnerHTML` only on sanitized strings  
- Configure a strict CSP via Next.js’s `headers()` API

---

## Design Patterns

| Pattern    | Use Case                                                                    |
|------------|------------------------------------------------------------------------------|
| **Factory**   | Instantiate `PDFParser` vs `DocxParser` based on file type                   |
| **Strategy**  | Swapable text‑extraction strategies for different resume formats             |
| **Observer**  | UI components subscribe to Redux store updates for live progress feedback     |
| **Singleton** | Single Supabase client and single embedding‐model instance across the app     |
| **Adapter**   | Normalize Puppeteer vs Cheerio scrapers under a common ScholarProfile interface |

---

## Testing

### Unit Tests (Jest & RTL)

- **ResumeUploader** renders and fires API calls correctly  
- **scholarSlice** reducers and async thunks  
- **matcher.ts** scoring logic with mocked embeddings  

### Integration Tests

- Next.js API routes tested via `supertest` or Next’s built‑in test utils  
- Mock Puppeteer & `pdf-parse` to simulate edge cases  

### E2E Tests (Cypress)

- Full upload → analyze → results workflow  
- Test with a variety of resume files (different formats, missing sections)  
- Validate error handling on invalid Google Scholar URLs  

## Linting & Tooling

- **ESLint + Prettier**  
  - Configured for TypeScript, React, and Next.js  
  - Rules enforced via `.eslintrc.json` and `.prettierrc`  
  - Automatically fixes formatting and lint errors on save or via CLI

- **Husky Pre‑commit Hooks**  
  - Runs `eslint --fix` and `prettier --write` on staged files  
  - Ensures code style consistency before commits  
  - Defined in `package.json` under `"husky"` scripts

- **EditorConfig**  
  - `.editorconfig` enforces consistent indentation, line endings, and charset  
  - Shared across IDEs to standardize developer environment

- **TypeScript**  
  - Strict mode enabled (`"strict": true`) in `tsconfig.json`  
  - No implicit `any`, strict null checks, and path aliases configured

- **Gitignore**  
  - Ignores build artifacts (`.next/`, `node_modules/`, `venv/`, etc.)  
  - Keeps repository clean and reduces merge conflicts

## Installation & Setup

> Prerequisite: Node.js v18+, Python 3.10+, and Git

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/scholarsync.git
cd scholarsync
```

### 2. Install Frontend Dependencies

```bash
cd scholar-sync
npm install
```

### 3. Install Backend Dependencies

```bash
cd embed-engine
python -m venv venv
source venv/bin/activate  
pip install -r requirements.txt
```

> If missing, install manually:
```bash
pip install fastapi uvicorn sentence-transformers torch
```

### 4. Environment Variables

Create `.env.local` in `scholar-sync/`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 5. Start the Servers

Run embedding engine:

```bash
cd embed-engine
uvicorn app:app --reload --port 8001
```

Run Next.js frontend:

```bash
cd scholar-sync
npm run dev
