import Note, { INoteDocument } from "@/db/models/Note";
import { CollaboratorRole } from "@/validators/note.schema";
import BaseRepository from "@repositories/base.repo";

class NoteRepository extends BaseRepository<INoteDocument> {
  constructor() {
    super(Note);
  }
  async addCollaborator(
    noteId: string | string[],
    collaboratorId: string,
    role: CollaboratorRole = "viewer",
  ) {
    return this.model.findByIdAndUpdate(
      noteId,
      {
        $push: {
          collaborators: {
            id: collaboratorId,
            role,
          },
        },
      },
      { new: true },
    );
  }
  async findByOwner(userId: string) {
    return this.model.find({ owner: userId });
  }
  async findNote(id: string) {
    return this.model.findById(id);
  }
  async findAllNotes(userId: string) {
    return this.model.find({
      $or: [
        { owner: userId },
        { collaborators: { $elemMatch: { id: userId } } },
      ],
    });
  }
}

export default NoteRepository;
