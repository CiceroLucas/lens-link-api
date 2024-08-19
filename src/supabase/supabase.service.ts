import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { FileDTO } from 'src/post/dto/upload-file.dto';

@Injectable()
export class SupabaseService {
  async upload(file: FileDTO) {
    const supabaseURL = process.env.SUPABASE_URL;
    const supabaseKEY = process.env.SUPABASE_KEY;
    const bucket = process.env.SUPABASE_BUCKET;

    const supabase = createClient(supabaseURL, supabaseKEY, {
      auth: {
        persistSession: false,
      },
    });

    const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
    const fileExtension = file.originalname.split('.').pop();
    const fileName = `${timestamp}.${fileExtension}`;

    const { error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file.buffer, {
        upsert: false,
        contentType: 'image/png',
      });

    if (error) {
      throw new Error(error.message);
    }

    const res = supabase.storage.from(bucket).getPublicUrl(fileName);

    return res.data.publicUrl;
  }
}
