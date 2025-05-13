// pages/api/upload-profile-photo.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import formidable, { File } from 'formidable';
import fs from 'fs';
import path from 'path';

// Disable Next.js's default body parser to let formidable handle the form data
export const config = {
  api: {
    bodyParser: false,
  },
};

type ResponseData = {
  message?: string;
  fileUrl?: string;
  error?: string;
};

const parseForm = (req: NextApiRequest): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  return new Promise((resolve, reject) => {
    const form = formidable({
      keepExtensions: true,
    });
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === 'POST') {
    console.log('we here');
    try {
      const { files } = await parseForm(req);
      let file;
      if (!files.profilePhoto) {
        res.status(500).json({ error: 'Error uploading file' });        
      } else {
        file = files.profilePhoto[0];
      }

      if (!file) {
        return res.status(400).json({ error: 'No file provided' });
      }

      // Read the temporary file created by formidable
      const data = fs.readFileSync(file.filepath);

      // Define the destination directory and ensure it exists
      const uploadDir = path.join(process.cwd(), 'public', 'images', 'pfps');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Generate a unique file name
      const fileName = `${file.originalFilename}`;
      const filePath = path.join(uploadDir, fileName);

      // Write the file to the destination directory
      fs.writeFileSync(filePath, data);

      // Construct the URL to access the uploaded file
      const fileUrl = `/images/pfps/${fileName}`;

      res.status(200).json({ message: 'File uploaded successfully', fileUrl });
    } catch (error) {
      console.error('Error uploading file:', error);
      res.status(500).json({ error: 'Error uploading file' });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}