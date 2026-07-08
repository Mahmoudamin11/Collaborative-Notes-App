import { AuthRequest } from "@/middleware/auth.middleware";
import NotesService from "@/services/notes.service";
import { sendResponse } from "@/utils/sendResponse";
import { CreateNoteInput, UpdateNoteInput } from "@/validators/note.schema";
import { Response } from "express";

class NotesController { 
    private readonly notesService: NotesService;

    constructor() {
        this.notesService = new NotesService();
    }
    addCollaborator = async (req : AuthRequest, res:Response) => {
        const noteId = req.params.noteId;
        const {email, role} = req.body;
        const note = await this.notesService.addCollaborator(noteId, email,  req.user!.userId, role);
        sendResponse(res, 200, "Collaborator added successfully", note);
    }
    createNote = async (req : AuthRequest, res:Response) => {
        const userId = req.user!.userId;
        const noteData : CreateNoteInput = req.body;
        const note = await this.notesService.createNote(userId, noteData);
        sendResponse(res, 201, "Note created successfully", note);
    }
    getSingleNote = async (req : AuthRequest, res:Response) => {
        const userId = req.user!.userId;
        const noteId = req.params.noteId;
        const note = await this.notesService.getSingleNote(userId, noteId);
        sendResponse(res, 200, "Note fetched successfully", note);
    }
    getNotes = async (req : AuthRequest, res:Response) => { 
        const userId = req.user!.userId;
        const notes = await this.notesService.getAccessibleNotes(userId);
        sendResponse(res, 200, "Notes fetched successfully", notes);
    }
    deleteNote = async (req : AuthRequest, res:Response) => {
        const userId = req.user!.userId;
        const noteId = req.params.noteId;
        await this.notesService.deleteNote(userId, noteId);
        sendResponse(res, 200, "Note Deleted successfully", null);
    }
    updateNote = async(req : AuthRequest, res:Response) => {
        const userId = req.user!.userId;
        const noteId = req.params.noteId;
        const noteData : UpdateNoteInput = req.body;
        const note = await this.notesService.updateNote(userId, noteId, noteData);
        sendResponse(res, 200, "Note updated successfully", note);
    }
}

export const notesController = new NotesController();