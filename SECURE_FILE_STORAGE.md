# Secure File Storage Implementation

## Overview
The application now uses a **private, user-organized file storage system** instead of storing files in the public directory. This provides:

✅ **Access Control** - Files are only accessible to their owner via authenticated endpoints
✅ **Directory Traversal Protection** - File paths are sanitized to prevent attacks
✅ **User-Based Organization** - Files are organized by user ID for easy management
✅ **Secure Endpoints** - All file access requires authentication

## File Storage Structure

```
attachments/
├── userId1/
│   ├── property_image/
│   │   ├── property_image-1234567890-123456789.jpg
│   │   └── property_image-1234567891-987654321.jpg
│   ├── property_document/
│   ├── user/
│   └── user_document/
├── userId2/
│   └── ...
└── ...
```

## How to Use

### 1. Uploading Files
Files are automatically stored in the private `attachments/` folder under the authenticated user's ID:

```typescript
// Files uploaded through authenticated routes are stored at:
// attachments/{userId}/{fieldName}/{fileName}

// Example route:
Router.post("/profile/upload", authentication, upload.single("profile_image"), 
  (req, res) => {
    // File is automatically stored in: attachments/{userId}/profile_image/...
    const fileInfo = {
      fieldName: req.file?.fieldname,
      fileName: req.file?.filename
    };
    // Store this info in database
  }
);
```

### 2. Retrieving Files

#### Option A: View File (Inline - for images/PDFs)
```
GET /files/view/{userId}/{fieldName}/{fileName}
Authorization: Bearer {token}
```

Example: `GET /files/view/user123/property_image/property_image-1234567890-123456789.jpg`

Returns the file with appropriate MIME type for inline viewing.

#### Option B: Download File
```
GET /files/download/{userId}/{fieldName}/{fileName}
Authorization: Bearer {token}
```

Example: `GET /files/download/user123/property_document/property_image-1234567890-123456789.pdf`

Returns the file as a download.

### 3. Updating Database Records

When storing file references in the database, use the helper functions:

```typescript
import { generateSecureFilePath } from "../helpers/filePathHelper";

// After file upload:
const userId = req.currentUser?.id;
const filePath = generateSecureFilePath(
  userId,
  req.file?.fieldname || 'unknown',
  req.file?.filename || ''
);

// Store in database:
await User.updateOne(
  { _id: userId },
  { profileImage: filePath }
);
```

### 4. Displaying Files in Frontend

For secure file display in the frontend:

```typescript
// Assume filePath from database is: /files/view/user123/property_image/property_image-123456789.jpg

// For images:
<img src={filePath} alt="Property" />

// For PDFs or documents:
<a href={filePath} target="_blank">Download Document</a>

// For direct downloads:
const downloadUrl = filePath.replace('/files/view/', '/files/download/');
<a href={downloadUrl} download>Download File</a>
```

## Security Features

### 1. Authentication Required
All file endpoints require valid JWT authentication:
```typescript
app.get('/files/view/:userId/:fieldName/:fileName', authentication, serveFile);
app.get('/files/download/:userId/:fieldName/:fileName', authentication, secureFileAccess);
```

### 2. Ownership Verification
The middleware verifies the requesting user owns the file:
```typescript
if (userId !== requestingUserId) {
  return res.status(403).json({ error: "Forbidden" });
}
```

### 3. Path Sanitization
All path components are sanitized to prevent directory traversal attacks:
```typescript
const sanitizedUserId = path.basename(userId); // Removes any path separators
const sanitizedFieldName = path.basename(fieldName);
const sanitizedFileName = path.basename(fileName);
```

### 4. MIME Type Validation
Files are served with correct MIME types to prevent execution:
```typescript
const mimeTypes = {
  ".pdf": "application/pdf",
  ".jpg": "image/jpeg",
  // ... more types
};
res.setHeader("Content-Type", mimeTypes[ext]);
```

### 5. No Cache Headers
Sensitive files prevent caching:
```typescript
res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
```

## Migration Guide

If you have existing files in `public/` folder:

1. **Create the attachments directory structure:**
   ```bash
   mkdir -p attachments
   ```

2. **Migrate existing files:**
   ```bash
   # For each user, organize their files:
   mv public/{fieldName}/* attachments/{userId}/{fieldName}/
   ```

3. **Update database records:**
   Update any file path references from the old format to use the new secure path format.

4. **Delete public files:**
   ```bash
   rm -rf public/*
   ```

## File Size Limits (Recommended)

Add file size validation to your upload routes:

```typescript
const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB max
  },
  fileFilter: (req, file, cb) => {
    // Validate file types
    const allowedMimes = [
      'image/jpeg',
      'image/png',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});
```

## Example: Complete Upload and Retrieve Flow

### Upload
```typescript
// POST /user/profile-picture
Router.post('/profile-picture', authentication, upload.single('profilePicture'),
  async (req: RequestWithUser, res: Response) => {
    try {
      const userId = req.currentUser?.id;
      
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      // Generate secure path for database
      const filePath = generateSecureFilePath(
        userId,
        'profilePicture',
        req.file.filename
      );

      // Update user record
      await User.updateOne(
        { _id: userId },
        { profilePictureUrl: filePath }
      );

      return res.status(200).json({
        message: 'Profile picture uploaded successfully',
        fileUrl: filePath
      });
    } catch (error) {
      return res.status(500).json({ error: 'Upload failed' });
    }
  }
);
```

### Retrieve
```typescript
// Frontend fetches the file using the stored URL
// GET /files/view/{userId}/profilePicture/{fileName}
// Authenticated user can only access their own files
```

## Troubleshooting

### Issue: "File not found" error
- Verify the file path format is correct: `/files/view/{userId}/{fieldName}/{fileName}`
- Check that the file exists in the `attachments/{userId}/{fieldName}/` directory
- Ensure the authenticated user ID matches the userId in the path

### Issue: "Forbidden" error
- Make sure you're authenticated (have valid JWT token)
- Verify you're requesting files for your own user ID
- Check that the Authorization header is properly set

### Issue: MIME type issues
- Some file types may need to be added to the mimeTypes object in `fileAccess.middleware.ts`
- Contact the development team if you need additional file types supported

## Future Enhancements

Consider these improvements for even better security:

1. **Cloud Storage** - Use AWS S3, Google Cloud Storage, or similar
2. **Virus Scanning** - Integrate ClamAV or similar for file scanning
3. **File Encryption** - Encrypt files at rest
4. **Access Logging** - Log all file access for auditing
5. **Bandwidth Throttling** - Limit download speeds to prevent abuse
6. **Expiring Links** - Generate time-limited download URLs
