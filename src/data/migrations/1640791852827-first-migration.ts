import {MigrationInterface, QueryRunner} from "typeorm";

export class firstMigration1640791852827 implements MigrationInterface {
    name = 'firstMigration1640791852827'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "employee" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "firstName" varchar NOT NULL, "lastName" varchar NOT NULL, "birthDate" integer NOT NULL, "hireDate" integer NOT NULL)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "employee"`);
    }

}
