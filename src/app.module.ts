import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { PhotoEntity } from './entities/photo.entity';
import { PositionsModule } from './positions/position.module';
import { Position } from './positions/position.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'password',
      database: 'orga_structure',
      entities: [UserEntity, PhotoEntity, Position],
      synchronize: true,
    }),
    PositionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {
console.log(dataSource.toString())

  }

}
