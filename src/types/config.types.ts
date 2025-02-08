import { JobColor } from "./job.types";

export interface Config {
  legendColor: LegendColor[];
}

export interface LegendColor {
  color: JobColor;
  mean: string;
}
