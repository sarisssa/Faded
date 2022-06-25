import { ITeam } from "./ITeam";

export interface IPlayer {
  id: number;
  first_name: string;
  height_feet?: number;
  height_inches?: number;
  last_name: string;
  position: string;
  team?: ITeam;
  weight_pounds?: number;
}
