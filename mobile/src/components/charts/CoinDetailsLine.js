// @flow

import React, { Component } from 'react';
import { Dimensions, LayoutAnimation, StyleSheet, View } from 'react-native';
import {
  Group,
  Path,
  Surface,
  Shape,
} from 'react-native/Libraries/ART/ReactNativeART';

import type { ThemeColorsData } from '../../types';

import { colors } from '../../utils/constants';

type DefaultProps = {
  fillColor: string,
  strokeColor: string,
  strokeWidth: number,
};

type Props = {
  values: Array<number>,
  fillColor: string,
  strokeColor: string,
  strokeWidth: number,
  theme: ThemeColorsData,
};

type State = {
  width: number,
  height: number,
};

class CoinDetailsLine extends Component<DefaultProps, Props, State> {
  static defaultProps = {
    fillColor: colors.primaryLight,
    strokeColor: colors.primary,
    strokeWidth: 8,
  };

  state = {
    width: Dimensions.get('window').width,
    height: 0,
  };

  // TODO: Check warning with animation
  componentWillUpdate() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }

  _onLayout = (event: Object) => {
    const { nativeEvent: { layout: { width, height } } } = event;

    this.setState({ width, height });
  };

  _buildPath = (values: Array<number>) => {
    const { strokeWidth } = this.props;

    const { width, height } = this.state;

    let firstPoint: boolean = true;

    let previous: { x: number, y: number };

    const minValue = Math.min(...values);
    const maxValue = Math.max(...values) - minValue;

    const stepX = width / (values.length - 1 || 1);

    const stepY = maxValue ? (height - strokeWidth * 2) / maxValue : 0;

    const adjustedValues = values.map(value => value - minValue);

    const path = Path().moveTo(-strokeWidth, strokeWidth);

    adjustedValues.forEach((number, index) => {
      const x = index * stepX;
      const y = -number * stepY - strokeWidth;

      if (firstPoint) {
        path.lineTo(-strokeWidth, y);
      } else {
        path.curveTo(
          previous.x + stepX / 3,
          previous.y,
          x - stepX / 3,
          y,
          x,
          y,
        );
      }

      previous = { x, y };

      firstPoint = false;
    });

    return path.lineTo(width + strokeWidth, strokeWidth).close();
  };

  render() {
    const { theme, values, fillColor, strokeColor, strokeWidth } = this.props;
    const { width, height } = this.state;
    return (
      <View style={[styles.root, { backgroundColor: theme.cardBackground }]} onLayout={this._onLayout}>
        <View style={styles.wrapper}>
          <Surface width={width} height={height}>
            <Group x={0} y={height}>
              <Shape
                d={this._buildPath(values)}
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
              />
            </Group>
          </Surface>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 30,
    paddingTop: 20,
  },
  wrapper: {
    flex: 1,
    justifyContent: 'flex-end',
  }
})

export default CoinDetailsLine;
