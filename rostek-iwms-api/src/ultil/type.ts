export type UserData = {
  username: string;
  email: string;
};

export type FilterQuery = {
  limit: string | number;
  page: string | number;
  sort: string;
  populate?: string[];
  filter: any;
};
export type BundleCreate = {
  locationIds: string[];
  materials: string[];
  area: string;
  rackId: string;
};
