import { getRepository, Repository } from 'typeorm';
import { Game } from '../../../games/entities/Game';

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from '../../dtos';
import { User } from '../../entities/User';
import { IUsersRepository } from '../IUsersRepository';

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;
  private repositoryGames: Repository<Game>

  constructor() {
    this.repository = getRepository(User);
    this.repositoryGames = getRepository(Game);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User | undefined> {
    
    const user = await this.repository.findOne(user_id);

    let gamesAux = [];

    if (user) {

      const games = await this.repositoryGames.createQueryBuilder("games")
      .leftJoin("games.users", "users")
      .where("users.id = :id", {id: user_id})
      .getMany();

      gamesAux[0] = games[0]
      gamesAux[1] = games[2]
      gamesAux[2] = games[1]

      user.games = gamesAux
      
      return user;
    }
    
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    return await this.repository.query(`select * from users order by first_name asc`); // Complete usando raw query
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    return await this.repository.query(`select * from users where LOWER(first_name) = '${first_name.toLowerCase()}' and LOWER(last_name) = '${last_name.toLowerCase()}'`); // Complete usando raw query
  }
}
