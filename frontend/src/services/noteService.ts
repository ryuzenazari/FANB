import api from './api';

export interface Note {
  _id?: string;
  title: string;
  content: string;
  type: 'note' | 'journal' | 'idea' | 'goal';
  color: string;
  tags: string[];
  pinned: boolean;
  archived: boolean;
  attachments?: {
    name: string;
    path: string;
    type: string;
  }[];
  linkedTasks?: string[];
  mood?: 'very-bad' | 'bad' | 'neutral' | 'good' | 'very-good';
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface NoteResponse {
  success: boolean;
  data: Note;
}

export interface NotesResponse {
  success: boolean;
  count: number;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  data: Note[];
}

export interface NoteQueryParams {
  type?: string;
  tag?: string;
  archived?: boolean;
  pinned?: boolean;
  search?: string;
  mood?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export interface TagsResponse {
  success: boolean;
  count: number;
  data: string[];
}

const noteService = {
  /**
   * Mendapatkan daftar catatan
   */
  async getNotes(params: NoteQueryParams = {}): Promise<NotesResponse> {
    const response = await api.get('/notes', { params });
    return response.data;
  },

  /**
   * Mendapatkan detail catatan berdasarkan ID
   */
  async getNote(id: string): Promise<NoteResponse> {
    const response = await api.get(`/notes/${id}`);
    return response.data;
  },

  /**
   * Membuat catatan baru
   */
  async createNote(noteData: Partial<Note>): Promise<NoteResponse> {
    const response = await api.post('/notes', noteData);
    return response.data;
  },

  /**
   * Memperbarui catatan yang sudah ada
   */
  async updateNote(id: string, noteData: Partial<Note>): Promise<NoteResponse> {
    const response = await api.put(`/notes/${id}`, noteData);
    return response.data;
  },

  /**
   * Menghapus catatan
   */
  async deleteNote(id: string): Promise<{ success: boolean }> {
    const response = await api.delete(`/notes/${id}`);
    return response.data;
  },

  /**
   * Toggle pin catatan
   */
  async togglePin(id: string): Promise<NoteResponse> {
    const response = await api.put(`/notes/${id}/pin`);
    return response.data;
  },

  /**
   * Toggle archive catatan
   */
  async toggleArchive(id: string): Promise<NoteResponse> {
    const response = await api.put(`/notes/${id}/archive`);
    return response.data;
  },

  /**
   * Mendapatkan semua tag yang tersedia
   */
  async getTags(): Promise<TagsResponse> {
    const response = await api.get('/notes/tags');
    return response.data;
  }
};

export default noteService; 