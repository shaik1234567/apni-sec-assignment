import { UserModel } from '../models/UserModel';
import { IUser, UpdateProfileRequest } from '@/types/user';
import { connectDB } from '@/lib/mongodb';

export class UserRepository {
  public async create(userData: Partial<IUser>): Promise<any> {
    await connectDB();
    const user = new UserModel(userData);
    return user.save();
  }

  public async findByEmail(email: string): Promise<any> {
    await connectDB();
    return UserModel.findOne({ email }).lean();
  }

  public async findById(id: string): Promise<any> {
    await connectDB();
    return UserModel.findById(id).lean();
  }

  public async updateById(id: string, updateData: UpdateProfileRequest): Promise<any> {
    await connectDB();
    return UserModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).lean();
  }

  public async deleteById(id: string): Promise<boolean> {
    await connectDB();
    const result = await UserModel.findByIdAndDelete(id);
    return !!result;
  }

  public async existsByEmail(email: string): Promise<boolean> {
    await connectDB();
    const count = await UserModel.countDocuments({ email });
    return count > 0;
  }
}