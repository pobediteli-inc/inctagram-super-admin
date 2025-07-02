export type SortBy = "userName" | "createdAt";
export type PostByUser = {
  id: number;
  url: string;
  createdAt: Date;
  width: number;
  height: number;
  fileSize: number;
};
