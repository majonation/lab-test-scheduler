import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.task.deleteMany();

  // Create sample tasks
  const tasks = await Promise.all([
    prisma.task.create({
      data: {
        name: "Sample Test 1",
        status: "Scheduled",
        scheduleType: "oneTime",
        scheduleValue: "2024-03-01T10:00:00Z",
        testType: 1,
        experimentType: 1,
        notificationEmails: ["test@example.com"]
      }
    }),
    prisma.task.create({
      data: {
        name: "Sample Test 2",
        status: "Scheduled",
        scheduleType: "recurring",
        scheduleValue: "0 0 * * *",
        testType: 2,
        experimentType: 2,
        notificationEmails: ["dev@example.com", "qa@example.com"]
      }
    })
  ]);

  console.log(`Created ${tasks.length} sample tasks`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });