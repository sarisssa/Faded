import { IMeta } from "../entities/IMeta";
import { IPlayer } from "../entities/IPlayer";

export interface IGetPlayersResponse {
  data: IPlayer[];
  meta: IMeta;
}
