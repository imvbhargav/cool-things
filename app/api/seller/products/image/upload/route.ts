import cloudinary from '@/lib/cloudinary';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const file = body.file;             // Base64 or file URL
    const productId = body.productId;   // Product ID, if available
    const oldImage = body.oldImage;     // Existing image URL if available

    // Generate the image name
    const imageName = productId != 0 ? `product-${productId}` : `temp-${uuidv4()}`;

    // Upload the new image
    const uploadResponse = await cloudinary.uploader.upload(file, {
      folder: 'nextjs-app/products',
      public_id: imageName,
      overwrite: true,
    });

    // If an old image exists and it's a temp image, delete it
    if (oldImage?.includes('temp-')) {
      const oldPublicId = oldImage
        .split('/')
        .pop()
        .split('.')[0]; // Extract public_id from URL

      await cloudinary.uploader.destroy(`nextjs-app/products/${oldPublicId}`);
    }

    return NextResponse.json({ url: uploadResponse.secure_url }, { status: 200 });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
