import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Occupation } from './occupation.entity';
import { CreateOccupationDto } from './dto';
import { AuthUser } from 'src/auth/type/auth-user.interface';

@Injectable()
export class OccupationService {
  constructor(
    @InjectRepository(Occupation)
    private occupationRepository: Repository<Occupation>,
  ) {}

  public findMyOccupations(authUser: AuthUser): Promise<Occupation[]> {
    return this.occupationRepository.find({
      userId: authUser.id,
    });
  }

  public findOne(slug: string): Promise<Occupation> {
    return this.occupationRepository.findOneOrFail({
      where: { slug },
      relations: [
        'preferences',
        'skills',
        'experiences',
        'experiences.company',
        'experiences.company.locations',
      ],
    });
  }

  public create(createOccupationDto: CreateOccupationDto, authUser: AuthUser): Promise<Occupation> {
    const occupation = this.occupationRepository.create(createOccupationDto);
    occupation.userId = authUser.id;

    return this.occupationRepository.save(occupation);
  }
}
