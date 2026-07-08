import { CollaboratorRole, collaboratorRoles } from "@/validators/note.schema";
import mongoose, { Document, Model, Schema } from "mongoose";

export interface ICollaborator {
  id: mongoose.Types.ObjectId;
  role: CollaboratorRole;
}

export interface INote {
  title: string;
  content: string;
  owner: mongoose.Types.ObjectId;
  collaborators: ICollaborator[];
  createdAt: Date;
  updatedAt: Date;
}
export interface INoteMethods {
  isOwner(userId: string): boolean;
  isCollaborator(userId: string): boolean;
  canEdit(userId: string): boolean;
}
export interface INoteDocument
  extends Omit<INote, "createdAt" | "updatedAt">, Document, INoteMethods {
  __v?: number;
}

export interface INoteModel extends Model<INoteDocument> {}

const CollaboratorSchema = new Schema<ICollaborator>(
  {
    id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: collaboratorRoles,
      required: true,
      default: "viewer",
    },
  },
  {
    _id: false,
  },
);

type NoteResponse = Partial<INoteDocument> & {
  _id?: mongoose.Types.ObjectId;
  id?: string;
};

const NoteSchema = new Schema<INoteDocument, INoteModel>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    content: {
      type: String,
      default: "",
      trim: true,
    },

    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    collaborators: {
      type: [CollaboratorSchema],
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(_doc, ret: NoteResponse) {
        ret.id = ret._id!.toString();

        delete ret._id;
        delete ret.__v;

        return ret;
      },
    },
    toObject: {
      virtuals: true,
    },
  },
);

NoteSchema.methods.isOwner = function (userId: string) {
  return this.owner.equals(userId);
};

NoteSchema.methods.isCollaborator = function (userId: string) {
  return this.collaborators.some((c: ICollaborator) => c.id.equals(userId));
};

NoteSchema.methods.canEdit = function (userId: string) {
  if (this.isOwner(userId)) return true;

  return this.collaborators.some(
    (c: ICollaborator) => c.id.equals(userId) && c.role === "editor",
  );
};

const Note =
  (mongoose.models.Note as INoteModel) ||
  mongoose.model<INoteDocument, INoteModel>("Note", NoteSchema);

export default Note;
