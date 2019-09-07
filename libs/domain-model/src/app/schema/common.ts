export interface File {
  isDoc?: boolean,
  isPhoto?: boolean,
  name: string,
  data: any,
}

export interface Group {
  name: string,
  subgroupNumber: number,
}
