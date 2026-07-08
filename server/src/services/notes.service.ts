import BadRequestError from "@/errors/bad-request";
import ForbiddenError from "@/errors/forbidden";
import NotFoundError from "@/errors/not-found";
import UnauthenticatedError from "@/errors/unauthenticated";
import NoteRepository from "@/repositories/note.repo";
import UserRepository from "@/repositories/user.repo";
import { CollaboratorRole, CreateNoteInput, UpdateNoteInput } from "@/validators/note.schema";
import mongoose from "mongoose";

class NotesService {
  private noteRepository: NoteRepository;
  private userRepository: UserRepository;

  constructor() {
    this.noteRepository = new NoteRepository();
    this.userRepository = new UserRepository();
  }
  async addCollaborator(
    noteId: string | string[],
    email: string,
    ownerId: string,
    role: CollaboratorRole,
  ) {
    const note = await this.noteRepository.findById(noteId);

    if (!note) throw new NotFoundError("Note not found");

    if (note.owner.toString() !== ownerId)
      throw new UnauthenticatedError("You are not the owner of this note");

    const collaborator = await this.userRepository.findByEmail(email);

    if (!collaborator) throw new NotFoundError("Collaborator not found");

    const alreadyCollaborator = note.collaborators.some(
      (c) => c.id.toString() === collaborator.id,
    );

    if (alreadyCollaborator) {
      throw new BadRequestError("User is already a collaborator");
    }
    return this.noteRepository.addCollaborator(noteId, collaborator.id, role);
  }
  async createNote(userId: string, noteData: CreateNoteInput) {
    return this.noteRepository.create({
      ...noteData,
      owner: new mongoose.Types.ObjectId(userId),
    });
  }
  async getSingleNote(userId: string, noteId: string | string[]) {
    const note = await this.noteRepository.findById(noteId);
    if (!note) throw new NotFoundError("Note not found");
    const isOwner = note.owner.toString() === userId;
    const isCollaborator = note.collaborators.some(
      (c) => c.id.toString() === userId,
    );
    if (!isOwner && !isCollaborator)
      throw new ForbiddenError("You are not authorized to view this note");
    return { ...note.toObject(), isOwner };
  }
  async getAccessibleNotes(userId: string) {
    const notes = await this.noteRepository.findAllNotes(userId);
    return notes.map((note) => ({
      ...note.toObject(),
      isOwner: note.owner.toString() === userId,
    }));
  }
  async deleteNote(userId: string, noteId: string | string[]) {
    const note = await this.noteRepository.findById(noteId);
    if (!note) throw new NotFoundError("Note not found");
    if (!note.isOwner(userId))
      throw new ForbiddenError("You are not authorized to delete this note");
    await this.noteRepository.deleteById(noteId);
  }
  async updateNote(
    userId: string,
    noteId: string | string[],
    data: UpdateNoteInput,
  ) {
    const note = await this.noteRepository.findById(noteId);
    if (!note) throw new NotFoundError("Note not found");

    if (!note.canEdit(userId))
      throw new ForbiddenError("You are not authorized to update this note");
    return this.noteRepository.updateById(noteId, data);
  }
}

export default NotesService;
