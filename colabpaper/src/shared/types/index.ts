import { LatexFileType, FileTypeKey, FileCategory, LatexCommand } from './latex.type';
import { TableKey } from './table.types';
import { EmailSignInFormSchema, EmailSignUpFormSchema, EmailAndProfileSignUpSchema, ProfileSetupFormSchema, PhotoUploadSchema } from './form.type';
import { EditorTheme, FileItem, FolderStructure, FolderData } from './editor.types';

// Typescript types
export type {
    // Latex Types
    LatexFileType,
    FileTypeKey,
    FileCategory,
    LatexCommand,
    // Editor Types
    EditorTheme,
    FileItem,
    FolderStructure,
    FolderData,
    // Table Types
    TableKey,
}

// Zod types
export {
    // Form Types
    EmailSignInFormSchema,
    EmailSignUpFormSchema,
    EmailAndProfileSignUpSchema,
    ProfileSetupFormSchema,
    PhotoUploadSchema
}