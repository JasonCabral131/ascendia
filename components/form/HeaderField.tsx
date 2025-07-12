/** @format */

import React, { memo } from 'react';
import { StyleSheet } from 'react-native';
import { Text } from '@/components/Themed';

interface HeaderFieldProps {
  text: string;
}

const HeaderField = memo<HeaderFieldProps>(({ text }) => {
  return <Text style={styles.headerText}>{text}</Text>;
});

HeaderField.displayName = 'HeaderField';

const styles = StyleSheet.create({
  headerText: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 24,
    marginTop: 16,
    textAlign: 'center',
    letterSpacing: 0.5,
    lineHeight: 34,
  },
});

export default HeaderField;
