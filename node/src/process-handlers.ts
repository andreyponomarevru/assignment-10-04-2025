import util from "util";
import { prisma } from "./config/db";
import { type PrismaClient } from "@prisma/client";

export function onWarning(err: Error) {
  console.warn(err.stack);
}

export function onUncaughtException(err: Error) {
  console.error(`uncaughtException: ${err.message} \n${err.stack}`);
  prisma.$disconnect();
  process.exit(1);
}

export function onUnhandledRejection(reason: string, p: Promise<Error>) {
  console.error(`UnhandledRejection: ${util.inspect(p)}, reason "${reason}"`);
}

export function handleSIGINT(prisma: PrismaClient) {
  prisma.$disconnect();
  process.exit(0);
}
