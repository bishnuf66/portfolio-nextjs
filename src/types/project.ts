export interface GalleryImageWithTitle {
    url: string;
    title: string;
}

export type Project = {
    id?: string;
    name: string;
    slug: string;
    url: string;
    description: string;
    tech_stack: string[];
    category: "professional" | "personal";
    is_featured: boolean;
    cover_image_url: string;
    gallery_images: string[];
    gallery_images_with_titles?: GalleryImageWithTitle[]; // New enhanced gallery
    created_at?: string;
    updated_at?: string;
};

export type ProjectFormData = Omit<Project, "id" | "created_at" | "updated_at">;

export type ProjectFormProps = {
    formData: ProjectFormData;
    setFormData: React.Dispatch<React.SetStateAction<ProjectFormData>>;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
    resetForm: () => void;
    uploading: boolean;
    editingProject: boolean;
    isDarkMode: boolean;
    handleCoverImageChange: (file: File) => void;
    handleGalleryImageUpload: (files: FileList) => void;
    removeCoverImage: () => void;
    removeGalleryImage: (index: number) => void;
};

export type ProjectListProps = {
    projects: Project[];
    isDarkMode: boolean;
    handleEdit: (project: Project) => void;
    handleDelete: (id: string) => void;
};
