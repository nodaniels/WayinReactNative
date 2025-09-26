/**
 * Building Manager Service
 * Converted from Python BuildingManager class
 */

import RNFS from 'react-native-fs';
import {Platform} from 'react-native';

class BuildingManager {
  constructor(buildingsBasePath) {
    this.buildingsBasePath = buildingsBasePath;
    this.availableBuildings = [];
    this.currentBuilding = null;
    this.floors = {}; // floor_name -> PDF path
    this.allRooms = {}; // floor_name -> rooms array
    this.allEntrances = {}; // floor_name -> entrances array
  }

  /**
   * Scan for available buildings in the assets folder
   */
  async getAvailableBuildings() {
    try {
      // For React Native, we'll use a predefined list since we can't scan dynamically
      // In production, this could come from an API or be bundled with the app
      const buildings = ['porcelaenshaven', 'solbjerg'];
      
      // Verify buildings exist by checking for at least one PDF file
      const availableBuildings = [];
      
      for (const building of buildings) {
        try {
          const buildingPath = `${this.buildingsBasePath}/${building}`;
          // Check if building directory exists by trying to read it
          const exists = await this.checkBuildingExists(building);
          if (exists) {
            availableBuildings.push(building);
          }
        } catch (error) {
          console.log(`Building ${building} not found:`, error.message);
        }
      }
      
      this.availableBuildings = availableBuildings;
      return availableBuildings;
    } catch (error) {
      console.error('Error scanning buildings:', error);
      return [];
    }
  }

  /**
   * Check if a building exists by looking for PDF files
   */
  async checkBuildingExists(buildingName) {
    try {
      // In React Native, we need to check the bundled assets
      // This is a simplified check - in production you might use a different approach
      const testFile = `${this.buildingsBasePath}/${buildingName}/stue.pdf`;
      
      // For now, we'll assume the buildings exist if they're in our predefined list
      return ['porcelaenshaven', 'solbjerg'].includes(buildingName);
    } catch (error) {
      return false;
    }
  }

  /**
   * Load all PDF files for a specific building
   */
  async loadBuildingFloors(buildingName) {
    try {
      console.log(`Loading building: ${buildingName}`);
      
      // Clear previous data
      this.floors = {};
      this.allRooms = {};
      this.allEntrances = {};

      const buildingPath = `${this.buildingsBasePath}/${buildingName}`;
      
      // Predefined floor files for each building
      const floorFiles = {
        'porcelaenshaven': ['stue.pdf', '1_sal.pdf', '2_sal.pdf', '3_sal.pdf', '4_sal.pdf'],
        'solbjerg': ['stue.pdf', '1_sal.pdf', '2_sal.pdf', '3_sal.pdf', '4_sal.pdf', '5_sal.pdf']
      };

      const floors = floorFiles[buildingName] || [];

      for (const filename of floors) {
        const pdfPath = `${buildingPath}/${filename}`;
        const floorName = filename.replace('.pdf', '');
        
        console.log(`Loading floor: ${floorName}`);
        
        // Store PDF path
        this.floors[floorName] = pdfPath;
        
        // Extract text data (simulated for now)
        const {rooms, entrances} = await this.extractTextFromPDF(pdfPath, floorName);
        
        this.allRooms[floorName] = rooms;
        this.allEntrances[floorName] = entrances;
        
        console.log(`  -> ${rooms.length} rooms, ${entrances.length} entrances`);
      }

      this.currentBuilding = buildingName;
      return Object.keys(this.floors).length > 0;
    } catch (error) {
      console.error(`Error loading building ${buildingName}:`, error);
      return false;
    }
  }

  /**
   * Extract text from PDF (simulated - in production you'd use a PDF parsing library)
   */
  async extractTextFromPDF(pdfPath, floorName) {
    // This is simulated data based on the Python prototype
    // In production, you'd use a React Native PDF text extraction library
    
    const mockRoomData = {
      'stue': [
        { id: 'PH-D1.01', text: 'PH-D1.01', x: 0.2, y: 0.3 },
        { id: 'PH-D1.02', text: 'PH-D1.02', x: 0.4, y: 0.3 },
        { id: 'PH-D1.03', text: 'PH-D1.03', x: 0.6, y: 0.3 },
        { id: 'A.0.01', text: 'A.0.01', x: 0.3, y: 0.5 },
        { id: 'A.0.02', text: 'A.0.02', x: 0.5, y: 0.5 },
      ],
      '1_sal': [
        { id: 'A.1.01', text: 'A.1.01', x: 0.2, y: 0.4 },
        { id: 'A.1.02', text: 'A.1.02', x: 0.4, y: 0.4 },
        { id: 'A.1.03', text: 'A.1.03', x: 0.6, y: 0.4 },
        { id: 'PH-D1.11', text: 'PH-D1.11', x: 0.3, y: 0.6 },
      ],
      '2_sal': [
        { id: 'A.2.01', text: 'A.2.01', x: 0.25, y: 0.35 },
        { id: 'A.2.02', text: 'A.2.02', x: 0.45, y: 0.35 },
        { id: 'A.2.03', text: 'A.2.03', x: 0.65, y: 0.35 },
      ],
      '3_sal': [
        { id: 'A.3.01', text: 'A.3.01', x: 0.3, y: 0.4 },
        { id: 'A.3.02', text: 'A.3.02', x: 0.5, y: 0.4 },
      ],
      '4_sal': [
        { id: 'A.4.01', text: 'A.4.01', x: 0.35, y: 0.45 },
        { id: 'A.4.02', text: 'A.4.02', x: 0.55, y: 0.45 },
      ],
      '5_sal': [
        { id: 'A.5.01', text: 'A.5.01', x: 0.4, y: 0.5 },
      ]
    };

    const mockEntranceData = {
      'stue': [
        { text: 'Hovedindgang', x: 0.1, y: 0.8 },
        { text: 'Sideindgang', x: 0.9, y: 0.6 }
      ]
    };

    const rooms = mockRoomData[floorName] || [];
    const entrances = mockEntranceData[floorName] || [];

    return { rooms, entrances };
  }

  /**
   * Search for a room across all floors (case insensitive, exact match)
   */
  searchRoom(roomQuery) {
    const query = roomQuery.toUpperCase().trim();
    
    for (const [floorName, rooms] of Object.entries(this.allRooms)) {
      for (const room of rooms) {
        if (room.id === query) {
          return {
            room: room,
            floor: floorName,
            pdfPath: this.floors[floorName]
          };
        }
      }
    }
    
    return null;
  }

  /**
   * Find nearest entrance (prefer ground floor if available)
   */
  getNearestEntrance(roomX, roomY) {
    // Try ground floor first
    const groundFloorCandidates = Object.keys(this.allEntrances).filter(floorName => 
      floorName.toLowerCase().includes('stue') || 
      floorName.toLowerCase().includes('ground') || 
      floorName === '0'
    );

    const targetFloors = groundFloorCandidates.length > 0 
      ? groundFloorCandidates 
      : Object.keys(this.allEntrances);

    let allEntrances = [];
    for (const floorName of targetFloors) {
      if (this.allEntrances[floorName]) {
        allEntrances = allEntrances.concat(this.allEntrances[floorName]);
      }
    }

    if (allEntrances.length === 0) {
      return null;
    }

    // Find closest entrance using Euclidean distance
    let minDistance = Infinity;
    let nearestEntrance = null;

    for (const entrance of allEntrances) {
      const distance = Math.sqrt(
        Math.pow(entrance.x - roomX, 2) + Math.pow(entrance.y - roomY, 2)
      );
      
      if (distance < minDistance) {
        minDistance = distance;
        nearestEntrance = entrance;
      }
    }

    return nearestEntrance;
  }

  /**
   * Get PDF path for a specific floor
   */
  getPDFPath(floorName) {
    return this.floors[floorName];
  }
}

export default BuildingManager;