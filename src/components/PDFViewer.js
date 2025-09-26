/**
 * PDF Viewer Component with Room and Entrance Markers
 * Displays PDF with coordinate-based visual markers
 */

import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Text,
} from 'react-native';
import Pdf from 'react-native-pdf';
import Svg, {Circle} from 'react-native-svg';

const {width: screenWidth} = Dimensions.get('window');

const PDFViewer = ({pdfPath, room, entrance}) => {
  const [pdfDimensions, setPdfDimensions] = useState({width: 0, height: 0});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const onLoadComplete = (numberOfPages, filePath, {width, height}) => {
    console.log(`PDF loaded: ${numberOfPages} pages, dimensions: ${width}x${height}`);
    setPdfDimensions({width, height});
    setLoading(false);
  };

  const onError = (error) => {
    console.error('PDF loading error:', error);
    setError(error.message || 'Fejl ved indlæsning af PDF');
    setLoading(false);
  };

  const renderMarkers = () => {
    if (!room || pdfDimensions.width === 0 || pdfDimensions.height === 0) {
      return null;
    }

    // Calculate PDF display dimensions
    const containerWidth = screenWidth - 40; // Account for padding
    const containerHeight = 400; // Fixed height for PDF display
    
    // Calculate aspect ratio and actual display size
    const pdfAspectRatio = pdfDimensions.width / pdfDimensions.height;
    const containerAspectRatio = containerWidth / containerHeight;
    
    let displayWidth, displayHeight, offsetX = 0, offsetY = 0;
    
    if (pdfAspectRatio > containerAspectRatio) {
      // PDF is wider than container
      displayWidth = containerWidth;
      displayHeight = containerWidth / pdfAspectRatio;
      offsetY = (containerHeight - displayHeight) / 2;
    } else {
      // PDF is taller than container
      displayHeight = containerHeight;
      displayWidth = containerHeight * pdfAspectRatio;
      offsetX = (containerWidth - displayWidth) / 2;
    }

    // Calculate marker positions
    const roomX = offsetX + (room.x * displayWidth);
    const roomY = offsetY + (room.y * displayHeight);
    
    let entranceX, entranceY;
    if (entrance) {
      entranceX = offsetX + (entrance.x * displayWidth);
      entranceY = offsetY + (entrance.y * displayHeight);
    }

    const markerSize = 8;

    return (
      <Svg
        style={StyleSheet.absoluteFillObject}
        width={containerWidth}
        height={containerHeight}>
        {/* Room marker (green) */}
        <Circle
          cx={roomX}
          cy={roomY}
          r={markerSize}
          fill="#4CAF50"
          stroke="#2E7D32"
          strokeWidth="2"
        />
        
        {/* Entrance marker (orange) */}
        {entrance && (
          <Circle
            cx={entranceX}
            cy={entranceY}
            r={markerSize}
            fill="#FF9800"
            stroke="#F57C00"
            strokeWidth="2"
          />
        )}
      </Svg>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Indlæser PDF...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Fejl ved indlæsning af PDF:</Text>
        <Text style={styles.errorDetail}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.pdfWrapper}>
        <Pdf
          source={{
            uri: pdfPath,
            cache: true,
          }}
          style={styles.pdf}
          onLoadComplete={onLoadComplete}
          onError={onError}
          enablePaging={false}
          enableRTL={false}
          enableAnnotationRendering={false}
          maxScale={3}
          minScale={0.5}
          scale={1}
          spacing={0}
          fitPolicy={0} // Fit width
          enableAntialiasing={true}
        />
        
        {/* Overlay markers */}
        {renderMarkers()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
  },
  pdfWrapper: {
    flex: 1,
    position: 'relative',
  },
  pdf: {
    flex: 1,
    width: screenWidth - 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
  },
  loadingText: {
    fontSize: 16,
    color: '#8e8e93',
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorDetail: {
    fontSize: 14,
    color: '#8e8e93',
    textAlign: 'center',
  },
});

export default PDFViewer;