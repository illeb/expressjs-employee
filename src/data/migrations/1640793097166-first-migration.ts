import { MigrationInterface, QueryRunner, getCustomRepository } from "typeorm";
import { Employee, EmployeeRepository } from "..";

export class firstMigration1640793097166 implements MigrationInterface {
  name = 'firstMigration1640793097166'
  
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "employee" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "firstName" varchar NOT NULL, "lastName" varchar NOT NULL, "birthDate" datetime, "hireDate" datetime)`);
  }
  
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "employee"`);
  }
}
