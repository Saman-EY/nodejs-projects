import { EntityNames } from "src/common/enums/entity.enum";
import { Roles, UserStatus } from "src/common/enums/otherEnums.enum";
import { UserEntity } from "src/modules/user/entities/user.entity";
import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from "typeorm";

// *** NOTE: each changes in migration MUST MATCH with the changes in entities of tables ***

export class MigrationLorem implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: EntityNames.User,
        columns: [
          { name: "id", type: "serial", isPrimary: true, isNullable: false },
          { name: "username", type: "charecter varying(50)", isNullable: true, isUnique: true },
          { name: "phone", type: "charecter varying(12)", isNullable: true, isUnique: true },
          { name: "email", type: "charecter varying(100)", isNullable: true, isUnique: true },
          { name: "profileId", type: "int", isNullable: true, isUnique: true },
          { name: "role", type: "enum", enum: [Roles.Admin, Roles.User] },
          { name: "status", type: "enum", enum: [UserStatus.Ban, UserStatus.Report], isNullable: true },
          { name: "new_email", type: "varchar", isNullable: true },
          { name: "new_phone", type: "varchar", isNullable: true },
          { name: "verify_phone", type: "boolean", isNullable: true, default: false },
          { name: "verify_email", type: "boolean", isNullable: true, default: false },
          { name: "password", type: "varchar(20)", isNullable: true },
          { name: "created_at", type: "timestamp", default: "now()" },
        ],
      }),
      true,
    );

    const balance = await queryRunner.hasColumn(EntityNames.User, "balanec");
    if (!balance)
      // @ts-ignore
      await queryRunner.addColumn(EntityNames.User, {
        name: "balance",
        type: "numberic",
        default: 0,
        isNullable: true,
      });

    // set username field nullable to FALSE
    const username = await queryRunner.hasColumn(EntityNames.User, "username");
    if (username) {
      await queryRunner.changeColumn(
        EntityNames.User,
        "username",
        new TableColumn({
          name: "username",
          type: "varchar(50)",
          isNullable: false,
          isUnique: true,
        }),
      );
    }

    // sql query usage: change field name
    await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "phone" TO "mobile"`);

    await queryRunner.createTable(
      new Table({
        name: EntityNames.Profile,
        columns: [
          { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
          { name: "userId", type: "int", isNullable: false, isUnique: true },
          { name: "nick_name", type: "varchar(50)", isNullable: true },
          { name: "bio", type: "varchar", isNullable: true },
          { name: "image_profile", type: "varchar", isNullable: true },
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: EntityNames.Blog,
        columns: [
          { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
          { name: "title", type: "varchar(150)", isNullable: false },
          { name: "content", type: "text", isNullable: false },
          { name: "userId", type: "int", isNullable: false },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      EntityNames.User,
      new TableForeignKey({
        columnNames: ["profileId"],
        referencedColumnNames: ["id"],
        referencedTableName: EntityNames.Profile,
      }),
    );
    await queryRunner.createForeignKey(
      EntityNames.Profile,
      new TableForeignKey({
        columnNames: ["userId"],
        referencedColumnNames: ["id"],
        referencedTableName: EntityNames.User,
        onDelete: "CASCADE",
      }),
    );

    await queryRunner.createForeignKey(
      EntityNames.Blog,
      new TableForeignKey({
        columnNames: ["userId"],
        referencedColumnNames: ["id"],
        referencedTableName: EntityNames.User,
        onDelete: "CASCADE",
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // const userTable = await queryRunner.hasTable(EntityNames.User);
    // if (userTable) await queryRunner.dropTable(EntityNames.User);

    // OR :
    // await queryRunner.dropTable(EntityNames.User, true);

    // drop column
    // await queryRunner.dropColumn(EntityNames.User, "balance");

    // remove FKs too
    const profile = await queryRunner.getTable(EntityNames.Profile);
    if (profile) {
      const userFK = profile.foreignKeys.find((fk) => fk.columnNames.indexOf("userId") !== -1);
      if (userFK) await queryRunner.dropForeignKey(EntityNames.Profile, userFK);
    }
    const user = await queryRunner.getTable(EntityNames.User);
    if (user) {
      const profileFk = user.foreignKeys.find((fk) => fk.columnNames.indexOf("profileId") !== -1);
      if (profileFk) await queryRunner.dropForeignKey(EntityNames.User, profileFk);
    }

    const blog = await queryRunner.getTable(EntityNames.Blog);
    if (blog) {
      const userBlogFK = blog.foreignKeys.find((fk) => fk.columnNames.indexOf("userId") !== -1);
      if (userBlogFK) await queryRunner.dropForeignKey(EntityNames.Blog, userBlogFK);
    }
    await queryRunner.dropTable(EntityNames.User, true);
    await queryRunner.dropTable(EntityNames.Profile, true);
    await queryRunner.dropTable(EntityNames.Blog, true);
  }
}
