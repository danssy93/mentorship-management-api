import { Helpers } from 'src/common/utils/helper.utils';
import { SKILL } from '../DBTableNames';
import dbConn from './db.config';
import { Logger } from '@nestjs/common';

const seedUp = async () => {
  const logger = new Logger('Seeder');

  try {
    console.log('🚀 Seeder starting...');

    // 1. Check DB connection
    await dbConn.getConnection();
    console.log('✅ Database connection successful');

    // 2. Load mock data
    const skill = await Helpers.fetchMockfile(
      'src/database/seeder/data',
      'skill',
    );
    console.log('📂 Skills loaded:', skill);
    console.log(`📦 Loaded ${skill.length} skill record(s) from file`);

    if (!skill.length) {
      console.log('⚠️ No data found in seed file. Exiting...');
      process.exit(0);
    }

    // 3. Clear table
    await dbConn.query(`SET FOREIGN_KEY_CHECKS = 0`);
    await dbConn.query(`TRUNCATE TABLE ${SKILL}`);

    // 👇 re-enable foreign key checks after
    await dbConn.query(`SET FOREIGN_KEY_CHECKS = 1`);
    console.log(`🧹 Tables truncated successfully`);

    // 4. Insert data
    for (const datum of skill) {
      await dbConn.query(
        ` INSERT INTO ${SKILL} 
           (id, name, category)
           VALUES (UUID(),?,?)`,
        [datum.name, datum.category],
      );
    }

    console.log('🎉 Seeder completed successfully');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeder failed:', error);
    logger.error(error);

    process.exit(1);
  }
};

if (process.argv[2] === 'seed-up') {
  seedUp().then(() => console.log('🏁 Seeder process finished'));
}
