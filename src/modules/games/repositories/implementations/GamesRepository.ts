import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;
  private repositoryUser: Repository<User>

  constructor() {
    this.repository = getRepository(Game);
    this.repositoryUser = getRepository(User);
  }

  

  async findByTitleContaining(param: string): Promise<Game[]> {
    return await this.repository.createQueryBuilder("games")
    .where("games.title ILIKE '%' || :param || '%'", { param: param })
    .getMany();
      // Complete usando query builder
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return this.repository.query("select count(*) from games"); // Complete usando raw query
  }

  async findUsersByGameId(id: string): Promise<User[]> {

    return await this.repositoryUser
      .createQueryBuilder("users")
      .leftJoin("users.games", "games")
      .where("games.id = :id", {id: id})
      .getMany()      
      // Complete usando query builder
  }
}
