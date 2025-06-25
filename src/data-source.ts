import "reflect-metadata";
import { DataSource } from "typeorm";
import { Deal } from "./lib/entities/deals/Deal"; // Adjust the path as necessary
import { Territory } from "./lib/entities/territory/Territory";
import { Assignment } from "./lib/entities/assignment/Assignment";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "./database.sqlite",
  synchronize: true, // Automatically create database schema based on entities
  logging: false,
  entities: [Deal, Territory, Assignment],
  migrations: [],
  subscribers: [],
});

export async function initializeDataSource() {
  if (!AppDataSource.isInitialized) {
    try {
      await AppDataSource.initialize();
      console.log("Data Source has been initialized!");
    } catch (err) {
      console.error("Error during Data Source initialization:", err);
      throw err;
    }
  }
  return AppDataSource;
}
