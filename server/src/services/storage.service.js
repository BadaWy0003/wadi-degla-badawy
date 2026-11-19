const StorageService = {};
const { Firestore } = require('@google-cloud/firestore');
const { bucket } = require('../start/firebase');
const sharp = require('sharp');
const { col, storagePath, canDeleteStoragePath } = require('../start/data-area');

const firestore = new Firestore();

// Public URL prefix of files in our bucket (used to turn a link back into a file path).
const bucketUrlPrefix = () => `https://storage.googleapis.com/${bucket.name}/`;

// Deletes photos that are no longer used. Only touches files in our own bucket;
// a failure is logged and never breaks the request (the product was already saved).
const deleteStorageFiles = async (links) => {
  for (const link of links) {
    if (typeof link !== 'string' || !link.startsWith(bucketUrlPrefix())) continue;
    const filePath = link.slice(bucketUrlPrefix().length);
    if (!canDeleteStoragePath(filePath)) continue; // staging never deletes production photos
    try {
      await bucket.file(filePath).delete();
    } catch (error) {
      console.error(`Failed to delete old file ${link}:`, error.message);
    }
  }
};

const uploadFileToStorage = async (file, type) => {
  const sanitizedType = type.replace(/[^a-zA-Z0-9_-]/g, '');
  // The original file name comes from the uploader's computer: keep only safe characters.
  const safeName = String(file.originalname || 'image')
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .slice(-80);

  const fileName = storagePath(`uploads/${sanitizedType}/${Date.now()}_${safeName}`);
  const blob = bucket.file(fileName);
  const blobStream = blob.createWriteStream({
    metadata: {
      contentType: file.mimetype,
    },
  });

  await new Promise((resolve, reject) => {
    blobStream.on('error', reject);
    blobStream.on('finish', resolve);
    blobStream.end(file.buffer);
  });

  await blob.makePublic();
  return `https://storage.googleapis.com/${bucket.name}/${fileName}`;
};

// Small copy of a stone photo for cards and lists on the website (640 px wide WebP, about
// 40-70 KB instead of 150-400 KB), stored next to the original under uploads/<type>/thumbs/.
// The finish keeps `link` (full photo) and gets `thumb`. A failure never blocks the upload:
// the website then simply uses the full photo.
// Since 2026-11-18 there is also a 320 px copy (`mini`, "-320" in the file name) for the small
// cards and swatches (finish buttons, Visualizer list, project swatches).
const THUMB_WIDTH = 640;
const MINI_WIDTH = 320;
const SMALL_COPIES = ['thumb', 'mini'];
// Both small copies of one photo: { thumb, mini } (each left out when it failed).
const makeSmallCopies = async (buffer, type, baseName, only = SMALL_COPIES) => {
  const out = {};
  if (only.includes('thumb')) out.thumb = await makeThumb(buffer, type, baseName, THUMB_WIDTH);
  if (only.includes('mini')) out.mini = await makeThumb(buffer, type, baseName, MINI_WIDTH);
  return Object.fromEntries(Object.entries(out).filter(([, v]) => v));
};
const smallLinks = (f) => [f.link, f.thumb, f.mini];

const makeThumb = async (buffer, type, baseName, width = THUMB_WIDTH) => {
  try {
    const out = await sharp(buffer)
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 72 })
      .toBuffer();
    const sanitizedType = type.replace(/[^a-zA-Z0-9_-]/g, '');
    const safeName = String(baseName || 'image')
      .replace(/\.[a-z0-9]+$/i, '')
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .slice(-80);
    const suffix = width === THUMB_WIDTH ? '' : `-${width}`;
    const fileName = storagePath(`uploads/${sanitizedType}/thumbs/${Date.now()}_${safeName}${suffix}.webp`);
    await bucket.file(fileName).save(out, { contentType: 'image/webp', resumable: false });
    await bucket.file(fileName).makePublic();
    return `https://storage.googleapis.com/${bucket.name}/${fileName}`;
  } catch (error) {
    console.error('Thumbnail failed:', error.message);
    return undefined;
  }
};

StorageService.handleMaterialUpload = async ({ id, name, type, finishes, files }) => {
  const materialsRef = firestore.collection(col('materials'));
  const docSnapshot = id ? await materialsRef.doc(id).get() : undefined;

  finishes = finishes.map((f) => ({ ...f, finish: f.finish ?? f.finishName }));

  let uploadedFinishes = [];
  if (files.length) {
    const finishesWithoutFile = finishes.filter((f) => !f.link);

    // Map files explicitly to finishesWithoutFile based on their index
    uploadedFinishes = await Promise.all(
      files.map(async (file, index) => {
        const finish = finishesWithoutFile[index]; // Ensure correct mapping
        if (!finish) return null; // Safeguard against mismatched counts

        const publicUrl = await uploadFileToStorage(file, type); // Upload the file and get its URL
        const copies = await makeSmallCopies(file.buffer, type, file.originalname);
        return { finish: finish.finish, link: publicUrl, ...copies };
      }),
    );

    uploadedFinishes = uploadedFinishes.filter(Boolean); // Remove null entries
  }

  if (!docSnapshot || !docSnapshot.exists) {
    // New material creation
    const newMaterial = {
      name,
      type,
      finishes: uploadedFinishes,
    };
    await materialsRef.add(newMaterial);
    return { message: 'Material created successfully', data: newMaterial };
  } else {
    // Updating existing material
    const existingData = docSnapshot.data();
    // Copy, so the old links can be compared afterwards.
    let nextFinishes = (existingData.finishes ?? []).map((f) => ({ ...f }));
    const oldLinks = nextFinishes.flatMap(smallLinks).filter(Boolean);

    uploadedFinishes.forEach((uploadedFinish) => {
      const finishIndex = nextFinishes.findIndex((f) => f.finish === uploadedFinish.finish);

      if (finishIndex >= 0) {
        nextFinishes[finishIndex].link = uploadedFinish.link; // Update existing finish
        // the old small copies belong to the old photo
        for (const k of SMALL_COPIES) {
          if (uploadedFinish[k]) nextFinishes[finishIndex][k] = uploadedFinish[k];
          else delete nextFinishes[finishIndex][k];
        }
      } else {
        nextFinishes.push(uploadedFinish); // Add new finish
      }
    });

    // Filter out finishes not included in the current request
    nextFinishes = nextFinishes.filter((f) => finishes.some((ff) => ff.finish === f.finish));

    await materialsRef.doc(id).update(
      {
        name,
        type,
        finishes: nextFinishes,
      },
      {
        ignoreUndefinedProperties: true,
      },
    );

    // Photos that were replaced or whose finish was removed: delete them from storage.
    const keptLinks = new Set(nextFinishes.flatMap(smallLinks).filter(Boolean));
    await deleteStorageFiles(oldLinks.filter((link) => !keptLinks.has(link)));

    return {
      message: `Material updated successfully`,
      data: {
        name,
        type,
        finishes: nextFinishes,
      },
    };
  }
};

// Hidden products (hidden: true, set from the admin panel) are left out of the public
// lists, so they disappear from the website. Admins see everything (fetchAllForAdmin).
const isVisible = (doc) => doc.hidden !== true;

// Categories are typed in the admin panel; older ones can have spaces around them
// ("Egyptian Limestone "), so they are returned trimmed.
const withCleanType = (doc) => (typeof doc.type === 'string' ? { ...doc, type: doc.type.trim() } : doc);

StorageService.fetchMaterialsByType = async (type) => {
  const materialsRef = firestore.collection(col('materials'));
  const querySnapshot = await materialsRef.where('type', '==', type).get();

  if (querySnapshot.empty) {
    return []; // Return an empty array if no materials are found
  }

  // Map through the query snapshot and extract material data
  const materials = querySnapshot.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    .filter(isVisible)
    .map(withCleanType);

  return materials;
};

StorageService.fetchAllProducts = async ({ includeHidden = false } = {}) => {
  const materialsRef = firestore.collection(col('materials'));
  const querySnapshot = await materialsRef.get();

  if (querySnapshot.empty) {
    return []; // Return an empty array if no materials are found
  }

  // Map through the query snapshot and extract material data
  const products = querySnapshot.docs.map((doc) =>
    withCleanType({
      id: doc.id,
      ...doc.data(),
    }),
  );

  return includeHidden ? products : products.filter(isVisible);
};

StorageService.setProductHidden = async (productId, hidden) => {
  const docRef = firestore.collection(col('materials')).doc(productId);
  const doc = await docRef.get();
  if (!doc.exists) {
    const error = new Error('Product not found');
    error.statusCode = 404;
    throw error;
  }
  await docRef.update({ hidden });
  return { id: productId, hidden };
};

StorageService.deleteProduct = async (productId) => {
  const materialsRef = firestore.collection(col('materials'));
  const docRef = materialsRef.doc(productId);

  // Retrieve the product document
  const doc = await docRef.get();
  if (!doc.exists) {
    throw new Error('Product not found');
  }

  const product = doc.data();

  // Safety: a product must be hidden before it can be deleted for good
  // (there are no photo backups). Gallery photos can be deleted directly.
  if (product.type !== 'Gallery' && product.hidden !== true) {
    const error = new Error('Hide the product first. Only hidden products can be deleted permanently.');
    error.statusCode = 409;
    throw error;
  }

  // Delete associated files from Firebase Storage
  const finishFiles = (product.finishes || []).flatMap(smallLinks);
  const mockupFiles = [product.mockup, product.mockupOutdoor];

  const allFiles = [...finishFiles, ...mockupFiles];

  // Delete each file from Firebase Storage
  for (const file of allFiles) {
    if (file) {
      const fileName = file.replace(`https://storage.googleapis.com/${bucket.name}/`, '');
      if (!canDeleteStoragePath(fileName)) continue; // staging never deletes production photos
      const fileRef = bucket.file(fileName);

      try {
        await fileRef.delete();
        console.log(`Deleted file from Firebase Storage: ${file}`);
      } catch (error) {
        console.error(`Failed to delete file ${file}:`, error.message);
        // Continue with other deletions even if one fails
      }
    }
  }

  // Delete the Firestore document
  await docRef.delete();
  // and its stone details (description, sizes… shown on the website)
  await require('./product-details.service').remove(productId);

  return { message: 'Product and associated files deleted successfully' };
};

// One-time (and safe to repeat) job: small copies for the photos uploaded before thumbnails
// (640 px) or minis (320 px) existed. Handles at most `limit` photos per call (so a request never times out) and returns
// how many are still missing; the admin panel calls it until `remaining` is 0. Only photos in
// our own bucket; originals are never changed.
StorageService.createMissingThumbs = async ({ limit = 15 } = {}) => {
  const snap = await firestore.collection(col('materials')).get();
  const todo = [];
  snap.docs.forEach((doc) => {
    (doc.data().finishes || []).forEach((f, index) => {
      const missing = SMALL_COPIES.filter((k) => !f?.[k]);
      if (f?.link && missing.length && f.link.startsWith(bucketUrlPrefix())) todo.push({ doc, index, missing });
    });
  });
  let done = 0;
  let failed = 0;
  for (const { doc, index, missing } of todo.slice(0, limit)) {
    const finishes = (doc.data().finishes || []).map((f) => ({ ...f }));
    const f = finishes[index];
    try {
      const filePath = decodeURIComponent(f.link.slice(bucketUrlPrefix().length));
      const [buffer] = await bucket.file(filePath).download();
      const copies = await makeSmallCopies(buffer, doc.data().type || 'misc', filePath.split('/').pop(), missing);
      if (Object.keys(copies).length < missing.length) {
        await deleteStorageFiles(Object.values(copies));
        throw new Error('resize failed');
      }
      // re-read, so a change made meanwhile in the admin panel is not lost
      const fresh = (await doc.ref.get()).data();
      let added = false;
      const next = (fresh.finishes || []).map((x) => {
        if (x.link !== f.link || SMALL_COPIES.some((k) => x[k] && copies[k])) return x;
        added = true;
        return { ...x, ...copies };
      });
      if (!added) {
        await deleteStorageFiles(Object.values(copies)); // the photo changed meanwhile
        continue;
      }
      await doc.ref.update({ finishes: next });
      done += 1;
    } catch (error) {
      console.error(`Thumbnail for ${f.link} failed:`, error.message);
      failed += 1;
    }
  }
  return { done, failed, remaining: Math.max(todo.length - done, 0) };
};

// Shared with the news service: store a photo under uploads/<folder>/ and return its public
// URL; delete photos that are no longer used (only our own bucket, never outside the
// environment's storage area).
StorageService.uploadPhoto = (file, folder) => uploadFileToStorage(file, folder);
StorageService.deleteStorageFiles = deleteStorageFiles;
StorageService.isOwnStorageUrl = (link) => typeof link === 'string' && link.startsWith(bucketUrlPrefix());

module.exports = StorageService;

