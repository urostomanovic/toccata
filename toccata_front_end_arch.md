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

## 🚀 **Strategija Razvoja Velike Aplikacije - AI Assistant Preporuke**

### **1. Arhitekturna Strategija**

#### **Modularna Struktura:**
- **Feature-based organizacija** umesto type-based
- **Svaki modul** (Keys, Rooms, Alarms) ima svoj folder
- **Shared components** u centralnom `components/` folderu
- **Custom hooks** za business logic

#### **State Management:**
- **Context API** za global state (već implementirano ReservationsContext)
- **Zustand** ili **Redux Toolkit** za kompleksniji state
- **React Query** za server state management

### **2. Development Workflow**

#### **Code Organization:**
```
app/
├── keys/
│   ├── components/          # Keys-specific components
│   ├── hooks/              # Custom hooks
│   ├── utils/              # Helper functions
│   └── types/              # TypeScript interfaces
├── rooms/
│   ├── components/
│   ├── hooks/
│   └── utils/
└── shared/
    ├── components/          # Reusable components
    ├── hooks/              # Common hooks
    ├── utils/              # Utility functions
    └── constants/          # App constants
```

#### **Component Strategy:**
- **Atomic design** principi
- **Composition over inheritance**
- **Props drilling** rešiti sa Context ili custom hooks

### **3. Performance Optimizacija**

#### **Code Splitting:**
- **Dynamic imports** za velike komponente
- **Route-based splitting** u Next.js
- **Lazy loading** za modale i kalendare

#### **Memoization:**
- **React.memo** za expensive komponente
- **useMemo** i **useCallback** za heavy calculations
- **Virtualization** za velike liste (react-window)

### **4. Testing Strategija**

#### **Testing Pyramid:**
- **Unit tests** za utility funkcije
- **Component tests** sa React Testing Library
- **Integration tests** za API endpoints
- **E2E tests** za kritične user flows

### **5. Development Tools**

#### **Code Quality:**
- **ESLint** sa strict rules
- **Prettier** za consistent formatting
- **Husky** za pre-commit hooks
- **TypeScript** za type safety

#### **Monitoring:**
- **Error boundaries** za graceful error handling
- **Performance monitoring** (Core Web Vitals)
- **User analytics** za UX insights

### **6. Deployment Strategy**

#### **Environment Management:**
- **Development** - local mock data
- **Staging** - test database
- **Production** - real database

#### **CI/CD Pipeline:**
- **Automated testing** na push
- **Code quality checks**
- **Automated deployment**

### **7. Dokumentacija**

#### **Code Documentation:**
- **JSDoc** komentari za funkcije
- **README** za svaki modul
- **API documentation** sa OpenAPI/Swagger
- **Component storybook** za UI komponente

### **8. Preporučena Implementacija za TOCCATA**

#### **Kratkoročno (1-2 nedelje):**
1. **Reorganizuj** postojeće fajlove po modulima
2. **Izdvoji** shared komponente
3. **Kreiraj** custom hooks za business logic

#### **Srednjoročno (1-2 meseca):**
1. **Implementiraj** proper state management
2. **Dodaj** error boundaries
3. **Setup** testing framework

#### **Dugoročno (3+ meseca):**
1. **Performance optimization**
2. **Advanced testing**
3. **Monitoring i analytics**

### **9. Ključne Prednosti Ove Strategije**

- **Skalabilnost** - lako dodavanje novih modula
- **Održivost** - jasna struktura i organizacija
- **Performance** - optimizacija i code splitting
- **Quality** - testing i monitoring
- **Team Development** - jasne konvencije i workflow

---

*Dokument kreiran: 31.08.2025*
*Status: Analiza završena, čeka odluku tima*
*Strategija razvoja dodana: 31.08.2025*
