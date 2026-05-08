import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../lib/firebaseConfig";

export async function getCourierRankings(city?: string) {
  try {
    const couriersRef = collection(db, "couriers");
    let q = query(couriersRef);
    
    if (city) {
      q = query(couriersRef, where("city", "==", city));
    }
    
    const querySnapshot = await getDocs(q);
    const rankings = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return rankings;
  } catch (error) {
    console.error("Error fetching courier rankings:", error);
    return [];
  }
}

export async function calculateReturnRisk(city: string) {
  try {
    const ordersRef = collection(db, "orders");
    const q = query(ordersRef, where("city", "==", city));
    const querySnapshot = await getDocs(q);
    
    const orders = querySnapshot.docs.map(doc => doc.data());
    if (orders.length === 0) return "Low"; // Default if no data
    
    const rtoOrders = orders.filter(order => order.status === "RTO").length;
    const rtoRate = (rtoOrders / orders.length) * 100;
    
    if (rtoRate > 20) return "High";
    if (rtoRate > 10) return "Medium";
    return "Low";
  } catch (error) {
    console.error("Error calculating return risk:", error);
    return "Unknown";
  }
}
