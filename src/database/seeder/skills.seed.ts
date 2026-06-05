// import { DataSource } from 'typeorm';
// import { Skill, SkillCategory } from '../entities';

// export async function seedSkills(dataSource: DataSource) {
//   const repo = dataSource.getRepository(Skill);
//   const count = await repo.count();
//   if (count > 0) return;

//   await repo.save([
//     { name: 'TypeScript', category: SkillCategory.ENGINEERING },
//     { name: 'Ssystem Design', category: SkillCategory.ENGINEERING },
//     { name: 'NestJS', category: SkillCategory.ENGINEERING },
//     { name: 'React', category: SkillCategory.ENGINEERING },
//     { name: 'PostgreSQL', category: SkillCategory.DATA },
//     { name: 'Product Strategy', category: SkillCategory.PRODUCT },
//     { name: 'UI/UX Design', category: SkillCategory.DESIGN },
//     { name: 'Leadership', category: SkillCategory.LEADERSHIP },
//   ]);
// }
