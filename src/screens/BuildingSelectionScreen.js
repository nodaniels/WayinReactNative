/**
 * Building Selection Screen
 * iPhone-style building navigation screen
 */

import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import BuildingManager from '../services/BuildingManager';

const {width: screenWidth} = Dimensions.get('window');

const BuildingSelectionScreen = ({navigation}) => {
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buildingManager] = useState(() => new BuildingManager('bygninger'));

  useEffect(() => {
    loadAvailableBuildings();
  }, []);

  const loadAvailableBuildings = async () => {
    try {
      setLoading(true);
      const availableBuildings = await buildingManager.getAvailableBuildings();
      setBuildings(availableBuildings);
    } catch (error) {
      console.error('Error loading buildings:', error);
      Alert.alert('Fejl', 'Kunne ikke indlæse bygninger');
    } finally {
      setLoading(false);
    }
  };

  const selectBuilding = async (buildingName) => {
    try {
      setLoading(true);
      const success = await buildingManager.loadBuildingFloors(buildingName);
      
      if (success) {
        navigation.navigate('RoomSearch', {
          buildingName,
          buildingManager,
        });
      } else {
        Alert.alert('Fejl', `Kunne ikke indlæse ${buildingName}. Tjek PDF filer.`);
      }
    } catch (error) {
      console.error('Error selecting building:', error);
      Alert.alert('Fejl', `Fejl ved indlæsning: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const renderBuildingButton = (buildingName) => (
    <TouchableOpacity
      key={buildingName}
      style={styles.buildingButton}
      onPress={() => selectBuilding(buildingName)}
      disabled={loading}>
      <Text style={styles.buildingButtonText}>
        {buildingName.charAt(0).toUpperCase() + buildingName.slice(1)}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Building Navigation</Text>
          <Text style={styles.subtitle}>Indlæser...</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Indlæser bygninger...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Building Navigation</Text>
        <Text style={styles.subtitle}>Vælg bygning</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Vælg bygning</Text>
        
        <View style={styles.buildingsContainer}>
          {buildings.length > 0 ? (
            buildings.map(renderBuildingButton)
          ) : (
            <Text style={styles.noBuildingsText}>
              Ingen bygninger fundet i assets mappen
            </Text>
          )}
        </View>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          {buildings.length > 0
            ? 'Vælg en bygning for at søge efter lokaler'
            : 'Kontroller at PDF-filer er tilgængelige'}
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1c1c1e',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#8e8e93',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1c1c1e',
    marginBottom: 20,
  },
  buildingsContainer: {
    flex: 1,
  },
  buildingButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buildingButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  noBuildingsText: {
    fontSize: 16,
    color: '#8e8e93',
    textAlign: 'center',
    marginTop: 40,
  },
  infoContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  infoText: {
    fontSize: 14,
    color: '#8e8e93',
    textAlign: 'center',
    lineHeight: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#8e8e93',
    marginTop: 16,
  },
});

export default BuildingSelectionScreen;