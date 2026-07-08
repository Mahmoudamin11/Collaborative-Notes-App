import mongoose, { Document, Schema, Model } from "mongoose";
import bcrypt from "bcryptjs";

import type { IAccount } from "@shared/types/user";
import type { IUser } from "@shared/types/user";

export interface IUserDocument
  extends
    Omit<
      IUser,
      "_id" | "createdAt" | "updatedAt" | "noteIds" | "sharedNoteIds"
    >,
    Document {
  id: string;
  password?: string;
  accounts: IAccount[];
  __v?: number;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

/**
 * What the User Model class looks like — includes our custom static methods.
 */
export interface IUserModel extends Model<IUserDocument> {
  findByEmail(
    email: string,
    includePassword?: boolean,
  ): Promise<IUserDocument | null>;
}

interface IAccountDocument extends IAccount {
  access_token?: string;
  refresh_token?: string;
  id_token?: string;
  expires_at?: number;
  token_type?: string;
  scope?: string;
}

const AccountSchema = new Schema<IAccountDocument>(
  {
    provider: { type: String, required: true },
    providerAccountId: { type: String, required: true },
    type: {
      type: String,
      enum: ["oauth", "email", "credentials"],
      required: true,
    },
    access_token: { type: String, select: false },
    refresh_token: { type: String, select: false },
    id_token: { type: String, select: false },
    expires_at: { type: Number },
    token_type: { type: String },
    scope: { type: String },
  },
  { _id: false },
);

type UserResponse = Partial<IUserDocument> & {
  _id?: mongoose.Types.ObjectId;
  id?: string;
};

const UserSchema = new Schema<IUserDocument, IUserModel>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    emailVerified: { type: Date, default: null },
    image: { type: String, default: null },
    password: { type: String, select: false },
    accounts: { type: [AccountSchema], default: [] },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(_doc, ret: UserResponse) {
        ret.id = ret._id!.toString();

        delete ret._id;
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
    toObject: { virtuals: true },
  },
);

UserSchema.index(
  { "accounts.provider": 1, "accounts.providerAccountId": 1 },
  { sparse: true }, // means add index for DOCs that have these props with true value not 'NULL'
);

UserSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) {
    return;
  }

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    throw error;
  }
});

UserSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

UserSchema.statics.findByEmail = async function (
  email: string,
  includePassword: boolean = false,
): Promise<IUserDocument | null> {
  const query = this.findOne({ email: email.toLowerCase().trim() });

  if (includePassword) {
    query.select("+password"); // Tells mongoose to override 'select: false'
  }

  return await query;
};

UserSchema.virtual("notes", {
  ref: "Note",
  localField: "_id",
  foreignField: "owner",
});

const User =
  (mongoose.models.User as IUserModel) ||
  mongoose.model<IUserDocument, IUserModel>("User", UserSchema);

export default User;
