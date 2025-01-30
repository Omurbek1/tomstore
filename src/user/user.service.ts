import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async onModuleInit() {
    await this.createDefaultAdmin();
  }

  async createDefaultAdmin() {
    const adminExists = await this.userRepository.findOne({
      where: { email: 'admin@example.com' },
    });

    if (!adminExists) {
      const admin = new User();
      admin.email = 'admin@example.com';
      admin.password = await bcrypt.hash('admin123', 10); // Default password
      admin.role = 'admin';

      await this.userRepository.save(admin);
      console.log('✅ Default admin created: admin@example.com / admin123');
    }
  }
}
