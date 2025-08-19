# TOCCATA Frontend Arhitektura - Multi-Hotel Analiza

## 🏨 **Trenutna arhitektura (Single Hotel)**

```
TOCCATA Web App
├── /rooms (sve sobe)
├── /keys (ključevi)
├── /alarms (alarmi)
├── /reports (izveštaji)
└── /settings (podešavanja)
```

## 🚀 **Multi-Hotel arhitektura (Predložena)**

### **Opcija A: Dinamički routing**
```
TOCCATA Platform
├── /hotels
│   ├── /[hotelId]/rooms
│   ├── /[hotelId]/keys
│   ├── /[hotelId]/alarms
│   ├── /[hotelId]/reports
│   └── /[hotelId]/settings
├── /admin (super admin)
└── /api/hotels/[hotelId]/* (hotel-specific API)
```

### **Opcija B: Subdomain pristup**
```
hotel1.toccata.com/rooms
hotel2.toccata.com/rooms
hotel3.toccata.com/rooms
```

### **Opcija C: Query parametri**
```
toccata.com/rooms?hotel=hotel1
toccata.com/rooms?hotel=hotel2
```

## 📊 **Komparacija opcija**

### **Opcija A (Dinamički routing)**
**Prednosti:**
- ✅ Jedan kod za sve hotele
- ✅ Lakše održavanje
- ✅ Centralizovana logika
- ✅ Next.js App Router podrška
- ✅ Jednostavniji deployment

**Mane:**
- ❌ Kompleksniji state management
- ❌ Potrebna izolacija podataka po hotelu

### **Opcija B (Subdomains)**
**Prednosti:**
- ✅ Potpuna izolacija hotela
- ✅ Lakše skaliranje
- ✅ Različiti deployment-i

**Mane:**
- ❌ Više servera/domena
- ❌ Kompleksniji DNS setup
- ❌ Dupliranje koda
- ❌ Kompleksniji SSL sertifikati

### **Opcija C (Query parametri)**
**Prednosti:**
- ✅ Jednostavno implementirati
- ✅ Brza implementacija

**Mane:**
- ❌ URL-ovi su duži i manje elegantni
- ❌ SEO problemi
- ❌ Teže bookmarkovanje

## 🏗️ **Preporučena arhitektura: Hybrid pristup**

### **Struktura:**
```
TOCCATA Platform
├── /hotels/[hotelId]/* (dinamički routing)
├── /admin (super admin)
├── /api/hotels/[hotelId]/* (hotel-specific API)
└── /config/hotels/[hotelId].json (hotel config)
```

### **Konfiguracija po hotelu:**
```json
// config/hotels/hotel-1.json
{
  "hotelId": "hotel-1",
  "name": "Hotel Belgrade",
  "description": "Luxury hotel in Belgrade",
  "floors": 10,
  "roomsPerFloor": 20,
  "apiEndpoint": "https://hotel1.toccata.com/api",
  "timezone": "Europe/Belgrade",
  "features": ["spa", "restaurant", "conference"],
  "branding": {
    "logo": "/logos/hotel-1.png",
    "colors": {
      "primary": "#1f2937",
      "secondary": "#3b82f6"
    }
  }
}
```

## 🔧 **Tehnička implementacija**

### **1. Hotel Context**
```javascript
// contexts/HotelContext.js
export const HotelContext = createContext();

export function HotelProvider({ hotelId, children }) {
  const [hotelConfig, setHotelConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Hotel-specific state and logic
  return (
    <HotelContext.Provider value={{ hotelId, hotelConfig, loading }}>
      {children}
    </HotelContext.Provider>
  );
}
```

### **2. Dinamički API routes**
```javascript
// app/api/hotels/[hotelId]/rooms/route.js
export async function GET(request, { params }) {
  const { hotelId } = params;
  const hotelConfig = await getHotelConfig(hotelId);
  
  // Fetch hotel-specific rooms
  const rooms = await fetchHotelRooms(hotelConfig.apiEndpoint);
  
  return NextResponse.json({ success: true, rooms });
}
```

### **3. Dinamičke stranice**
```javascript
// app/hotels/[hotelId]/rooms/page.jsx
export default function HotelRoomsPage({ params }) {
  const { hotelId } = params;
  
  return (
    <HotelProvider hotelId={hotelId}>
      <HotelRoomsContent />
    </HotelProvider>
  );
}
```

## 🎯 **Ključne odluke za tim**

### **1. Routing strategija**
- **Preporučeno:** Dinamički routing (`/hotels/[hotelId]/*`)
- **Razlog:** Jedan kod, lakše održavanje, Next.js optimizacije

### **2. Konfiguracija**
- **Preporučeno:** JSON fajlovi po hotelu
- **Razlog:** Jednostavno, verzioniranje, deployment

### **3. API arhitektura**
- **Preporučeno:** Hotel-specific API endpoints
- **Razlog:** Izolacija, sigurnost, skalabilnost

### **4. State management**
- **Preporučeno:** React Context + hotel-specific state
- **Razlog:** Jednostavnost, performanse, izolacija

### **5. Deployment**
- **Preporučeno:** Single deployment sa hotel konfiguracijama
- **Razlog:** Jednostavnost, lakše održavanje

## 🚀 **Faze implementacije**

### **Faza 1: Osnova**
- [ ] Hotel context i provider
- [ ] Dinamički routing setup
- [ ] Hotel konfiguracija

### **Faza 2: API integracija**
- [ ] Hotel-specific API routes
- [ ] Konfiguracija po hotelu
- [ ] Error handling

### **Faza 3: UI/UX**
- [ ] Hotel branding
- [ ] Responsive design
- [ ] Performance optimizacije

### **Faza 4: Admin panel**
- [ ] Super admin funkcionalnosti
- [ ] Hotel management
- [ ] User management

## 📋 **Pitanja za tim**

1. **Koliko hotela planiramo da podržimo?**
2. **Da li su hoteli potpuno izolovani ili imaju zajedničke funkcionalnosti?**
3. **Kakva je strategija deployment-a?**
4. **Da li je potrebna multi-tenancy izolacija?**
5. **Kakva je strategija backup-a i disaster recovery?**

## ✅ **Zaključak**

**Preporučujem dinamički routing pristup sa:**
- Jednim kodom za sve hotele
- Hotel-specific konfiguracijom
- Centralizovanim API-jem
- Skalabilnim rešenjem

**Ova arhitektura omogućava:**
- Lakše održavanje
- Brže development
- Bolje performanse
- Jednostavniji deployment

---

*Dokument kreiran: 19.08.2025*
*Status: Analiza završena, čeka odluku tima*
