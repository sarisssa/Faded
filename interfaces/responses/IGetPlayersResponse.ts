import { IMeta } from "../entities/IMeta";
import { IPlayer } from "../entities/IPlayer";

export interface IGetPlayerResponse extends IPlayer {}

export interface IGetPlayersResponse {
  data: IPlayer[];
  meta: IMeta;
}
