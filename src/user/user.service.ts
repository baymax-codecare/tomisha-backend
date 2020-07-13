import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository, FindOneOptions } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  public findOne(opts: FindOneOptions<User>): Promise<User> {
    return this.userRepository.findOne(opts);
  }

  public update(id: any, updateUserDto: any): Promise<User> {
    const user = this.userRepository.create(updateUserDto as User);
    user.id = id;

    return this.userRepository.save(user);
  }

  public create(createUserDto: any): Promise<User> {
    const user = this.userRepository.create(createUserDto as User);

    return this.userRepository.save(user);
  }
}
