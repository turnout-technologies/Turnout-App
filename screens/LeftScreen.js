import React, {Component} from 'react';
import { View, StyleSheet, Text, UIManager, FlatList, TouchableOpacity } from 'react-native';
import Backdrop from 'react-native-material-backdrop'
import { MaterialIcons } from '@expo/vector-icons';

import {GlobalStyles} from '../Globals';
import StatusBarBackground from '../components/StatusBarBackground';
import Podium from '../components/Podium'
import LeaderboardFilter from '../components/LeaderboardFilter'

const animationExperimental = UIManager.setLayoutAnimationEnabledExperimental;

const FRIENDS_LABEL="Friends";
const SCHOOL_LABEL="School";
const ALL_LABEL="All";
const TODAY_LABEL="Today";
const THISWEEK_LABEL="This Week";
const ALLTIME_LABEL="All Time";
const FRIENDS_ICON_LABEL="people";
const SCHOOL_ICON_LABEL="school";
const ALL_ICON_LABEL="public";
const TODAY_ICON_LABEL="view-day";
const THISWEEK_ICON_LABEL="view-week";
const ALLTIME_ICON_LABEL="view-module";

class LeftScreen extends Component {

  constructor() {
    super();
    this.state = {peopleFilterSelected: "All", timeFilterSelected: "Today"};
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
          buttonActivatorDisabled={true}
          backLayerStyle={{backgroundColor: global.CURRENT_THEME.colors.primary}}
          backLayerConcealed={this.renderBackLayerConcealed}
          backRevealedElementsConfig={[
            {el: this.renderBackLayerRevealed, offset: 125}
          ]}
          frontLayerStyle={{marginBottom:50, backgroundColor: global.CURRENT_THEME.colors.background}}>

          <View style={GlobalStyles.frontLayerContainer}>
            <Podium leaders={global.LEADERBOARD_DATA.slice(0,3)}/>
            <FlatList
              data={global.LEADERBOARD_DATA.slice(3)}
              renderItem={({ item, separators }) => (
                <View style={styles.listItemContainer} >
                  <View style={styles.listItemsLeftAlignContainer}>
                    <Text style={[GlobalStyles.bodyText, styles.listItemTitle]}>{item.position}</Text>
                    <MaterialIcons
                      name="account-circle"
                      size={50}
                      style={{ marginLeft: 25 }}
                      color={global.CURRENT_THEME.colors.text}
                    />
                    <View style={styles.listItemTitlesContainer}>
                      <Text style={[GlobalStyles.bodyText, styles.listItemTitle]}>{item.name}</Text>
                      <Text style={[GlobalStyles.bodyText, styles.listItemSubtitle]}>{item.schoolName}</Text>
                    </View>
                  </View>
                  <Text style={[GlobalStyles.bodyText, styles.listItemTitle, {textAlign: 'right'}]}>{item.points}</Text>
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

  getIconName(label) {
    switch(label) {
      case FRIENDS_LABEL:
        return FRIENDS_ICON_LABEL;
      case SCHOOL_LABEL:
        return SCHOOL_ICON_LABEL;
      case ALL_LABEL:
        return ALL_ICON_LABEL;
      case TODAY_LABEL:
        return TODAY_ICON_LABEL;
      case THISWEEK_LABEL:
        return THISWEEK_ICON_LABEL;
      case ALLTIME_LABEL:
        return ALLTIME_ICON_LABEL;
    }
  }

  selectPeopleFilter(peopleFilterLabel) {
    this.setState({peopleFilterSelected: peopleFilterLabel});
    this.backdrop.toggleLayout();
  }

  selectTimeFilter(timeFilterLabel) {
    this.setState({timeFilterSelected: timeFilterLabel});
    this.backdrop.toggleLayout();
  }

  renderBackLayerConcealed = () => {
    return (
      <View style={styles.backdropHeader} >
        {/*<TouchableOpacity style={styles.backArrow} onPress = { () => this.backdrop.toggleLayout()}>
          <MaterialIcons
            name="arrow-back"
            size={25}
            color={global.CURRENT_THEME.colors.accent}
          />
        </TouchableOpacity>*/}
        <TouchableOpacity style={styles.backdropHeader} onPress = { () => this.backdrop.toggleLayout()}>
          <LeaderboardFilter icon={this.getIconName(this.state.peopleFilterSelected)} text={this.state.peopleFilterSelected} selected={true}/>
          <View style={{marginHorizontal: 10, borderLeftColor:'white',borderLeftWidth:1,height:'50%'}}/>
          <LeaderboardFilter icon={this.getIconName(this.state.timeFilterSelected)} text={this.state.timeFilterSelected} selected={true}/>
        </TouchableOpacity>
      </View>
    )
  }

  renderBackLayerRevealed = () => {
    return (
      <View style={styles.backdropExpandedContainer} >
        <View style={styles.backdropExpandedFilterColumn}>
          <TouchableOpacity style={{marginBottom: 5}} onPress = { () => this.selectPeopleFilter(FRIENDS_LABEL)}>
            <LeaderboardFilter icon={FRIENDS_ICON_LABEL} text={FRIENDS_LABEL} selected={this.state.peopleFilterSelected == FRIENDS_LABEL}/>
          </TouchableOpacity>
          <TouchableOpacity style={{marginBottom: 5}} onPress = { () => this.selectPeopleFilter(SCHOOL_LABEL)}>
            <LeaderboardFilter icon={SCHOOL_ICON_LABEL} text={SCHOOL_LABEL} selected={this.state.peopleFilterSelected == SCHOOL_LABEL}/>
          </TouchableOpacity>
          <TouchableOpacity onPress = { () => this.selectPeopleFilter(ALL_LABEL)}>
            <LeaderboardFilter icon={ALL_ICON_LABEL} text={ALL_LABEL} selected={this.state.peopleFilterSelected == ALL_LABEL}/>
          </TouchableOpacity>
        </View>
        <View style={{marginHorizontal: 10, borderLeftColor:'white',borderLeftWidth:1,height:'75%'}}/>
        <View style={styles.backdropExpandedFilterColumn}>
          <TouchableOpacity style={{marginBottom: 5}} onPress = { () => this.selectTimeFilter(TODAY_LABEL)}>
            <LeaderboardFilter icon={TODAY_ICON_LABEL} text={TODAY_LABEL} selected={this.state.timeFilterSelected == TODAY_LABEL}/>
          </TouchableOpacity>
          <TouchableOpacity style={{marginBottom: 5}} onPress = { () => this.selectTimeFilter(THISWEEK_LABEL)}>
            <LeaderboardFilter icon={THISWEEK_ICON_LABEL} text={THISWEEK_LABEL} selected={this.state.timeFilterSelected == THISWEEK_LABEL}/>
          </TouchableOpacity>
          <TouchableOpacity onPress = { () => this.selectTimeFilter(ALLTIME_LABEL)}>
            <LeaderboardFilter icon={ALLTIME_ICON_LABEL} text={ALLTIME_LABEL} selected={this.state.timeFilterSelected == ALLTIME_LABEL}/>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

LeftScreen.navigationOptions = {
  headerStyle: GlobalStyles.headerStyle
};

const styles = StyleSheet.create({
  backArrow: {
    position: "absolute",
    left:10,
  },
  backdropHeader: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  backdropExpandedContainer: {
    height: 125,
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center"
  },
  backdropExpandedFilterColumn: {
    alignItems: "flex-start",
    justifyContent: "space-between",
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
    fontSize: 15
  },
  listItemSubtitle: {
    color: global.CURRENT_THEME.colors.text_opacity5,
    fontSize: 12
  }
});

module.exports= LeftScreen