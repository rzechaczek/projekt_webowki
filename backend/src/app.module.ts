import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'cookbook.db',
      entities: [User],
      synchronize: true,
      logging: false,
    }),
    UsersModule,
  ],
})
export class AppModule {}