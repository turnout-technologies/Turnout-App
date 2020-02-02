import React, {Component} from 'react';
import { View, StyleSheet, Text, UIManager, FlatList } from 'react-native';
import Backdrop from 'react-native-material-backdrop'
import { Ionicons } from '@expo/vector-icons';

import {GlobalStyles} from '../Globals';
import StatusBarBackground from '../components/StatusBarBackground';

const animationExperimental = UIManager.setLayoutAnimationEnabledExperimental;

class LeftScreen extends Component {

  constructor() {
    super()
    if (!IOS && !!animationExperimental) {
      animationExperimental(true)
    }
  }

  renderSeparator = () => (
    <View
      style={{
        backgroundColor: global.CURRENT_THEME.colors.text_opacity3,
        height: 0.5,
      }}
    />
  );

  render() {
    return (
      <View style={GlobalStyles.backLayerContainer} >
        <StatusBarBackground/>
        <Backdrop
          ref={ref => this.backdrop = ref}
          backLayerStyle={{backgroundColor: global.CURRENT_THEME.colors.primary}}
          backLayerConcealed={this.renderBackLayerConcealed}
          backRevealedElementsConfig={[
            {el: this.renderBackLayerRevealed, offset: 260}
          ]}
          frontLayerStyle={{backgroundColor: global.CURRENT_THEME.colors.background}} >

          <View style={GlobalStyles.frontLayerContainer}>
            <FlatList style={styles.leaderboardList}
              data={global.LEADERBOARD_DATA}
              renderItem={({ item, separators }) => (
                <View style={styles.listItemContainer} >
                  <View style={styles.listItemsLeftAlignContainer}>
                    <Text style={styles.listItemTitle}>{item.position}</Text>
                    <Ionicons
                      name="md-contact"
                      size={50}
                      style={{ marginLeft: 25 }}
                      color={global.CURRENT_THEME.colors.text}
                    />
                    <View style={styles.listItemTitlesContainer}>
                      <Text style={styles.listItemTitle}>{item.name}</Text>
                      <Text style={styles.listItemSubtitle}>{item.schoolName}</Text>
                    </View>
                  </View>
                  <Text style={[styles.listItemTitle, {textAlign: 'right'}]}>{item.points}</Text>
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
              ItemSeparatorComponent={this.renderSeparator}
            />
          </View>

        </Backdrop>
      </View>
    );
  }

  renderBackLayerConcealed = () => {
    return (
      <View style={styles.backdropHeader} >
        <Text style={styles.backdropHeaderTitle} >Title</Text>
      </View>
    )
  }

  renderBackLayerRevealed = () => {
    return (
      <View style={{ flex: 1 }} >
        <View style={styles.backdropHeader} >
          <Text style={styles.backdropHeaderTitle} >Settings</Text>
        </View>
        <Text style={styles.contentText} >Content</Text>
      </View>
    )
  }
}

LeftScreen.navigationOptions = {
  headerStyle: GlobalStyles.headerStyle
};

const styles = StyleSheet.create({
  backdropHeader: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backdropHeaderTitle: {
    fontSize: IOS ? 17 : 19,
    fontWeight: IOS ? '600' : '500',
    textAlign: IOS ? 'center' : 'left',
    color: 'white',
    marginLeft: 72
  },
  leaderboardList: {

  },
  listItemContainer: {
    paddingHorizontal: 25,
    height: 62.5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  listItemsLeftAlignContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  listItemTitlesContainer: {
    marginLeft: 10
  },
  listItemTitle: {
    color: global.CURRENT_THEME.colors.text,
    fontSize: 16
  },
  listItemSubtitle: {
    color: global.CURRENT_THEME.colors.text_opacity3,
    fontSize: 12
  }
});

module.exports= LeftScreen