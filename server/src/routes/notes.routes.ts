import { notesController } from "@/controllers/notes.controller";
import { authenticate } from "@/middleware/auth.middleware";
import { validate } from "@/middleware/validate";
import {
  addCollaboratorSchema,
  createNoteSchema,
  noteParamsSchema,
  updateNoteSchema,
} from "@/validators/note.schema";
import express from "express";

const notesRouter = express.Router();

notesRouter.get("/", authenticate, notesController.getNotes);
notesRouter.get(
  "/:noteId",
  authenticate,
  validate({ params: noteParamsSchema }),
  notesController.getSingleNote,
);
notesRouter.post(
  "/",
  authenticate,
  validate({ body: createNoteSchema }),
  notesController.createNote,
);
notesRouter.patch(
  "/:noteId/collaborators",
  authenticate,
  validate({ body: addCollaboratorSchema, params: noteParamsSchema }),
  notesController.addCollaborator,
);
notesRouter.patch(
  "/:noteId",
  authenticate,
  validate({ params: noteParamsSchema, body: updateNoteSchema }),
  notesController.updateNote,
);
notesRouter.delete(
  "/:noteId",
  authenticate,
  validate({ params: noteParamsSchema }),
  notesController.deleteNote,
);

export default notesRouter;
