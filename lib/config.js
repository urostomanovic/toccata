import hotelConfig from '../config/hotel-config.json';

// Singleton za konfiguraciju
class HotelConfigService {
  constructor() {
    this.config = hotelConfig.hotel;
    this.cache = new Map();
  }

  // Dohvati celu konfiguraciju
  getConfig() {
    return this.config;
  }

  // Dohvati sve spratove
  getFloors() {
    return this.config.floors;
  }

  // Dohvati sprat po broju
  getFloor(floorNumber) {
    return this.config.floors.find(floor => floor.floorNumber === floorNumber);
  }

  // Dohvati sve sobe
  getAllRooms() {
    return this.config.floors.flatMap(floor => 
      floor.rooms.map(room => ({
        ...room,
        floor: floor.floorNumber,
        floorName: floor.floorName
      }))
    );
  }

  // Dohvati sobu po ID-u
  getRoom(roomId) {
    const allRooms = this.getAllRooms();
    return allRooms.find(room => room.id === roomId);
  }

  // Dohvati sobe po spratu
  getRoomsByFloor(floorNumber) {
    const floor = this.getFloor(floorNumber);
    return floor ? floor.rooms : [];
  }

  // Dohvati tipove soba
  getRoomTypes() {
    return this.config.roomTypes;
  }

  // Dohvati tip sobe
  getRoomType(type) {
    return this.config.roomTypes[type];
  }

  // Dohvati parametre
  getParameters() {
    return this.config.parameters;
  }

  // Dohvati parametar
  getParameter(key) {
    return this.config.parameters[key];
  }

  // Dohvati API konfiguraciju
  getApiConfig() {
    return this.config.api;
  }

  // Transformuj vrednost parametra
  transformParameterValue(parameterKey, value) {
    const parameter = this.getParameter(parameterKey);
    if (!parameter || !value) return 'N/A';

    // Ako ima transform funkciju
    if (parameter.transform === 'divideBy10') {
      const transformed = (parseFloat(value) / 10).toFixed(1);
      return `${transformed}${parameter.unit || ''}`;
    }

    // Ako ima mapiranje vrednosti
    if (parameter.values && parameter.values[value]) {
      return parameter.values[value];
    }

    // Ako ima unit
    if (parameter.unit) {
      return `${value}${parameter.unit}`;
    }

    return value;
  }

  // Dohvati listu parametara za sobu
  getRoomParameters() {
    return Object.keys(this.config.parameters).map(key => ({
      key,
      ...this.config.parameters[key]
    }));
  }

  // Dohvati ime parametra na srpskom
  getParameterNameSr(parameterKey) {
    const parameter = this.getParameter(parameterKey);
    return parameter ? parameter.nameSr : parameterKey;
  }

  // Dohvati ikonu parametra
  getParameterIcon(parameterKey) {
    const parameter = this.getParameter(parameterKey);
    return parameter ? parameter.icon : '❓';
  }

  // Cache za dinamičke podatke
  setCache(key, value, ttl = 300000) { // 5 minuta default
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      ttl
    });
  }

  getCache(key) {
    const cached = this.cache.get(key);
    if (!cached) return null;

    if (Date.now() - cached.timestamp > cached.ttl) {
      this.cache.delete(key);
      return null;
    }

    return cached.value;
  }

  clearCache() {
    this.cache.clear();
  }
}

// Export singleton instance
export const hotelConfigService = new HotelConfigService();

// Convenience functions
export const getConfig = () => hotelConfigService.getConfig();
export const getFloors = () => hotelConfigService.getFloors();
export const getFloor = (floorNumber) => hotelConfigService.getFloor(floorNumber);
export const getAllRooms = () => hotelConfigService.getAllRooms();
export const getRoom = (roomId) => hotelConfigService.getRoom(roomId);
export const getRoomsByFloor = (floorNumber) => hotelConfigService.getRoomsByFloor(floorNumber);
export const getRoomTypes = () => hotelConfigService.getRoomTypes();
export const getRoomType = (type) => hotelConfigService.getRoomType(type);
export const getParameters = () => hotelConfigService.getParameters();
export const getParameter = (key) => hotelConfigService.getParameter(key);
export const getApiConfig = () => hotelConfigService.getApiConfig();
export const transformParameterValue = (parameterKey, value) => hotelConfigService.transformParameterValue(parameterKey, value);
export const getRoomParameters = () => hotelConfigService.getRoomParameters();
export const getParameterNameSr = (parameterKey) => hotelConfigService.getParameterNameSr(parameterKey);
export const getParameterIcon = (parameterKey) => hotelConfigService.getParameterIcon(parameterKey);
