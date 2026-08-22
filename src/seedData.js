import { db } from './firebase';
import { doc, setDoc } from 'firebase/firestore';

const initialData = {
  affiliates: {
    "081298765432": {
      fullName: "Dewi Anggraini",
      email: "dewi.anggraini@gmail.com",
      whatsapp: "081298765432",
      telegram: "@dewianggraini",
      city: "Jakarta Selatan",
      province: "DKI Jakarta",
      bankOrEwallet: "BCA",
      accountNumber: "1234567890",
      password: "password123",
      role: "user",
      saldo: 168000,
      totalEarned: 4200000,
      totalWithdrawn: 4032000,
      affiliateId: "KNT-DEWI01",
      affiliateLink: "https://kineti-affiliate-app-nu.vercel.app/?ref=KNT-DEWI01",
      trainingFeePaid: true,
      createdAt: new Date().toISOString()
    },
    "081344556677": {
      fullName: "Rizky Pratama",
      email: "rizky.mentor@kinetiaffiliate.com",
      whatsapp: "081344556677",
      telegram: "@rizkytech",
      city: "Bandung",
      province: "Jawa Barat",
      bankOrEwallet: "Mandiri",
      accountNumber: "9876543210",
      password: "password123",
      role: "mentor",
      saldo: 1500000,
      affiliateId: "KNT-MTR01",
      affiliateLink: "https://kineti-affiliate-app-nu.vercel.app/?ref=KNT-MTR01",
      trainingFeePaid: true,
      createdAt: new Date().toISOString()
    },
    "081255554444": {
      fullName: "Finance Admin",
      email: "finance@kinetiaffiliate.com",
      whatsapp: "081255554444",
      telegram: "@adminfinance",
      city: "Jakarta Pusat",
      province: "DKI Jakarta",
      bankOrEwallet: "BCA",
      accountNumber: "8877665544",
      password: "password123",
      role: "admin",
      saldo: 0,
      affiliateId: "KNT-ADM01",
      affiliateLink: "https://kineti-affiliate-app-nu.vercel.app/?ref=KNT-ADM01",
      trainingFeePaid: true,
      createdAt: new Date().toISOString()
    },
    "081200000001": {
      fullName: "Super User Admin",
      email: "root@kinetiaffiliate.com",
      whatsapp: "081200000001",
      telegram: "@superkineti",
      city: "Jakarta Pusat",
      province: "DKI Jakarta",
      bankOrEwallet: "BCA",
      accountNumber: "1122334455",
      password: "password123",
      role: "superadmin",
      saldo: 25000000,
      affiliateId: "KNT-ROOT01",
      affiliateLink: "https://kineti-affiliate-app-nu.vercel.app/?ref=KNT-ROOT01",
      trainingFeePaid: true,
      createdAt: new Date().toISOString()
    }
  },
  products: {
    "prod_1": { id: 1, title: "Course Video AI Mastery", category: "Digital Course", platform: "TikTok", price: 250000, fee: 75000, commissionRate: "30%", isActive: true },
    "prod_2": { id: 2, title: "Wireless Earbuds Pro Max", category: "ELECTRONICS", platform: "Shopee", price: 299000, fee: 35880, commissionRate: "12%", isActive: true },
    "prod_3": { id: 3, title: "Smart Fitness Watch X9", category: "WEARABLES", platform: "Shopee", price: 459000, fee: 68850, commissionRate: "15%", isActive: true },
    "prod_4": { id: 4, title: "Viral LED Ring Light 18 Inch", category: "CREATOR TOOLS", platform: "TikTok", price: 189000, fee: 37800, commissionRate: "20%", isActive: true },
    "prod_5": { id: 5, title: "Serum Wajah Retinol Glow Bundle", category: "BEAUTY", platform: "TikTok", price: 249000, fee: 54780, commissionRate: "22%", isActive: true },
    "prod_6": { id: 6, title: "Portable USB-C Smoothie Blender", category: "HOME & LIVING", platform: "Shopee", price: 175000, fee: 24500, commissionRate: "14%", isActive: true }
  },
  transactions: {
    "TRX-8801": { transactionId: "TRX-8801", affiliateWa: "081298765432", type: "jualan", productId: 1, productTitle: "Course Video AI Mastery", platform: "TikTok", feeEarned: 75000, status: "berhasil", saldoAfter: 168000, createdAt: new Date().toISOString() },
    "TRX-8802": { transactionId: "TRX-8802", affiliateWa: "081298765432", type: "beli_sendiri", productId: 1, productTitle: "Course Video AI Mastery (Beli Sendiri)", platform: "TikTok", feeEarned: 0, status: "berhasil", saldoAfter: 379200, createdAt: new Date().toISOString() }
  },
  withdrawals: {
    "WD-3301": { withdrawalId: "WD-3301", affiliateWa: "081298765432", userName: "Dewi Anggraini", bank: "BCA", accountNumber: "1234567890", amount: 286200, status: "Approved", createdAt: new Date().toISOString() }
  }
};

export async function uploadInitialDataToFirestore() {
  for (const [coll, docs] of Object.entries(initialData)) {
    for (const [id, data] of Object.entries(docs)) {
      await setDoc(doc(db, coll, id), data);
    }
  }
  alert("Seluruh data awal JSON berhasil masuk ke Firebase!");
}
