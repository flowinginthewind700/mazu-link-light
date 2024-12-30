// src/pages/api/cos.ts
import { NextApiRequest, NextApiResponse } from 'next';
import COS from "cos-nodejs-sdk-v5";
import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';

const cos = new COS({
  SecretId: process.env.NEXT_PUBLIC_COS_SECRET_ID,
  SecretKey: process.env.NEXT_PUBLIC_COS_SECRET_KEY,
});

const BUCKET = process.env.NEXT_PUBLIC_COS_BUCKET_NAME!;
const REGION = process.env.NEXT_PUBLIC_COS_REGION!;

const parser = new XMLParser();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { action, path } = req.query;

  if (typeof path !== 'string') {
    res.status(400).json({ error: 'Invalid path' });
    return;
  }

  try {
    if (action === 'getFilesAndFolders') {
      cos.getBucket({
        Bucket: BUCKET,
        Region: REGION,
        Prefix: path,
        Delimiter: '/'
      }, (err, data) => {
        if (err) {
          console.error('Error:', err);
          res.status(500).json({ error: 'Failed to get files and folders' });
        } else {
          const result = {
            CommonPrefixes: data.CommonPrefixes || [],
            Contents: data.Contents || []
          };
          res.status(200).json(result);
        }
      });
    } else if (action === 'getTags') {
      try {
        const url = `https://${BUCKET}.cos.${REGION}.myqcloud.com/${encodeURIComponent(path)}?tagging`;
        console.log('Requesting tags from URL:', url);
    
        const response = await axios.get(url, {
          headers: {
            'Authorization': cos.getAuth({
              Method: 'GET',
              Key: path,
              Query: { tagging: '' },
            }),
          },
        });
    
        console.log('Received XML response:', response.data);
    
        const result = parser.parse(response.data);
        console.log('Parsed XML result:', JSON.stringify(result, null, 2));
    
        let tags = [];
        if (result.Tagging && result.Tagging.TagSet) {
          if (Array.isArray(result.Tagging.TagSet.Tag)) {
            tags = result.Tagging.TagSet.Tag.map((tag: any) => ({
              Key: tag.Key,
              Value: tag.Value,
            }));
          } else if (result.Tagging.TagSet.Tag) {
            // 处理只有一个标签的情况
            tags = [{
              Key: result.Tagging.TagSet.Tag.Key,
              Value: result.Tagging.TagSet.Tag.Value,
            }];
          }
        }
    
        console.log('Extracted tags:', JSON.stringify(tags, null, 2));
        res.status(200).json({ TagSet: tags });
      } catch (error) {
        console.error('Error fetching tags:', error);
        if (axios.isAxiosError(error) && error.response) {
          console.error('Response status:', error.response.status);
          console.error('Response data:', error.response.data);
        }
        res.status(500).json({ error: 'Failed to get tags' });
      }
    } else if (action === 'getObject') {
      cos.getObject({
        Bucket: BUCKET,
        Region: REGION,
        Key: path,
      }, (err, data) => {
        if (err) {
          console.error('Error:', err);
          res.status(500).json({ error: 'Failed to get object' });
        } else {
          res.status(200).json({ Body: data.Body });
        }
      });
    } else {
      res.status(400).json({ error: 'Invalid action' });
    }
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
