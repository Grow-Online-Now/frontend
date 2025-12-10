# Frontend Media Upload Guide (React + Vite)

This guide explains how to implement the media upload flow in your React frontend using the new S3 media upload API.

## Overview

The upload flow works in 3 steps:
1. **Request Upload URL** - Send file metadata to backend, get presigned S3 URL
2. **Upload to S3** - PUT the file directly to S3 using the presigned URL
3. **Confirm Upload** - Notify backend that upload is complete

```
┌─────────────┐     1. Request URL      ┌─────────────┐     2. PUT file     ┌─────────────┐
│   Frontend  │ ──────────────────────► │   Backend   │                     │     S3      │
│             │ ◄────────────────────── │             │                     │             │
│             │   uploadUrl, mediaId    │             │                     │             │
│             │ ────────────────────────────────────────────────────────►  │             │
│             │                                                             │             │
│             │     3. Confirm upload   │             │                     │             │
│             │ ──────────────────────► │             │ ◄── HeadObject ──── │             │
│             │ ◄────────────────────── │             │                     │             │
│             │   MediaItem (ready)     │             │                     │             │
└─────────────┘                         └─────────────┘                     └─────────────┘
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/media/request-upload` | Get presigned URL, creates pending record |
| POST | `/api/media/confirm-upload` | Confirm upload completed |
| GET | `/api/media` | List user's media (filterable) |
| GET | `/api/media/:id` | Get single media |
| GET | `/api/media/:id/download-url` | Get download URL |
| DELETE | `/api/media/:id` | Delete media |

## File Limits

| Type | Max Size | Allowed MIME Types |
|------|----------|-------------------|
| Images | 10MB | image/jpeg, image/png, image/gif, image/webp |
| Videos | 100MB | video/mp4, video/quicktime, video/webm |

---

## Implementation

### 1. TypeScript Types

Create `src/types/media.ts`:

```typescript
export interface RequestUploadParams {
  fileName: string;
  fileSize: number;
  contentType: string;
  expiresIn?: number; // 60-3600 seconds, default 3600
}

export interface UploadRequestResponse {
  uploadUrl: string;
  mediaId: string;
  key: string;
  contentType: string;
  expiresAt: string;
}

export interface MediaItem {
  id: string;
  fileName: string;
  fileSize: number;
  contentType: string;
  mediaType: 'image' | 'video';
  status: 'pending' | 'ready' | 'failed';
  url: string | null;
  createdAt: string;
}

export interface MediaListResponse {
  media: MediaItem[];
  total: number;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}
```

### 2. Media Upload Service

Create `src/services/mediaUploadService.ts`:

```typescript
import type {
  RequestUploadParams,
  UploadRequestResponse,
  MediaItem,
  MediaListResponse,
  UploadProgress,
} from '../types/media';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export class MediaUploadService {
  /**
   * Step 1: Request presigned URL from backend
   */
  async requestUpload(params: RequestUploadParams): Promise<UploadRequestResponse> {
    const response = await fetch(`${API_BASE}/api/media/request-upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Important for cookie-based auth
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `Request failed: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Step 2: Upload file directly to S3
   * Uses XMLHttpRequest for progress tracking
   */
  uploadToS3(
    file: File,
    uploadUrl: string,
    contentType: string,
    onProgress?: (progress: UploadProgress) => void,
    signal?: AbortSignal
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      // Handle abort signal
      if (signal) {
        signal.addEventListener('abort', () => {
          xhr.abort();
          reject(new Error('Upload cancelled'));
        });
      }

      // Progress tracking
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && onProgress) {
          onProgress({
            loaded: event.loaded,
            total: event.total,
            percentage: Math.round((event.loaded / event.total) * 100),
          });
        }
      });

      // Success
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
        } else {
          reject(new Error(`S3 upload failed with status ${xhr.status}`));
        }
      });

      // Error
      xhr.addEventListener('error', () => {
        reject(new Error('Network error during S3 upload'));
      });

      // Abort
      xhr.addEventListener('abort', () => {
        reject(new Error('Upload was cancelled'));
      });

      // Send request
      xhr.open('PUT', uploadUrl);
      xhr.setRequestHeader('Content-Type', contentType);
      xhr.send(file);
    });
  }

  /**
   * Step 3: Confirm upload with backend
   */
  async confirmUpload(mediaId: string): Promise<MediaItem> {
    const response = await fetch(`${API_BASE}/api/media/confirm-upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ mediaId }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to confirm upload');
    }

    return response.json();
  }

  /**
   * Complete upload flow: request URL → upload to S3 → confirm
   */
  async uploadFile(
    file: File,
    onProgress?: (progress: UploadProgress) => void,
    signal?: AbortSignal
  ): Promise<MediaItem> {
    // Step 1: Request upload URL
    const { uploadUrl, mediaId, contentType } = await this.requestUpload({
      fileName: file.name,
      fileSize: file.size,
      contentType: file.type,
    });

    // Step 2: Upload to S3
    await this.uploadToS3(file, uploadUrl, contentType, onProgress, signal);

    // Step 3: Confirm upload
    return this.confirmUpload(mediaId);
  }

  /**
   * List user's media with optional filters
   */
  async listMedia(options?: {
    status?: 'pending' | 'ready' | 'failed';
    type?: 'image' | 'video';
    limit?: number;
    offset?: number;
  }): Promise<MediaListResponse> {
    const params = new URLSearchParams();
    if (options?.status) params.set('status', options.status);
    if (options?.type) params.set('type', options.type);
    if (options?.limit) params.set('limit', options.limit.toString());
    if (options?.offset) params.set('offset', options.offset.toString());

    const response = await fetch(`${API_BASE}/api/media?${params}`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to list media');
    }

    return response.json();
  }

  /**
   * Get a single media item
   */
  async getMedia(mediaId: string): Promise<MediaItem> {
    const response = await fetch(`${API_BASE}/api/media/${mediaId}`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Media not found');
    }

    return response.json();
  }

  /**
   * Delete media
   */
  async deleteMedia(mediaId: string): Promise<void> {
    const response = await fetch(`${API_BASE}/api/media/${mediaId}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to delete media');
    }
  }
}

// Singleton instance
export const mediaUploadService = new MediaUploadService();
```

### 3. React Hook

Create `src/hooks/useMediaUpload.ts`:

```typescript
import { useState, useCallback, useRef } from 'react';
import { mediaUploadService } from '../services/mediaUploadService';
import type { MediaItem, UploadProgress } from '../types/media';

interface UploadState {
  uploading: boolean;
  progress: UploadProgress | null;
  error: string | null;
  result: MediaItem | null;
}

export function useMediaUpload() {
  const [state, setState] = useState<UploadState>({
    uploading: false,
    progress: null,
    error: null,
    result: null,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const upload = useCallback(async (file: File): Promise<MediaItem | null> => {
    // Cancel any ongoing upload
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    setState({
      uploading: true,
      progress: { loaded: 0, total: file.size, percentage: 0 },
      error: null,
      result: null,
    });

    try {
      const result = await mediaUploadService.uploadFile(
        file,
        (progress) => {
          setState((prev) => ({ ...prev, progress }));
        },
        abortControllerRef.current.signal
      );

      setState({
        uploading: false,
        progress: { loaded: file.size, total: file.size, percentage: 100 },
        error: null,
        result,
      });

      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Upload failed';
      setState((prev) => ({
        ...prev,
        uploading: false,
        error: message,
      }));
      return null;
    }
  }, []);

  const cancel = useCallback(() => {
    abortControllerRef.current?.abort();
    setState((prev) => ({
      ...prev,
      uploading: false,
      error: 'Upload cancelled',
    }));
  }, []);

  const reset = useCallback(() => {
    abortControllerRef.current?.abort();
    setState({
      uploading: false,
      progress: null,
      error: null,
      result: null,
    });
  }, []);

  return {
    ...state,
    upload,
    cancel,
    reset,
  };
}
```

### 4. MediaUploader Component

Create `src/components/MediaUploader.tsx`:

```tsx
import React, { useRef, useState, useCallback } from 'react';
import { useMediaUpload } from '../hooks/useMediaUpload';
import type { MediaItem } from '../types/media';

// File size limits
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB

const ALLOWED_TYPES = {
  image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  video: ['video/mp4', 'video/quicktime', 'video/webm'],
};

interface MediaUploaderProps {
  onUploadComplete?: (media: MediaItem) => void;
  onError?: (error: string) => void;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  className?: string;
}

export function MediaUploader({
  onUploadComplete,
  onError,
  accept = 'image/*,video/*',
  multiple = false,
  disabled = false,
  className = '',
}: MediaUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const { uploading, progress, error, upload, cancel, reset } = useMediaUpload();

  const validateFile = useCallback((file: File): string | null => {
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');

    if (!isImage && !isVideo) {
      return 'Only image and video files are allowed';
    }

    if (isImage) {
      if (!ALLOWED_TYPES.image.includes(file.type)) {
        return `Image type not allowed. Use: ${ALLOWED_TYPES.image.join(', ')}`;
      }
      if (file.size > MAX_IMAGE_SIZE) {
        return `Image too large. Max size: ${MAX_IMAGE_SIZE / 1024 / 1024}MB`;
      }
    }

    if (isVideo) {
      if (!ALLOWED_TYPES.video.includes(file.type)) {
        return `Video type not allowed. Use: ${ALLOWED_TYPES.video.join(', ')}`;
      }
      if (file.size > MAX_VIDEO_SIZE) {
        return `Video too large. Max size: ${MAX_VIDEO_SIZE / 1024 / 1024}MB`;
      }
    }

    return null;
  }, []);

  const handleFile = useCallback(async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      onError?.(validationError);
      return;
    }

    const result = await upload(file);
    if (result) {
      onUploadComplete?.(result);
    }
  }, [upload, validateFile, onUploadComplete, onError]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled && !uploading) {
      setDragActive(true);
    }
  }, [disabled, uploading]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);

    if (disabled || uploading) return;

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, [disabled, uploading, handleFile]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
    // Reset input so same file can be selected again
    e.target.value = '';
  }, [handleFile]);

  const handleClick = useCallback(() => {
    if (!disabled && !uploading) {
      fileInputRef.current?.click();
    }
  }, [disabled, uploading]);

  return (
    <div className={`media-uploader ${className}`}>
      <div
        className={`
          drop-zone
          ${dragActive ? 'drag-active' : ''}
          ${uploading ? 'uploading' : ''}
          ${disabled ? 'disabled' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label="Upload media"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          disabled={disabled || uploading}
          hidden
        />

        {uploading ? (
          <div className="upload-progress">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progress?.percentage || 0}%` }}
              />
            </div>
            <span className="progress-text">
              {progress?.percentage || 0}% uploaded
            </span>
            <button
              type="button"
              className="cancel-btn"
              onClick={(e) => {
                e.stopPropagation();
                cancel();
              }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="drop-zone-content">
            <div className="icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <p className="primary-text">
              {dragActive ? 'Drop file here' : 'Drag & drop or click to upload'}
            </p>
            <p className="secondary-text">
              Images up to 10MB, Videos up to 100MB
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="error-message">
          <span>{error}</span>
          <button type="button" onClick={reset}>
            Dismiss
          </button>
        </div>
      )}

      <style>{`
        .media-uploader {
          width: 100%;
        }

        .drop-zone {
          border: 2px dashed #ccc;
          border-radius: 8px;
          padding: 32px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s ease;
          background: #fafafa;
        }

        .drop-zone:hover:not(.disabled):not(.uploading) {
          border-color: #666;
          background: #f0f0f0;
        }

        .drop-zone.drag-active {
          border-color: #0066cc;
          background: #e6f2ff;
        }

        .drop-zone.uploading {
          cursor: default;
          border-color: #0066cc;
        }

        .drop-zone.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .drop-zone-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .drop-zone-content .icon {
          color: #666;
        }

        .drop-zone-content .primary-text {
          font-size: 16px;
          font-weight: 500;
          color: #333;
          margin: 0;
        }

        .drop-zone-content .secondary-text {
          font-size: 14px;
          color: #666;
          margin: 0;
        }

        .upload-progress {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          width: 100%;
        }

        .progress-bar {
          width: 100%;
          max-width: 300px;
          height: 8px;
          background: #e0e0e0;
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: #0066cc;
          transition: width 0.1s ease;
        }

        .progress-text {
          font-size: 14px;
          color: #333;
        }

        .cancel-btn {
          padding: 6px 16px;
          background: none;
          border: 1px solid #666;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }

        .cancel-btn:hover {
          background: #f0f0f0;
        }

        .error-message {
          margin-top: 12px;
          padding: 12px;
          background: #fee;
          border: 1px solid #f88;
          border-radius: 4px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #c00;
        }

        .error-message button {
          background: none;
          border: none;
          color: #c00;
          cursor: pointer;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
```

### 5. Multiple File Upload Hook

For uploading multiple files, create `src/hooks/useMultiMediaUpload.ts`:

```typescript
import { useState, useCallback, useRef } from 'react';
import { mediaUploadService } from '../services/mediaUploadService';
import type { MediaItem, UploadProgress } from '../types/media';

interface FileUploadState {
  file: File;
  progress: UploadProgress;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  result?: MediaItem;
  error?: string;
}

export function useMultiMediaUpload() {
  const [uploads, setUploads] = useState<Map<string, FileUploadState>>(new Map());
  const abortControllersRef = useRef<Map<string, AbortController>>(new Map());

  const uploadFiles = useCallback(async (files: File[]): Promise<MediaItem[]> => {
    const results: MediaItem[] = [];

    // Initialize all uploads as pending
    const initialStates = new Map<string, FileUploadState>();
    files.forEach((file, index) => {
      const id = `${file.name}-${index}-${Date.now()}`;
      initialStates.set(id, {
        file,
        progress: { loaded: 0, total: file.size, percentage: 0 },
        status: 'pending',
      });
    });
    setUploads(initialStates);

    // Process uploads sequentially (or parallel with Promise.all)
    for (const [id, state] of initialStates.entries()) {
      const abortController = new AbortController();
      abortControllersRef.current.set(id, abortController);

      try {
        setUploads((prev) => {
          const newMap = new Map(prev);
          newMap.set(id, { ...state, status: 'uploading' });
          return newMap;
        });

        const result = await mediaUploadService.uploadFile(
          state.file,
          (progress) => {
            setUploads((prev) => {
              const newMap = new Map(prev);
              const current = newMap.get(id);
              if (current) {
                newMap.set(id, { ...current, progress });
              }
              return newMap;
            });
          },
          abortController.signal
        );

        setUploads((prev) => {
          const newMap = new Map(prev);
          newMap.set(id, {
            ...state,
            status: 'completed',
            result,
            progress: { loaded: state.file.size, total: state.file.size, percentage: 100 },
          });
          return newMap;
        });

        results.push(result);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Upload failed';
        setUploads((prev) => {
          const newMap = new Map(prev);
          newMap.set(id, { ...state, status: 'error', error: message });
          return newMap;
        });
      }
    }

    return results;
  }, []);

  const cancelUpload = useCallback((id: string) => {
    abortControllersRef.current.get(id)?.abort();
  }, []);

  const cancelAll = useCallback(() => {
    abortControllersRef.current.forEach((controller) => controller.abort());
  }, []);

  const clear = useCallback(() => {
    cancelAll();
    setUploads(new Map());
  }, [cancelAll]);

  const uploadsArray = Array.from(uploads.entries()).map(([id, state]) => ({
    id,
    ...state,
  }));

  const isUploading = uploadsArray.some((u) => u.status === 'uploading');
  const completedCount = uploadsArray.filter((u) => u.status === 'completed').length;
  const errorCount = uploadsArray.filter((u) => u.status === 'error').length;

  return {
    uploads: uploadsArray,
    isUploading,
    completedCount,
    errorCount,
    uploadFiles,
    cancelUpload,
    cancelAll,
    clear,
  };
}
```

### 6. Integration with Post Creation

Example integration in your post creation form:

```tsx
import React, { useState } from 'react';
import { MediaUploader } from './MediaUploader';
import type { MediaItem } from '../types/media';

export function CreatePostForm() {
  const [caption, setCaption] = useState('');
  const [uploadedMedia, setUploadedMedia] = useState<MediaItem[]>([]);
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMediaUpload = (media: MediaItem) => {
    setUploadedMedia((prev) => [...prev, media]);
  };

  const removeMedia = (mediaId: string) => {
    setUploadedMedia((prev) => prev.filter((m) => m.id !== mediaId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/posts/multi-platform', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          caption,
          social_accounts: selectedAccounts,
          // Pass media URLs from confirmed uploads
          media_urls: uploadedMedia.map((m) => m.url).filter(Boolean),
        }),
      });

      if (response.ok) {
        // Success - reset form
        setCaption('');
        setUploadedMedia([]);
        alert('Post created!');
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to create post');
      }
    } catch (error) {
      alert('Network error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="caption">Caption</label>
        <textarea
          id="caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="What's on your mind?"
          maxLength={3000}
          rows={4}
        />
      </div>

      <div className="form-group">
        <label>Media</label>

        {/* Display uploaded media */}
        {uploadedMedia.length > 0 && (
          <div className="uploaded-media-grid">
            {uploadedMedia.map((media) => (
              <div key={media.id} className="media-preview">
                {media.mediaType === 'image' ? (
                  <img src={media.url!} alt={media.fileName} />
                ) : (
                  <video src={media.url!} controls />
                )}
                <button
                  type="button"
                  className="remove-btn"
                  onClick={() => removeMedia(media.id)}
                  aria-label="Remove media"
                >
                  &times;
                </button>
                <span className="file-name">{media.fileName}</span>
              </div>
            ))}
          </div>
        )}

        {/* Upload new media */}
        <MediaUploader
          onUploadComplete={handleMediaUpload}
          onError={(error) => alert(error)}
        />
      </div>

      {/* Account selection would go here */}

      <button
        type="submit"
        disabled={!caption || selectedAccounts.length === 0 || isSubmitting}
      >
        {isSubmitting ? 'Creating...' : 'Create Post'}
      </button>
    </form>
  );
}
```

---

## AWS S3 Setup

### 1. Create S3 Bucket

1. Go to AWS S3 Console → Create Bucket
2. Name: `grow-online-media` (or your preference)
3. Region: `eu-west-1` (or your preference)
4. Object Ownership: ACLs disabled
5. Block Public Access: Uncheck "Block all public access" (needed for presigned URLs)
6. Create bucket

### 2. Configure CORS

In bucket → Permissions → CORS configuration:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "HEAD"],
    "AllowedOrigins": [
      "http://localhost:5173",
      "https://your-production-domain.com"
    ],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
```

### 3. Create IAM User

Create IAM user with this policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:HeadObject"
      ],
      "Resource": "arn:aws:s3:::grow-online-media/*"
    }
  ]
}
```

### 4. Environment Variables

Add to backend `.env`:

```env
AWS_REGION=eu-west-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_S3_BUCKET_NAME=grow-online-media
# Optional: CloudFront CDN URL
AWS_CLOUDFRONT_URL=
```

---

## Error Handling

Common errors and how to handle them:

| Error | Cause | Solution |
|-------|-------|----------|
| "Image type not allowed" | Wrong MIME type | Check file extension, use accepted types |
| "Image size exceeds limit" | File too large | Compress or resize before upload |
| "S3 upload failed" | Network/CORS issue | Check CORS config, network connection |
| "File not found in S3" | Upload didn't complete | Retry upload from beginning |
| "Access denied" | Trying to access another user's media | Use correct mediaId |

---

## Testing the Flow

1. Start your backend: `pnpm run start:dev`
2. Open Swagger docs: `http://localhost:3000/api/docs`
3. Test the endpoints:
   - POST `/api/media/request-upload` with file metadata
   - Use curl/Postman to PUT file to the returned URL
   - POST `/api/media/confirm-upload` with mediaId
   - GET `/api/media` to see your uploaded files
