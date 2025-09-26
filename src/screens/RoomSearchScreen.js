/**
 * Room Search Screen
 * iPhone-style room search with PDF display and markers
 */

import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import PDFViewer from '../components/PDFViewer';

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

const RoomSearchScreen = ({route, navigation}) => {
  const {buildingName, buildingManager} = route.params;
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [infoText, setInfoText] = useState('Klar til søgning! Indtast et lokale nummer ovenfor.');

  useEffect(() => {
    // Set navigation title
    navigation.setOptions({
      title: buildingName.charAt(0).toUpperCase() + buildingName.slice(1),
    });
  }, [buildingName, navigation]);

  const searchRoom = async () => {
    if (!searchQuery.trim()) {
      Alert.alert('Input Fejl', 'Indtast venligst et lokale nummer');
      return;
    }

    try {
      setLoading(true);
      setInfoText('Søger...');

      // Search for room
      const result = buildingManager.searchRoom(searchQuery);

      if (!result) {
        setInfoText(`Lokale "${searchQuery}" ikke fundet`);
        setSearchResult(null);
        return;
      }

      // Get room and floor info
      const {room, floor, pdfPath} = result;

      // Find nearest entrance
      const nearestEntrance = buildingManager.getNearestEntrance(room.x, room.y);

      // Update info
      let entranceText = '';
      if (nearestEntrance) {
        entranceText = ' • Orange prik viser nærmeste indgang';
      }

      setInfoText(`Fandt "${room.id}" på ${floor}${entranceText}`);
      
      // Set search result
      setSearchResult({
        room,
        floor,
        pdfPath,
        nearestEntrance,
      });

    } catch (error) {
      console.error('Search error:', error);
      setInfoText(`Fejl ved søgning: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    navigation.goBack();
  };

  const handleSubmitEditing = () => {
    searchRoom();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Building Navigation</Text>
        <Text style={styles.subtitle}>
          {buildingName.charAt(0).toUpperCase() + buildingName.slice(1)}
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Text style={styles.backButtonText}>← Tilbage til bygninger</Text>
        </TouchableOpacity>

        <Text style={styles.searchTitle}>Søg efter lokale</Text>

        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Indtast lokale nummer"
          placeholderTextColor="#8e8e93"
          onSubmitEditing={handleSubmitEditing}
          returnKeyType="search"
          autoCapitalize="characters"
          autoCorrect={false}
        />

        <TouchableOpacity
          style={[styles.searchButton, loading && styles.searchButtonDisabled]}
          onPress={searchRoom}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.searchButtonText}>Søg</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>{infoText}</Text>
      </View>

      <View style={styles.pdfContainer}>
        {searchResult ? (
          <PDFViewer
            pdfPath={searchResult.pdfPath}
            room={searchResult.room}
            entrance={searchResult.nearestEntrance}
          />
        ) : (
          <View style={styles.emptyPdfContainer}>
            <Text style={styles.emptyPdfText}>
              {loading ? 'Indlæser...' : 'Søg efter et lokale for at se etageplan'}
            </Text>
          </View>
        )}
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
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  searchTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1c1c1e',
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1c1c1e',
    borderWidth: 1,
    borderColor: '#d1d1d6',
    marginBottom: 16,
  },
  searchButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  searchButtonDisabled: {
    backgroundColor: '#8e8e93',
  },
  searchButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  infoContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  infoText: {
    fontSize: 14,
    color: '#8e8e93',
    textAlign: 'center',
    lineHeight: 20,
  },
  pdfContainer: {
    flex: 1,
    marginHorizontal: 20,
    marginBottom: 40,
    borderRadius: 12,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  emptyPdfContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
  },
  emptyPdfText: {
    fontSize: 16,
    color: '#8e8e93',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});

export default RoomSearchScreen;