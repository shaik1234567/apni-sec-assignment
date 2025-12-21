import { IssueModel } from '../models/IssueModel';
import { IIssue, CreateIssueRequest, UpdateIssueRequest } from '@/types/issue';
import { connectDB } from '@/lib/mongodb';

export class IssueRepository {
  public async create(issueData: CreateIssueRequest & { userId: string }): Promise<any> {
    await connectDB();
    const issue = new IssueModel(issueData);
    return issue.save();
  }

  public async findById(id: string): Promise<any> {
    await connectDB();
    return IssueModel.findById(id).lean();
  }

  public async findByUserId(userId: string, page: number = 1, limit: number = 10): Promise<{ issues: any[]; total: number }> {
    await connectDB();
    const skip = (page - 1) * limit;
    
    const [issues, total] = await Promise.all([
      IssueModel.find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      IssueModel.countDocuments({ userId })
    ]);

    return { issues, total };
  }

  public async findAll(page: number = 1, limit: number = 10): Promise<{ issues: any[]; total: number }> {
    await connectDB();
    const skip = (page - 1) * limit;
    
    const [issues, total] = await Promise.all([
      IssueModel.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      IssueModel.countDocuments()
    ]);

    return { issues, total };
  }

  public async updateById(id: string, updateData: UpdateIssueRequest): Promise<any> {
    await connectDB();
    return IssueModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).lean();
  }

  public async deleteById(id: string): Promise<boolean> {
    await connectDB();
    const result = await IssueModel.findByIdAndDelete(id);
    return !!result;
  }

  public async findByIdAndUserId(id: string, userId: string): Promise<any> {
    await connectDB();
    return IssueModel.findOne({ _id: id, userId }).lean();
  }
}