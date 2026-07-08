import { Model, Document } from "mongoose";

class BaseRepository<T extends Document> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async findById(id: string | string[]) {
    return this.model.findById(id);
  }

  async findByEmail(email: string) {
    return this.model.findOne({ email: email.toLowerCase().trim() });
  }

  async create(data: Partial<T>) {
    return this.model.create(data);
  }

  async findOne(filter: Record<string, any>) {
    return this.model.findOne(filter);
  }

  async find(filter: Record<string, any> = {}) {
    return this.model.find(filter);
  }

  async updateById(id: string | string[], data: Partial<T>) {
    return this.model.findByIdAndUpdate(id, data, {
      new: true,
    });
  }
  async deleteOne(id: string | string[]) {
    return this.model.deleteOne({ _id: id });
  }
  async deleteById(id: string | string[]) {
    return this.model.findByIdAndDelete(id);
  }
}

export default BaseRepository;
