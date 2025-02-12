import { JobColor } from "./job.types";

export interface Config {
  legendColor: LegendColor[];
}

export interface LegendColor {
  color: JobColor;
  mean: string;
}

export interface UserData {
  dataBasePath?: string;
}
