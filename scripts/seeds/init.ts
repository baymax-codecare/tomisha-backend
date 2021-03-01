import { MigrationInterface, getConnectionManager } from 'typeorm';

import { Tag } from 'src/tag/tag.entity';
import { TagType } from 'src/tag/type/tag-type.enum';

const hobbies = require('./data/hobbies.json');
const hardSkills = require('./data/hard-skills.json');
const professions = require('./data/professions.json');

export class Init1613273718350 implements MigrationInterface {
  public async up(): Promise<void> {
      const manager = getConnectionManager().get('seed').createEntityManager();

      const tags = hobbies
        .map((title) => ({ type: TagType.HOBBY, title }))
        .concat(hardSkills.map((title) => ({ type: TagType.HARD_SKILL, title })))
        .concat(professions.map((title) => ({ type: TagType.PROFESSION, title })))

      await manager.save(manager.create(Tag, tags));
  }

  public async down(): Promise<void> {
      const manager = getConnectionManager().get('seed').createEntityManager();

      await manager.clear(Tag);
  }
}
