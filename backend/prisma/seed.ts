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
        testType: "Performance",
        experimentType: "Load Test",
        notificationEmails: ["test@example.com"]
      }
    }),
    prisma.task.create({
      data: {
        name: "Sample Test 2",
        status: "Executed",
        scheduleType: "recurring",
        scheduleValue: "0 0 * * *",
        testType: "Integration",
        experimentType: "API Test",
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