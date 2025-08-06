import { db, storage } from "./firebaseConfig";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  addDoc,
  query,
  where,
  DocumentReference,
  DocumentData,
  orderBy,
  limit
} from "firebase/firestore";
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from "firebase/storage";

// --- USERS ---
export async function createUserProfile(uid: string, data: any) {
  // data: { email, phone_number, user_type, first_name, last_name, ... }
  const userRef = doc(db, "users", uid);
  await setDoc(userRef, {
    ...data,
    created_at: new Date(),
    updated_at: new Date(),
    last_login_at: new Date(),
    is_verified: false,
  });
  return userRef;
}

export async function getUserProfile(uid: string) {
  const userRef = doc(db, "users", uid);
  const snap = await getDoc(userRef);
  return snap.exists() ? snap.data() : null;
}

export async function updateUserProfile(uid: string, data: any) {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, { 
    ...data, 
    updated_at: new Date(),
    full_name: data.first_name && data.last_name ? `${data.first_name} ${data.last_name}` : undefined
  });
}

// --- SELLERS ---
export async function createSellerProfile(uid: string, data: any) {
  const sellerRef = doc(db, "sellers", uid);
  await setDoc(sellerRef, {
    ...data,
    created_at: new Date(),
    updated_at: new Date(),
    average_rating: 0,
    review_count: 0,
    is_premium: false,
    is_verified: false,
    // Profile fields
    company_name: data.company_name || data.business_name || '',
    contact_person_name: data.contact_person_name || '',
    email: data.email || '',
    phone_number: data.phone_number || '',
    company_description: data.company_description || '',
    company_logo_url: data.company_logo_url || '',
    address: data.address || '',
    city: data.city || '',
    state: data.state || '',
    website: data.website || '',
    years_in_business: data.years_in_business || 0,
    specialties: data.specialties || [],
    certifications: data.certifications || [],
    service_areas: data.service_areas || [],
    business_hours: data.business_hours || {},
    social_media: data.social_media || {},
    total_products: 0,
    total_sales: 0,
    response_time: null,
    last_active: new Date(),
  });
  return sellerRef;
}

export async function getSellerProfile(uid: string) {
  const sellerRef = doc(db, "sellers", uid);
  const snap = await getDoc(sellerRef);
  return snap.exists() ? snap.data() : null;
}

export async function checkBusinessNameUnique(businessName: string, excludeSellerId?: string) {
  const sellersCol = collection(db, "sellers");
  let q = query(sellersCol, where("business_name", "==", businessName));
  
  if (excludeSellerId) {
    q = query(sellersCol, where("business_name", "==", businessName), where("__name__", "!=", excludeSellerId));
  }
  
  const snap = await getDocs(q);
  return snap.empty;
}

export async function updateSellerProfile(uid: string, data: any) {
  const sellerRef = doc(db, "sellers", uid);
  
  // Check if business name is being updated and if it's unique
  if (data.business_name) {
    const isUnique = await checkBusinessNameUnique(data.business_name, uid);
    if (!isUnique) {
      throw new Error("Business name already exists. Please choose a different name.");
    }
  }
  
  await updateDoc(sellerRef, { 
    ...data, 
    updated_at: new Date(),
    last_active: new Date(),
    profile_completed: true
  });
}

export async function getAllSellers() {
  const sellersCol = collection(db, "sellers");
  const q = query(sellersCol, where("is_verified", "==", true));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// --- INSTALLERS ---
export async function createInstallerProfile(uid: string, data: any) {
  const installerRef = doc(db, "installers", uid);
  await setDoc(installerRef, {
    ...data,
    created_at: new Date(),
    updated_at: new Date(),
    average_rating: 0,
    review_count: 0,
    is_featured: false,
    is_verified: false,
    is_available: true,
    completed_installations: 0,
    total_earnings: 0,
  });
  return installerRef;
}

export async function getInstallerProfile(uid: string) {
  const installerRef = doc(db, "installers", uid);
  const snap = await getDoc(installerRef);
  return snap.exists() ? snap.data() : null;
}

export async function updateInstallerProfile(uid: string, data: any) {
  const installerRef = doc(db, "installers", uid);
  await updateDoc(installerRef, { ...data, updated_at: new Date() });
}

export async function getAllInstallers() {
  const installersCol = collection(db, "installers");
  const q = query(installersCol, where("is_verified", "==", true));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// --- INSTALLER LEADS ---
export async function getLeadsForInstaller(installerId: string) {
  const leadsCol = collection(db, "leads");
  const q = query(leadsCol, where("target_user_id", "==", installerId), where("lead_type", "==", "installation"));
  const snap = await getDocs(q);
  return snap.docs
    .map(doc => ({ id: doc.id, ...doc.data() }))
    .sort((a: any, b: any) => {
      const dateA = a.created_at?.toDate?.() || a.created_at || new Date(0);
      const dateB = b.created_at?.toDate?.() || b.created_at || new Date(0);
      return dateB.getTime() - dateA.getTime();
    });
}

export async function updateLeadStatus(leadId: string, status: string, installerNotes?: string) {
  const leadRef = doc(db, "leads", leadId);
  await updateDoc(leadRef, { 
    status, 
    installer_notes: installerNotes,
    updated_at: new Date() 
  });
}

// --- INSTALLER REVIEWS ---
export async function getReviewsForInstaller(installerId: string) {
  const reviewsCol = collection(db, "reviews");
  const q = query(reviewsCol, where("reviewed_entity_id", "==", installerId), where("reviewed_entity_type", "==", "installer"));
  const snap = await getDocs(q);
  return snap.docs
    .map(doc => ({ id: doc.id, ...doc.data() }))
    .sort((a: any, b: any) => {
      const dateA = a.created_at?.toDate?.() || a.created_at || new Date(0);
      const dateB = b.created_at?.toDate?.() || b.created_at || new Date(0);
      return dateB.getTime() - dateA.getTime();
    });
}

// --- INSTALLER AVAILABILITY ---
export async function updateInstallerAvailability(installerId: string, availability: any) {
  const installerRef = doc(db, "installers", installerId);
  await updateDoc(installerRef, { 
    availability,
    updated_at: new Date() 
  });
}

// --- INSTALLER STATISTICS ---
export async function getInstallerStats(installerId: string) {
  const installer = await getInstallerProfile(installerId);
  const leads = await getLeadsForInstaller(installerId);
  const reviews = await getReviewsForInstaller(installerId);
  
  const completedLeads = leads.filter((lead: any) => lead.status === "completed");
  const pendingLeads = leads.filter((lead: any) => lead.status === "pending");
  const totalEarnings = completedLeads.reduce((sum: number, lead: any) => sum + (lead.amount || 0), 0);
  
  return {
    total_leads: leads.length,
    completed_leads: completedLeads.length,
    pending_leads: pendingLeads.length,
    total_earnings: totalEarnings,
    average_rating: installer?.average_rating || 0,
    review_count: reviews.length,
    is_available: installer?.is_available || false,
  };
}

// --- PRODUCTS ---
export async function addProduct(data: any) {
  // data: { seller_id, title, description, price, ... }
  const productsCol = collection(db, "products");
  const docRef = await addDoc(productsCol, {
    ...data,
    created_at: new Date(),
    updated_at: new Date(),
    status: "active",
    views_count: 0,
    rating: 0,
    review_count: 0,
  });
  return docRef;
}

export async function getProduct(productId: string) {
  const productRef = doc(db, "products", productId);
  const snap = await getDoc(productRef);
  return snap.exists() ? snap.data() : null;
}

export async function getAllProducts(limitCount: number = 20) {
  const productsCol = collection(db, "products");
  const q = query(productsCol, where("status", "==", "active"), orderBy("created_at", "desc"), limit(limitCount));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function getProductsBySeller(sellerId: string) {
  const productsCol = collection(db, "products");
  const q = query(productsCol, where("seller_id", "==", sellerId));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function updateProduct(productId: string, data: any) {
  const productRef = doc(db, "products", productId);
  await updateDoc(productRef, { ...data, updated_at: new Date() });
}

export async function deleteProduct(productId: string) {
  const productRef = doc(db, "products", productId);
  await deleteDoc(productRef);
}

// --- SAVED PRODUCTS (BUYER FUNCTIONALITY) ---
export async function saveProductForUser(userId: string, productId: string) {
  const savedProductsCol = collection(db, "saved_products");
  const docRef = await addDoc(savedProductsCol, {
    user_id: userId,
    product_id: productId,
    saved_at: new Date(),
  });
  return docRef;
}

export async function removeSavedProduct(userId: string, productId: string) {
  const savedProductsCol = collection(db, "saved_products");
  const q = query(savedProductsCol, where("user_id", "==", userId), where("product_id", "==", productId));
  const snap = await getDocs(q);
  if (!snap.empty) {
    await deleteDoc(snap.docs[0].ref);
  }
}

export async function getSavedProductsForUser(userId: string) {
  const savedProductsCol = collection(db, "saved_products");
  const q = query(savedProductsCol, where("user_id", "==", userId));
  const snap = await getDocs(q);
  // Sort in memory to avoid requiring a composite index
  return snap.docs
    .map(doc => ({ id: doc.id, ...doc.data() }))
    .sort((a: any, b: any) => {
      const dateA = a.saved_at?.toDate?.() || a.saved_at || new Date(0);
      const dateB = b.saved_at?.toDate?.() || b.saved_at || new Date(0);
      return dateB.getTime() - dateA.getTime();
    });
}

export async function isProductSavedByUser(userId: string, productId: string) {
  const savedProductsCol = collection(db, "saved_products");
  const q = query(savedProductsCol, where("user_id", "==", userId), where("product_id", "==", productId));
  const snap = await getDocs(q);
  return !snap.empty;
}

// --- INQUIRIES (BUYER FUNCTIONALITY) ---
export async function createInquiry(data: any) {
  // data: { buyer_id, seller_id, product_id, message, ... }
  const inquiriesCol = collection(db, "inquiries");
  const docRef = await addDoc(inquiriesCol, {
    ...data,
    created_at: new Date(),
    status: "pending",
    is_read: false,
  });
  return docRef;
}

export async function getInquiriesForBuyer(buyerId: string) {
  const inquiriesCol = collection(db, "inquiries");
  const q = query(inquiriesCol, where("buyer_id", "==", buyerId));
  const snap = await getDocs(q);
  // Sort in memory to avoid requiring a composite index
  return snap.docs
    .map(doc => ({ id: doc.id, ...doc.data() }))
    .sort((a: any, b: any) => {
      const dateA = a.created_at?.toDate?.() || a.created_at || new Date(0);
      const dateB = b.created_at?.toDate?.() || b.created_at || new Date(0);
      return dateB.getTime() - dateA.getTime();
    });
}

export async function getInquiriesForSeller(sellerId: string) {
  const inquiriesCol = collection(db, "inquiries");
  const q = query(inquiriesCol, where("seller_id", "==", sellerId));
  const snap = await getDocs(q);
  // Sort in memory to avoid requiring a composite index
  return snap.docs
    .map(doc => ({ id: doc.id, ...doc.data() }))
    .sort((a: any, b: any) => {
      const dateA = a.created_at?.toDate?.() || a.created_at || new Date(0);
      const dateB = b.created_at?.toDate?.() || b.created_at || new Date(0);
      return dateB.getTime() - dateA.getTime();
    });
}

export async function updateInquiryStatus(inquiryId: string, status: string) {
  const inquiryRef = doc(db, "inquiries", inquiryId);
  await updateDoc(inquiryRef, { status, updated_at: new Date() });
}

// --- REVIEWS ---
export async function addReview(data: any) {
  // data: { reviewer_id, reviewed_entity_id, reviewed_entity_type, rating, comment, ... }
  const reviewsCol = collection(db, "reviews");
  const docRef = await addDoc(reviewsCol, {
    ...data,
    created_at: new Date(),
    is_verified_purchase: false,
  });
  return docRef;
}

export async function getReviewsForEntity(entityId: string, entityType: string) {
  const reviewsCol = collection(db, "reviews");
  const q = query(reviewsCol, where("reviewed_entity_id", "==", entityId), where("reviewed_entity_type", "==", entityType));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// --- LEADS ---
export async function addLead(data: any) {
  // data: { customer_id, target_user_id, product_id, inquiry_message, ... }
  const leadsCol = collection(db, "leads");
  const docRef = await addDoc(leadsCol, {
    ...data,
    created_at: new Date(),
    status: "new",
    is_chargeable: false,
  });
  return docRef;
}

export async function getLeadsForUser(userId: string) {
  const leadsCol = collection(db, "leads");
  const q = query(leadsCol, where("target_user_id", "==", userId));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// --- TRANSACTIONS ---
export async function addTransaction(data: any) {
  // data: { payer_id, type, amount, ... }
  const transactionsCol = collection(db, "transactions");
  const docRef = await addDoc(transactionsCol, {
    ...data,
    created_at: new Date(),
    status: "pending",
  });
  return docRef;
}

export async function getTransactionsForUser(userId: string) {
  const transactionsCol = collection(db, "transactions");
  const q = query(transactionsCol, where("payer_id", "==", userId));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
} 

// --- FIREBASE STORAGE HELPERS ---

// Image compression helper
function compressImage(file: File, maxWidth: number = 1920, quality: number = 0.8): Promise<File> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions maintaining aspect ratio
      let { width, height } = img;
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const compressedFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now(),
          });
          resolve(compressedFile);
        } else {
          resolve(file); // Fallback to original file
        }
      }, file.type, quality);
    };
    
    img.src = URL.createObjectURL(file);
  });
}

export async function uploadImage(file: File, path: string): Promise<string> {
  // Compress image if it's larger than 2MB
  let fileToUpload = file;
  if (file.size > 2 * 1024 * 1024) {
    fileToUpload = await compressImage(file);
  }
  
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, fileToUpload);
  return await getDownloadURL(snapshot.ref);
}

// Upload image and return path instead of URL
export async function uploadImageGetPath(file: File, path: string): Promise<string> {
  // Compress image if it's larger than 2MB
  let fileToUpload = file;
  if (file.size > 2 * 1024 * 1024) {
    fileToUpload = await compressImage(file);
  }
  
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, fileToUpload);
  return path; // Return the path instead of URL
}

// Get URL from path
export async function getImageUrl(path: string): Promise<string> {
  const storageRef = ref(storage, path);
  return await getDownloadURL(storageRef);
}

// Get URLs from paths array
export async function getImageUrls(paths: string[]): Promise<string[]> {
  const urlPromises = paths.map(path => getImageUrl(path));
  return Promise.all(urlPromises);
}

export async function uploadProductImages(files: File[], sellerId: string, productId: string): Promise<string[]> {
  const uploadPromises = files.map(async (file, index) => {
    const fileName = `${Date.now()}_${index}_${file.name}`;
    const path = `products/${sellerId}/${productId}/${fileName}`;
    return await uploadImageGetPath(file, path); // Return paths instead of URLs
  });
  
  return Promise.all(uploadPromises);
}

export async function deleteImage(imageUrl: string): Promise<void> {
  try {
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
  } catch (error) {
    console.error('Error deleting image:', error);
  }
}

// Delete image by path
export async function deleteImageByPath(path: string): Promise<void> {
  try {
    const imageRef = ref(storage, path);
    await deleteObject(imageRef);
  } catch (error) {
    console.error('Error deleting image:', error);
  }
} 

/**
 * Fetch a product by ID and join seller info as a nested object.
 * Returns the canonical product model for UI/components.
 */
export async function getProductWithSeller(productId: string) {
  const productRef = doc(db, "products", productId);
  const productSnap = await getDoc(productRef);
  if (!productSnap.exists()) return null;
  const product = { id: productSnap.id, ...productSnap.data() };
  let seller = null;
  if (product.seller_id) {
    const sellerSnap = await getDoc(doc(db, "sellers", product.seller_id));
    if (sellerSnap.exists()) {
      seller = { id: sellerSnap.id, ...sellerSnap.data() };
    }
  }
  return {
    ...product,
    seller,
  };
} 

/**
 * Fetch all products and join seller info for each.
 * Returns an array of canonical product models for UI/components.
 */
export async function getAllProductsWithSellers(limitCount: number = 20) {
  const productsCol = collection(db, "products");
  const q = query(productsCol, limit(limitCount));
  const snap = await getDocs(q);
  const products = await Promise.all(
    snap.docs.map(async docSnap => {
      const product = { id: docSnap.id, ...docSnap.data() };
      let seller = null;
      if (product.seller_id) {
        const sellerSnap = await getDoc(doc(db, "sellers", product.seller_id));
        if (sellerSnap.exists()) {
          seller = { id: sellerSnap.id, ...sellerSnap.data() };
        }
      }
      return { ...product, seller };
    })
  );
  return products;
} 