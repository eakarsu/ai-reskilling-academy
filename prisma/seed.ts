// Seed script — creates demo users and realistic domain records.
import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const phones = ["(415) 555-0132", "(212) 555-0187", "(312) 555-0149", "(617) 555-0110"];
const cities = ["Chicago, IL", "Austin, TX", "Boston, MA", "Denver, CO", "Seattle, WA"];

function pick<T>(arr: T[], i: number): T { return arr[i % arr.length]; }
function amount(i: number, base = 1000): number { return Math.round((base + ((i * 7919) % 900) * base) * 100) / 100; }
function daysAgo(i: number, spread = 180): Date { return new Date(Date.now() - ((i * 37) % spread) * 86400000); }

async function main() {
  const passwordHash = await bcrypt.hash("Demo!23456", 12);
  const demoUsers: Array<[string, string, Role]> = [
    ["admin@ai-reskilling-academy.local", "Demo Admin", "ADMIN"],
    ["manager@ai-reskilling-academy.local", "Demo Manager", "MANAGER"],
    ["analyst@ai-reskilling-academy.local", "Demo Analyst", "ANALYST"],
  ];
  for (const [email, name, role] of demoUsers) {
    await prisma.user.upsert({ where: { email }, update: {}, create: { email, name, role, passwordHash } });
  }

  const STATUSES_Cohort = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.cohort.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.cohort.create({
      data: {
      name: `Name ${String(i + 1).padStart(3, "0")}`,
      program: `Program ${String(i + 1).padStart(3, "0")}`,
      startDate: daysAgo(i),
      endDate: daysAgo(i),
      capacity: 5 + ((i * 13) % 95),
      status: pick(STATUSES_Cohort, i)
      },
    });
  }

  const cohortRefs = await prisma.cohort.findMany({ select: { id: true } });

  const STATUSES_Learner = ["ENROLLED", "ACTIVE", "READY", "PLACED"];
  await prisma.learner.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.learner.create({
      data: {
      name: `Name ${String(i + 1).padStart(3, "0")}`,
      email: `contact${i}@example.com`,
      currentRole: `CurrentRole ${String(i + 1).padStart(3, "0")}`,
      targetRole: `TargetRole ${String(i + 1).padStart(3, "0")}`,
      status: pick(STATUSES_Learner, i),
      enrolledAt: daysAgo(i),
      cohort: { connect: { id: cohortRefs[i % cohortRefs.length].id } }
      },
    });
  }

  const STATUSES_LearningPath = ["DRAFT", "ACTIVE", "COMPLETE", "PAUSED"];
  await prisma.learningPath.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.learningPath.create({
      data: {
      title: `Title ${String(i + 1).padStart(3, "0")}`,
      learnerRef: `LearnerRef ${String(i + 1).padStart(3, "0")}`,
      targetRole: `TargetRole ${String(i + 1).padStart(3, "0")}`,
      status: pick(STATUSES_LearningPath, i),
      moduleCount: 5 + ((i * 13) % 95),
      progressPct: amount(i, 250),
      cohort: { connect: { id: cohortRefs[i % cohortRefs.length].id } }
      },
    });
  }

  const STATUSES_Module = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.module.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.module.create({
      data: {
      title: `Title ${String(i + 1).padStart(3, "0")}`,
      skill: `Skill ${String(i + 1).padStart(3, "0")}`,
      sequenceOrder: 5 + ((i * 13) % 95),
      format: `Format ${String(i + 1).padStart(3, "0")}`,
      durationMinutes: 5 + ((i * 13) % 95),
      status: pick(STATUSES_Module, i),
      cohort: { connect: { id: cohortRefs[i % cohortRefs.length].id } }
      },
    });
  }

  const STATUSES_Assignment = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.assignment.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.assignment.create({
      data: {
      title: `Title ${String(i + 1).padStart(3, "0")}`,
      brief: `Brief ${String(i + 1).padStart(3, "0")}`,
      deliverable: `Deliverable ${String(i + 1).padStart(3, "0")}`,
      status: pick(STATUSES_Assignment, i),
      dueDate: daysAgo(i),
      moduleRef: `ModuleRef ${String(i + 1).padStart(3, "0")}`,
      cohort: { connect: { id: cohortRefs[i % cohortRefs.length].id } }
      },
    });
  }

  const STATUSES_AssessmentResult = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.assessmentResult.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.assessmentResult.create({
      data: {
      learnerRef: `LearnerRef ${String(i + 1).padStart(3, "0")}`,
      moduleRef: `ModuleRef ${String(i + 1).padStart(3, "0")}`,
      score: amount(i, 250),
      passScore: amount(i, 250),
      status: pick(STATUSES_AssessmentResult, i),
      takenAt: daysAgo(i),
      cohort: { connect: { id: cohortRefs[i % cohortRefs.length].id } }
      },
    });
  }

  const STATUSES_MentorReview = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.mentorReview.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.mentorReview.create({
      data: {
      mentor: `Mentor ${String(i + 1).padStart(3, "0")}`,
      learnerRef: `LearnerRef ${String(i + 1).padStart(3, "0")}`,
      submissionRef: `SubmissionRef ${String(i + 1).padStart(3, "0")}`,
      feedback: `Feedback ${String(i + 1).padStart(3, "0")}`,
      status: pick(STATUSES_MentorReview, i),
      reviewedAt: daysAgo(i),
      cohort: { connect: { id: cohortRefs[i % cohortRefs.length].id } }
      },
    });
  }

  const STATUSES_ReadinessScore = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.readinessScore.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.readinessScore.create({
      data: {
      learnerRef: `LearnerRef ${String(i + 1).padStart(3, "0")}`,
      targetRole: `TargetRole ${String(i + 1).padStart(3, "0")}`,
      score: amount(i, 250),
      evidence: `Evidence ${String(i + 1).padStart(3, "0")}`,
      status: pick(STATUSES_ReadinessScore, i),
      computedAt: daysAgo(i),
      cohort: { connect: { id: cohortRefs[i % cohortRefs.length].id } }
      },
    });
  }

  const STATUSES_Credential = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.credential.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.credential.create({
      data: {
      learnerRef: `LearnerRef ${String(i + 1).padStart(3, "0")}`,
      title: `Title ${String(i + 1).padStart(3, "0")}`,
      issuer: `Issuer ${String(i + 1).padStart(3, "0")}`,
      issuedAt: daysAgo(i),
      verificationUrl: `VerificationUrl ${String(i + 1).padStart(3, "0")}`,
      status: pick(STATUSES_Credential, i),
      cohort: { connect: { id: cohortRefs[i % cohortRefs.length].id } }
      },
    });
  }

  const STATUSES_PlacementOutcome = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.placementOutcome.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.placementOutcome.create({
      data: {
      learnerRef: `LearnerRef ${String(i + 1).padStart(3, "0")}`,
      employer: `Employer ${String(i + 1).padStart(3, "0")}`,
      placedRole: `PlacedRole ${String(i + 1).padStart(3, "0")}`,
      salary: amount(i, 250),
      status: pick(STATUSES_PlacementOutcome, i),
      placedAt: daysAgo(i),
      cohort: { connect: { id: cohortRefs[i % cohortRefs.length].id } }
      },
    });
  }

  const STATUSES_SkillBenchmark = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.skillBenchmark.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.skillBenchmark.create({
      data: {
      skill: `Skill ${String(i + 1).padStart(3, "0")}`,
      level: `Level ${String(i + 1).padStart(3, "0")}`,
      description: `Description ${String(i + 1).padStart(3, "0")}`,
      standardRef: `StandardRef ${String(i + 1).padStart(3, "0")}`,
      status: pick(STATUSES_SkillBenchmark, i),
      role: `Role ${String(i + 1).padStart(3, "0")}`,
      cohort: { connect: { id: cohortRefs[i % cohortRefs.length].id } }
      },
    });
  }

  const STATUSES_CoachingNote = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.coachingNote.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.coachingNote.create({
      data: {
      coach: `Coach ${String(i + 1).padStart(3, "0")}`,
      learnerRef: `LearnerRef ${String(i + 1).padStart(3, "0")}`,
      topic: `Topic ${String(i + 1).padStart(3, "0")}`,
      note: `Note ${String(i + 1).padStart(3, "0")}`,
      status: pick(STATUSES_CoachingNote, i),
      loggedAt: daysAgo(i),
      cohort: { connect: { id: cohortRefs[i % cohortRefs.length].id } }
      },
    });
  }

  await prisma.auditLog.create({ data: { actorName: "Seeder", action: "SEED", entity: "system", detail: "Demo dataset created" } });

  console.log("Seeded demo users and domain records.");
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });
