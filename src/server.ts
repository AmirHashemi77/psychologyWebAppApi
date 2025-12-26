import dotenv from "dotenv";
dotenv.config();

import { createApp } from "./app";
import { ensureDevAdminSeeded } from "./services/adminService";
import { prisma } from "./services/prisma";

const port = Number(process.env.PORT ?? 3000);

async function main() {
  await prisma.$connect();
  // eslint-disable-next-line no-console
  console.log("Prisma connected");

  const seed = await ensureDevAdminSeeded();
  if (process.env.NODE_ENV !== "production" && seed) {
    // eslint-disable-next-line no-console
    const prefix =
      seed.action === "created"
        ? "Admin seeded"
        : seed.action === "updated"
          ? "Admin updated"
          : "Admin exists";
    // eslint-disable-next-line no-console
    console.log(`${prefix}: ${seed.email} / ${seed.password}`);
  }

  const app = createApp();
  const server = app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running on port ${port}`);
  });

  const shutdown = () => {
    server.close(async () => {
      await prisma.$disconnect();
      process.exit(0);
    });
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
