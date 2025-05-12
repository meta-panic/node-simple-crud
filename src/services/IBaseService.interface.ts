export interface IBaseService<T extends { id: number | string }> {
  findAll(): Promise<T[]>;
  findById(id: number | string): Promise<T>;
  create(data: Omit<T, "id">): Promise<T>;
  replace(id: number | string, data: Omit<T, "id">): Promise<T | undefined>;
  delete(id: number | string): Promise<void>;
}
