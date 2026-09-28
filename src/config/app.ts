export interface PageConfig {
  label: string;
  href: string;
  description: string;
  entities: string[];
  workflows: string[];
}

export interface EntityConfig {
  name: string;
  label: string;
  fields: Array<{ name: string; kind: "string" | "number" | "boolean" | "date" }>;
}

export interface WorkflowConfig {
  slug: string;
  title: string;
  description: string;
  prompt: string;
  fields: string[];
}

export const appConfig = {
  slug: "ai-reskilling-academy",
  title: "AI Reskilling Academy",
  tagline: "Personalized learning paths to job-transition readiness",
  accent: "cyan",
};

export const pages: PageConfig[] = [
  {
    label: "Learners",
    href: "/learners",
    description: "Learners, cohorts, placements.",
    entities: ["Learner", "Cohort", "PlacementOutcome"],
    workflows: ["readiness-brief"],
  },
  {
    label: "Curriculum",
    href: "/curriculum",
    description: "Learning paths, modules, and assignments.",
    entities: ["LearningPath", "Module", "Assignment", "SkillBenchmark"],
    workflows: ["path-generate"],
  },
  {
    label: "Assessment",
    href: "/assessment",
    description: "Assessment results, mentor reviews, credentials.",
    entities: ["AssessmentResult", "MentorReview", "ReadinessScore", "Credential", "CoachingNote"],
    workflows: ["assignment-build"],
  },
];

export const entities: Record<string, EntityConfig> = {
  Cohort: {
    name: "Cohort",
    label: "Cohort",
    fields: [{ name: "name", kind: "string" }, { name: "program", kind: "string" }, { name: "startDate", kind: "date" }, { name: "endDate", kind: "date" }, { name: "capacity", kind: "number" }, { name: "status", kind: "string" }],
  },
  Learner: {
    name: "Learner",
    label: "Learner",
    fields: [{ name: "name", kind: "string" }, { name: "email", kind: "string" }, { name: "currentRole", kind: "string" }, { name: "targetRole", kind: "string" }, { name: "status", kind: "string" }, { name: "enrolledAt", kind: "date" }],
  },
  LearningPath: {
    name: "LearningPath",
    label: "Learning Path",
    fields: [{ name: "title", kind: "string" }, { name: "learnerRef", kind: "string" }, { name: "targetRole", kind: "string" }, { name: "status", kind: "string" }, { name: "moduleCount", kind: "number" }, { name: "progressPct", kind: "number" }],
  },
  Module: {
    name: "Module",
    label: "Module",
    fields: [{ name: "title", kind: "string" }, { name: "skill", kind: "string" }, { name: "sequenceOrder", kind: "number" }, { name: "format", kind: "string" }, { name: "durationMinutes", kind: "number" }, { name: "status", kind: "string" }],
  },
  Assignment: {
    name: "Assignment",
    label: "Assignment",
    fields: [{ name: "title", kind: "string" }, { name: "brief", kind: "string" }, { name: "deliverable", kind: "string" }, { name: "status", kind: "string" }, { name: "dueDate", kind: "date" }, { name: "moduleRef", kind: "string" }],
  },
  AssessmentResult: {
    name: "AssessmentResult",
    label: "Assessment",
    fields: [{ name: "learnerRef", kind: "string" }, { name: "moduleRef", kind: "string" }, { name: "score", kind: "number" }, { name: "passScore", kind: "number" }, { name: "status", kind: "string" }, { name: "takenAt", kind: "date" }],
  },
  MentorReview: {
    name: "MentorReview",
    label: "Mentor Review",
    fields: [{ name: "mentor", kind: "string" }, { name: "learnerRef", kind: "string" }, { name: "submissionRef", kind: "string" }, { name: "feedback", kind: "string" }, { name: "status", kind: "string" }, { name: "reviewedAt", kind: "date" }],
  },
  ReadinessScore: {
    name: "ReadinessScore",
    label: "Readiness Score",
    fields: [{ name: "learnerRef", kind: "string" }, { name: "targetRole", kind: "string" }, { name: "score", kind: "number" }, { name: "evidence", kind: "string" }, { name: "status", kind: "string" }, { name: "computedAt", kind: "date" }],
  },
  Credential: {
    name: "Credential",
    label: "Credential",
    fields: [{ name: "learnerRef", kind: "string" }, { name: "title", kind: "string" }, { name: "issuer", kind: "string" }, { name: "issuedAt", kind: "date" }, { name: "verificationUrl", kind: "string" }, { name: "status", kind: "string" }],
  },
  PlacementOutcome: {
    name: "PlacementOutcome",
    label: "Placement",
    fields: [{ name: "learnerRef", kind: "string" }, { name: "employer", kind: "string" }, { name: "placedRole", kind: "string" }, { name: "salary", kind: "number" }, { name: "status", kind: "string" }, { name: "placedAt", kind: "date" }],
  },
  SkillBenchmark: {
    name: "SkillBenchmark",
    label: "Skill Benchmark",
    fields: [{ name: "skill", kind: "string" }, { name: "level", kind: "string" }, { name: "description", kind: "string" }, { name: "standardRef", kind: "string" }, { name: "status", kind: "string" }, { name: "role", kind: "string" }],
  },
  CoachingNote: {
    name: "CoachingNote",
    label: "Coaching Note",
    fields: [{ name: "coach", kind: "string" }, { name: "learnerRef", kind: "string" }, { name: "topic", kind: "string" }, { name: "note", kind: "string" }, { name: "status", kind: "string" }, { name: "loggedAt", kind: "date" }],
  },
};

export const workflows: WorkflowConfig[] = [
  {
    slug: "path-generate",
    title: "Draft: Learning Path Generator",
    description: "Generate a personalized learning path.",
    prompt: "You are a learning architect. Build a personalized learning path from the learner's current role to their target role: modules, sequence, durations, checkpoints.",
    fields: ["currentRole", "targetRole", "existingSkills", "hoursPerWeek"],
  },
  {
    slug: "assignment-build",
    title: "Draft: Assignment Builder",
    description: "Create a practical AI assignment.",
    prompt: "You are an instructional designer. Produce a hands-on practical AI assignment for the module: brief, deliverable, rubric, estimated effort.",
    fields: ["module", "skill", "learnerLevel", "context"],
  },
  {
    slug: "readiness-brief",
    title: "Draft: Readiness Assessment",
    description: "Assess job-transition readiness.",
    prompt: "Summarize reviewed assessments, assignments, mentor feedback and rubric results. Identify missing evidence. Do not invent a transition-readiness probability.",
    fields: ["learnerRole", "targetRole", "scores", "mentorFeedback"],
  },
];

export function findPage(href: string): PageConfig | undefined {
  return pages.find((p) => p.href === href);
}
