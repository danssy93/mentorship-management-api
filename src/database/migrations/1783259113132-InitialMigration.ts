import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1783259113132 implements MigrationInterface {
    name = 'InitialMigration1783259113132'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`mentor_profiles\` (\`id\` varchar(36) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`bio\` varchar(255) NULL, \`years_of_experience\` int NOT NULL DEFAULT '0', \`session_rate\` decimal(10,2) NOT NULL DEFAULT '0.00', \`hourly_rate\` decimal(10,2) NULL, \`is_accepting_mentees\` tinyint NOT NULL DEFAULT 1, \`userId\` varchar(36) NULL, UNIQUE INDEX \`REL_675b619fc709251e28caee6a7f\` (\`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`skills\` (\`id\` varchar(36) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(255) NOT NULL, \`category\` enum ('engineering', 'design', 'product', 'data', 'marketing', 'leadership', 'finance', 'other') NOT NULL DEFAULT 'other', \`description\` varchar(255) NULL, \`is_active\` tinyint NOT NULL DEFAULT 1, UNIQUE INDEX \`IDX_81f05095507fd84aa2769b4a52\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`mentee_profiles\` (\`id\` varchar(36) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`bio\` varchar(255) NULL, \`learning_goals\` text NULL, \`current_level\` enum ('beginner', 'intermediate', 'advance') NULL, \`occupation\` varchar(255) NULL, \`is_looking_for_mentor\` tinyint NOT NULL DEFAULT 1, \`userId\` varchar(36) NULL, UNIQUE INDEX \`REL_26e81c5d35ed625f75d4f0ac39\` (\`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` varchar(36) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`first_name\` varchar(100) NOT NULL, \`last_name\` varchar(100) NOT NULL, \`phone\` varchar(20) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(225) NULL, \`refresh_token\` text NULL, \`role\` enum ('admin', 'mentor', 'mentee') NOT NULL, \`is_active\` tinyint NOT NULL DEFAULT 1, UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`match_request\` (\`id\` varchar(36) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`status\` enum ('pending', 'accepted', 'rejected', 'cancelled') NOT NULL DEFAULT 'pending', \`message\` text NULL, \`rejection_reason\` text NULL, \`menteeId\` varchar(36) NULL, \`mentorId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`session\` (\`id\` varchar(36) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`title\` varchar(255) NOT NULL, \`description\` varchar(255) NULL, \`scheduled_at\` datetime NOT NULL, \`duration\` int NOT NULL, \`meeting_link\` varchar(255) NULL, \`status\` enum ('scheduled', 'ongoing', 'completed', 'cancelled') NOT NULL DEFAULT 'scheduled', \`cancellation_reason\` text NULL, \`mentorId\` varchar(36) NULL, \`menteeId\` varchar(36) NULL, \`matchRequestId\` varchar(36) NULL, \`cancelledById\` varchar(36) NULL, UNIQUE INDEX \`REL_b57aaee45c0bc60d82730059ad\` (\`matchRequestId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`progress\` (\`id\` varchar(36) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`title\` varchar(255) NOT NULL, \`description\` varchar(255) NULL, \`target_date\` datetime NULL, \`status\` enum ('not_started', 'in_progress', 'completed', 'abandoned') NOT NULL DEFAULT 'not_started', \`progress_percentage\` tinyint UNSIGNED NOT NULL DEFAULT '0', \`menteeId\` varchar(36) NOT NULL, \`mentorId\` varchar(36) NULL, \`matchRequestId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`notification\` (\`id\` varchar(36) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`title\` varchar(255) NOT NULL, \`message\` text NOT NULL, \`type\` enum ('match_request', 'match_accepted', 'session_scheduled', 'session_cancelled', 'feedback_received', 'session_completed', 'goal_completed') NOT NULL, \`is_read\` tinyint NOT NULL DEFAULT 0, \`metadata\` json NULL, \`userId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`feedback\` (\`id\` varchar(36) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`rating\` tinyint UNSIGNED NOT NULL, \`comment\` varchar(255) NULL, \`role\` enum ('mentor_to_mentee', 'mentee_to_mentor') NOT NULL, \`sessionId\` varchar(36) NULL, \`reviewerId\` varchar(36) NULL, \`revieweeId\` varchar(36) NULL, UNIQUE INDEX \`REL_f1f85e7ceeea8bb5658be8ff0a\` (\`sessionId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`mentor_profile_skills\` (\`mentorProfilesId\` varchar(36) NOT NULL, \`skillsId\` varchar(36) NOT NULL, INDEX \`IDX_d9f2839f047fb354054f753c0d\` (\`mentorProfilesId\`), INDEX \`IDX_04fdf923fc89d0fa63db86ece2\` (\`skillsId\`), PRIMARY KEY (\`mentorProfilesId\`, \`skillsId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`mentee_profile_skills\` (\`menteeProfilesId\` varchar(36) NOT NULL, \`skillsId\` varchar(36) NOT NULL, INDEX \`IDX_266ba0f30130e674b46103c317\` (\`menteeProfilesId\`), INDEX \`IDX_36bd08cea95c78806a9ed1a195\` (\`skillsId\`), PRIMARY KEY (\`menteeProfilesId\`, \`skillsId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`mentor_profiles\` ADD CONSTRAINT \`FK_675b619fc709251e28caee6a7f7\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`mentee_profiles\` ADD CONSTRAINT \`FK_26e81c5d35ed625f75d4f0ac39d\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`match_request\` ADD CONSTRAINT \`FK_b372881820c00566d28ea2ddb6c\` FOREIGN KEY (\`menteeId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`match_request\` ADD CONSTRAINT \`FK_46cb96234d06839062ee4a1d72f\` FOREIGN KEY (\`mentorId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`session\` ADD CONSTRAINT \`FK_e1e4ab9fb8fb43d5b879db43686\` FOREIGN KEY (\`mentorId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`session\` ADD CONSTRAINT \`FK_6a78f772730cdab83cb0d820596\` FOREIGN KEY (\`menteeId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`session\` ADD CONSTRAINT \`FK_b57aaee45c0bc60d82730059ad2\` FOREIGN KEY (\`matchRequestId\`) REFERENCES \`match_request\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`session\` ADD CONSTRAINT \`FK_cc3cfdb11587b90a8d977e8dc06\` FOREIGN KEY (\`cancelledById\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`progress\` ADD CONSTRAINT \`FK_fcc51efd4b86fa8df1d964263fe\` FOREIGN KEY (\`menteeId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`progress\` ADD CONSTRAINT \`FK_f1ce7d8283fda1675711ebc7770\` FOREIGN KEY (\`mentorId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`progress\` ADD CONSTRAINT \`FK_2d16499aff640126ac800436e4f\` FOREIGN KEY (\`matchRequestId\`) REFERENCES \`match_request\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`notification\` ADD CONSTRAINT \`FK_1ced25315eb974b73391fb1c81b\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`feedback\` ADD CONSTRAINT \`FK_f1f85e7ceeea8bb5658be8ff0ac\` FOREIGN KEY (\`sessionId\`) REFERENCES \`session\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`feedback\` ADD CONSTRAINT \`FK_86da0bc0ecaa123fb5b56a58588\` FOREIGN KEY (\`reviewerId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`feedback\` ADD CONSTRAINT \`FK_41885228cdba7016b5b4a618975\` FOREIGN KEY (\`revieweeId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`mentor_profile_skills\` ADD CONSTRAINT \`FK_d9f2839f047fb354054f753c0d3\` FOREIGN KEY (\`mentorProfilesId\`) REFERENCES \`mentor_profiles\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`mentor_profile_skills\` ADD CONSTRAINT \`FK_04fdf923fc89d0fa63db86ece25\` FOREIGN KEY (\`skillsId\`) REFERENCES \`skills\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`mentee_profile_skills\` ADD CONSTRAINT \`FK_266ba0f30130e674b46103c3170\` FOREIGN KEY (\`menteeProfilesId\`) REFERENCES \`mentee_profiles\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`mentee_profile_skills\` ADD CONSTRAINT \`FK_36bd08cea95c78806a9ed1a1951\` FOREIGN KEY (\`skillsId\`) REFERENCES \`skills\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`mentee_profile_skills\` DROP FOREIGN KEY \`FK_36bd08cea95c78806a9ed1a1951\``);
        await queryRunner.query(`ALTER TABLE \`mentee_profile_skills\` DROP FOREIGN KEY \`FK_266ba0f30130e674b46103c3170\``);
        await queryRunner.query(`ALTER TABLE \`mentor_profile_skills\` DROP FOREIGN KEY \`FK_04fdf923fc89d0fa63db86ece25\``);
        await queryRunner.query(`ALTER TABLE \`mentor_profile_skills\` DROP FOREIGN KEY \`FK_d9f2839f047fb354054f753c0d3\``);
        await queryRunner.query(`ALTER TABLE \`feedback\` DROP FOREIGN KEY \`FK_41885228cdba7016b5b4a618975\``);
        await queryRunner.query(`ALTER TABLE \`feedback\` DROP FOREIGN KEY \`FK_86da0bc0ecaa123fb5b56a58588\``);
        await queryRunner.query(`ALTER TABLE \`feedback\` DROP FOREIGN KEY \`FK_f1f85e7ceeea8bb5658be8ff0ac\``);
        await queryRunner.query(`ALTER TABLE \`notification\` DROP FOREIGN KEY \`FK_1ced25315eb974b73391fb1c81b\``);
        await queryRunner.query(`ALTER TABLE \`progress\` DROP FOREIGN KEY \`FK_2d16499aff640126ac800436e4f\``);
        await queryRunner.query(`ALTER TABLE \`progress\` DROP FOREIGN KEY \`FK_f1ce7d8283fda1675711ebc7770\``);
        await queryRunner.query(`ALTER TABLE \`progress\` DROP FOREIGN KEY \`FK_fcc51efd4b86fa8df1d964263fe\``);
        await queryRunner.query(`ALTER TABLE \`session\` DROP FOREIGN KEY \`FK_cc3cfdb11587b90a8d977e8dc06\``);
        await queryRunner.query(`ALTER TABLE \`session\` DROP FOREIGN KEY \`FK_b57aaee45c0bc60d82730059ad2\``);
        await queryRunner.query(`ALTER TABLE \`session\` DROP FOREIGN KEY \`FK_6a78f772730cdab83cb0d820596\``);
        await queryRunner.query(`ALTER TABLE \`session\` DROP FOREIGN KEY \`FK_e1e4ab9fb8fb43d5b879db43686\``);
        await queryRunner.query(`ALTER TABLE \`match_request\` DROP FOREIGN KEY \`FK_46cb96234d06839062ee4a1d72f\``);
        await queryRunner.query(`ALTER TABLE \`match_request\` DROP FOREIGN KEY \`FK_b372881820c00566d28ea2ddb6c\``);
        await queryRunner.query(`ALTER TABLE \`mentee_profiles\` DROP FOREIGN KEY \`FK_26e81c5d35ed625f75d4f0ac39d\``);
        await queryRunner.query(`ALTER TABLE \`mentor_profiles\` DROP FOREIGN KEY \`FK_675b619fc709251e28caee6a7f7\``);
        await queryRunner.query(`DROP INDEX \`IDX_36bd08cea95c78806a9ed1a195\` ON \`mentee_profile_skills\``);
        await queryRunner.query(`DROP INDEX \`IDX_266ba0f30130e674b46103c317\` ON \`mentee_profile_skills\``);
        await queryRunner.query(`DROP TABLE \`mentee_profile_skills\``);
        await queryRunner.query(`DROP INDEX \`IDX_04fdf923fc89d0fa63db86ece2\` ON \`mentor_profile_skills\``);
        await queryRunner.query(`DROP INDEX \`IDX_d9f2839f047fb354054f753c0d\` ON \`mentor_profile_skills\``);
        await queryRunner.query(`DROP TABLE \`mentor_profile_skills\``);
        await queryRunner.query(`DROP INDEX \`REL_f1f85e7ceeea8bb5658be8ff0a\` ON \`feedback\``);
        await queryRunner.query(`DROP TABLE \`feedback\``);
        await queryRunner.query(`DROP TABLE \`notification\``);
        await queryRunner.query(`DROP TABLE \`progress\``);
        await queryRunner.query(`DROP INDEX \`REL_b57aaee45c0bc60d82730059ad\` ON \`session\``);
        await queryRunner.query(`DROP TABLE \`session\``);
        await queryRunner.query(`DROP TABLE \`match_request\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP INDEX \`REL_26e81c5d35ed625f75d4f0ac39\` ON \`mentee_profiles\``);
        await queryRunner.query(`DROP TABLE \`mentee_profiles\``);
        await queryRunner.query(`DROP INDEX \`IDX_81f05095507fd84aa2769b4a52\` ON \`skills\``);
        await queryRunner.query(`DROP TABLE \`skills\``);
        await queryRunner.query(`DROP INDEX \`REL_675b619fc709251e28caee6a7f\` ON \`mentor_profiles\``);
        await queryRunner.query(`DROP TABLE \`mentor_profiles\``);
    }

}
