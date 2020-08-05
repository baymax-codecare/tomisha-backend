import { Injectable } from '@nestjs/common';
import { CompanyLocation } from './company-location.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindCompanyLocationsDto, CreateCompanyLocationDto, UpdateCompanyLocationDto } from './dto';

@Injectable()
export class CompanyLocationService {
  constructor(
    @InjectRepository(CompanyLocation)
    private companyLocationRepository: Repository<CompanyLocation>,
  ) {}

  public find(findCompanyLocationsDto: FindCompanyLocationsDto): Promise<CompanyLocation[]> {
    return this.companyLocationRepository.find(findCompanyLocationsDto);
  }

  public create(createCompanyLocationDto: CreateCompanyLocationDto): Promise<CompanyLocation> {
    const companyLocation = this.companyLocationRepository.create(createCompanyLocationDto);

    return this.companyLocationRepository.save(companyLocation);
  }

  public update(id: string, updateCompanyLocationDto: UpdateCompanyLocationDto): Promise<CompanyLocation> {
    const companyLocation = this.companyLocationRepository.create(updateCompanyLocationDto);
    companyLocation.id = id;

    return this.companyLocationRepository.save(companyLocation);
  }
}
