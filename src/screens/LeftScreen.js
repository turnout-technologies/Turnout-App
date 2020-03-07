import React, {Component} from 'react';
import { ActivityIndicator, View, StyleSheet, Text, UIManager, FlatList, TouchableOpacity, Image } from 'react-native';
import Backdrop from 'react-native-material-backdrop'

import {GlobalStyles} from '../Globals';
import StatusBarBackground from '../components/StatusBarBackground';
import Podium from '../components/Podium';
import LeaderboardFilter from '../components/LeaderboardFilter';
import * as API from '../APIClient';

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

const LIST_ITEM_IMAGE_SIZE=50;

class LeftScreen extends Component {

  constructor() {
    super();
    this.state = {peopleFilterSelected: "All", timeFilterSelected: "Today", leaderboardData: null, podiumSize: 0};
    if (!IOS && !!animationExperimental) {
      animationExperimental(true)
    }
  }

  componentDidMount() {
    var _this = this;
    API.getLeaderboard()
      .then(function(response) {
        _this.setState({leaderboardData: _this.processLeaderboardData(response.data), podiumSize: _this.getPodiumSize(response.data)});
      })
      .catch(function (error) {
        console.log(error.response);
      });
  }

  getPodiumSize(leaderboardData) {
    if (leaderboardData.leaderboard.length <= 3) {
      return leaderboardData.leaderboard.length;
    }
    for (var i = 2; i >= 0; i--) {
      if (leaderboardData.leaderboard[i].position < leaderboardData.leaderboard[i+1].position) {
        return i+1;
      }
    }
    return 0;
  }

  processLeaderboardData(leaderboardData) {
    leaderboardData.leaderboard[0].position = 1;
    var prevPoints = -1;
    var curPosition = 1;
    for (var i = 1; i < leaderboardData.leaderboard.length; i++) {
      if (leaderboardData.leaderboard[i].points == leaderboardData.leaderboard[i-1].points) {
        leaderboardData.leaderboard[i].position = curPosition;
      } else {
        leaderboardData.leaderboard[i].position = i+1;
        curPosition = i+1;
      }
    }
    return leaderboardData;
  }

  renderSeparator = () => (
    <View
      style={{
        backgroundColor: global.CURRENT_THEME.colors.text_opacity3,
        height: 0.5,
      }}
    />
  );

  FlatListHeader = () => {
    return (
      <View>
        <Podium leaders={this.state.leaderboardData.leaderboard.slice(0,this.state.podiumSize)}/>
        {this.renderSeparator()}
      </View>
    );
  }

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
          frontLayerStyle={{marginBottom:50, backgroundColor: global.CURRENT_THEME.colors.background, borderRadius: global.CURRENT_THEME.roundness}}>

          <View style={GlobalStyles.frontLayerContainer}>
            { !this.state.leaderboardData &&
              <View style={styles.loadingSpinnerContainer}>
                <ActivityIndicator size={60} color={global.CURRENT_THEME.colors.primary} animating={!this.state.leaderboardData} />
              </View>
            }
            { !!this.state.leaderboardData &&
              <FlatList
                ListHeaderComponent = { this.FlatListHeader }
                data={this.state.leaderboardData.leaderboard.slice(this.state.podiumSize)}
                renderItem={({ item, index, separators }) => (
                  <View style={styles.listItemContainer} >
                    <View style={styles.listItemsLeftAlignContainer}>
                      <Text style={[GlobalStyles.bodyText, styles.listItemTitle]}>{item.position}</Text>
                      <Image
                        style={styles.listItemImage}
                        source={!!item.avatarURL ? {uri: item.avatarURL.replace("=s96", "=s"+LIST_ITEM_IMAGE_SIZE).replace("/thumb", "/med")} : null}
                        defaultSource={require('../../assets/images/md-contact.png')}
                      />
                      <View style={styles.listItemTitlesContainer}>
                        <Text style={[GlobalStyles.bodyText, styles.listItemTitle]}>{item.name}</Text>
                        {/*<Text style={[GlobalStyles.bodyText, styles.listItemSubtitle]}>{item.schoolName}</Text>*/}
                      </View>
                    </View>
                    <Text style={[GlobalStyles.bodyText, styles.listItemTitle, {textAlign: 'right'}]}>{item.points}</Text>
                  </View>
                )}
                keyExtractor={(item, index) => index.toString()}
                ItemSeparatorComponent={this.renderSeparator}
              />
            }
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
        <TouchableOpacity style={styles.backdropHeader} onPress = { () => alert('Leaderboard filters coming soon. Wait on it🙏') /*this.backdrop.toggleLayout()*/}>
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
  },
  listItemImage: {
    width: LIST_ITEM_IMAGE_SIZE,
    height: LIST_ITEM_IMAGE_SIZE,
    borderRadius: LIST_ITEM_IMAGE_SIZE/2,
    marginLeft: 25
  },
  loadingSpinnerContainer: {
    flex: 1,
    justifyContent: "center"
  }
});

module.exports= LeftScreen