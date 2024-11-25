import { LatexFileType, FileTypeKey, FileCategory } from './latex.type';
import { TableKey } from './table.types';
import { EmailSignInFormSchema, EmailSignUpFormSchema, EmailAndProfileSignUpSchema, ProfileSetupFormSchema, PhotoUploadSchema } from './form.type';

// Typescript types
export type {
    // Latex Types
    LatexFileType,
    FileTypeKey,
    FileCategory,
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