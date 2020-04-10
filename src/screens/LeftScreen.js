import React, {Component} from 'react';
import { ActivityIndicator, View, StyleSheet, Text, UIManager, FlatList, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import {GlobalStyles} from '../Globals';
import StatusBarBackground from '../components/StatusBarBackground';
import Backdrop from '../submodules/react-native-material-backdrop/src/backdrop'
import Podium from '../components/Podium';
import LeaderboardFilter from '../components/LeaderboardFilter';
import * as API from '../APIClient';

const animationExperimental = UIManager.setLayoutAnimationEnabledExperimental;

const FRIENDS_LABEL="Friends";
const SCHOOL_LABEL="School";
const ALL_LABEL="All";
const CURRENTDROP_LABEL="Current Drop";
const ALLTIME_LABEL="All Time";
const FRIENDS_ICON_LABEL="people";
const SCHOOL_ICON_LABEL="school";
const ALL_ICON_LABEL="public";
const CURRENTDROP_ICON_LABEL="view-day";
const THISWEEK_ICON_LABEL="view-week";
const ALLTIME_ICON_LABEL="view-module";

const LIST_ITEM_IMAGE_SIZE=50;

class LeftScreen extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      peopleFilterSelected: ALL_LABEL,
      timeFilterSelected: CURRENTDROP_LABEL,
      leaderboardData: null,
      podiumSize: 0
    };
    if (!IOS && !!animationExperimental) {
      animationExperimental(true)
    }

    this.fetchLeaderboardData = this.fetchLeaderboardData.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
  }

  componentDidMount() {
    this.fetchLeaderboardData();
  }

  async fetchLeaderboardData() {
    this.setState({isLoading: true});
    try {
      var leaderboardResponse = await API.getLeaderboard();
      this.leaderboardDataFull = leaderboardResponse.data.leaderboard;
      this.processLeaderboardData();
      this.setState({isLoading: false});
    } catch (error) {
      this.setState({isLoading: false});
      console.log(error);
    }
  }

  getPodiumSize(leaderboardData) {
    if (leaderboardData.length <= 3) {
      return leaderboardData.length;
    }
    for (var i = 2; i >= 0; i--) {
      if (leaderboardData[i].position < leaderboardData[i+1].position) {
        return i+1;
      }
    }
    return 0;
  }

  getFullName(leaderBoardElement) {
    return leaderBoardElement.firstName + " " + leaderBoardElement.lastName;
  }

  checkPointsEquality(a, b) {
    if (this.state.timeFilterSelected == CURRENTDROP_LABEL) {
      return (!!a.points.live ? a.points.live : 0) == (!!b.points.live ? b.points.live : 0);
    } else {
      return (!!a.points.total ? a.points.total : 0) == (!!b.points.total ? b.points.total : 0);
    }
  }

  sortLeaderboard() {
    if (this.state.timeFilterSelected == CURRENTDROP_LABEL) {
      return this.leaderboardDataFull.sort(function(a,b) {return (a.points.live > b.points.live) ? -1 : ((b.points.live > a.points.live) ? 1 : 0);} );
    } else {
      return this.leaderboardDataFull.sort(function(a,b) {return (a.points.total > b.points.total) ? -1 : ((b.points.total > a.points.total) ? 1 : 0);} );
    }
  }

  processLeaderboardData() {
    var leaderboardData = this.sortLeaderboard();
    leaderboardData[0].name = this.getFullName(leaderboardData[0]);
    leaderboardData[0].position = 1;
    var prevPoints = -1;
    var curPosition = 1;
    for (var i = 1; i < leaderboardData.length; i++) {
      leaderboardData[i].name = this.getFullName(leaderboardData[i]);
      if (this.checkPointsEquality(leaderboardData[i], leaderboardData[i-1])) {
        leaderboardData[i].position = curPosition;
      } else {
        leaderboardData[i].position = i+1;
        curPosition = i+1;
      }
    }
    this.setState({leaderboardData, podiumSize: this.getPodiumSize(leaderboardData)});
  }

  getPoints(user) {
    if (this.state.timeFilterSelected == CURRENTDROP_LABEL) {
      return !!user.points.live ? user.points.live : 0;
    } else {
      return !!user.points.total ? user.points.total : 0;
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

  FlatListHeader = () => {
    return (
      <View>
        <Podium timeFilterSelected={this.state.timeFilterSelected} leaders={this.state.leaderboardData.slice(0,this.state.podiumSize)}/>
        {this.renderSeparator()}
      </View>
    );
  }

  onRefresh() {
    this.setState({isLoading: true});
    this.fetchLeaderboardData();
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
          frontLayerStyle={styles.frontLayerStyle}>

          <View style={GlobalStyles.frontLayerContainer}>
            { this.state.isLoading &&
              <View style={styles.loadingSpinnerContainer}>
                <ActivityIndicator size={60} color={global.CURRENT_THEME.colors.primary} animating={!this.state.leaderboardData} />
              </View>
            }
            { !this.state.leaderboardData && !this.state.isLoading &&
              <View style={styles.errorContainer}>
                <Ionicons name="md-warning" size={75} color={global.CURRENT_THEME.colors.text_opacity5} />
                <Text style={[GlobalStyles.bodyText, styles.errorText]}>Error getting leaderboard data</Text>
                <TouchableOpacity onPress={this.fetchLeaderboardData}>
                  <Text style={[GlobalStyles.bodyText,styles.tryAgainText]}>TRY AGAIN</Text>
                </TouchableOpacity>
              </View>
            }
            { !!this.state.leaderboardData &&
              <FlatList
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.isLoading}
                    onRefresh={this.onRefresh}
                    colors={[global.CURRENT_THEME.colors.primary]} />
                }
                showsVerticalScrollIndicator={false}
                ListHeaderComponent = { this.FlatListHeader }
                data={this.state.leaderboardData.slice(this.state.podiumSize)}
                renderItem={({ item, index, separators }) => (
                  <View style={[styles.listItemContainer, {backgroundColor: item.id == global.user.id ? global.CURRENT_THEME.colors.primary_75 : null}]} >
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
                    <Text style={[GlobalStyles.bodyText, styles.listItemTitle, {textAlign: 'right'}]}>{this.getPoints(item)}</Text>
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
      case CURRENTDROP_LABEL:
        return CURRENTDROP_ICON_LABEL;
      case ALLTIME_LABEL:
        return ALLTIME_ICON_LABEL;
    }
  }

  selectPeopleFilter(peopleFilterLabel) {
    this.setState({peopleFilterSelected: peopleFilterLabel});
    this.backdrop.toggleLayout();
  }

  selectTimeFilter(timeFilterLabel) {
    this.setState({timeFilterSelected: timeFilterLabel}, () => {this.processLeaderboardData()});
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
          <TouchableOpacity style={styles.filterItem} onPress = { () => this.selectPeopleFilter(FRIENDS_LABEL)}>
            <LeaderboardFilter icon={FRIENDS_ICON_LABEL} text={FRIENDS_LABEL} selected={this.state.peopleFilterSelected == FRIENDS_LABEL}/>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterItem} onPress = { () => this.selectPeopleFilter(SCHOOL_LABEL)}>
            <LeaderboardFilter icon={SCHOOL_ICON_LABEL} text={SCHOOL_LABEL} selected={this.state.peopleFilterSelected == SCHOOL_LABEL}/>
          </TouchableOpacity>
          <TouchableOpacity onPress = { () => this.selectPeopleFilter(ALL_LABEL)}>
            <LeaderboardFilter icon={ALL_ICON_LABEL} text={ALL_LABEL} selected={this.state.peopleFilterSelected == ALL_LABEL}/>
          </TouchableOpacity>
        </View>
        <View style={styles.verticalSeparator}/>
        <View style={styles.backdropExpandedFilterColumn}>
          <TouchableOpacity style={styles.filterItem} onPress = { () => this.selectTimeFilter(CURRENTDROP_LABEL)}>
            <LeaderboardFilter icon={CURRENTDROP_ICON_LABEL} text={CURRENTDROP_LABEL} selected={this.state.timeFilterSelected == CURRENTDROP_LABEL}/>
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
  frontLayerStyle: {
    marginBottom: 50,
    backgroundColor: global.CURRENT_THEME.colors.background,
    borderRadius: global.CURRENT_THEME.roundness
  },
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
  verticalSeparator: {
    marginHorizontal: 10,
    borderLeftColor: global.CURRENT_THEME.colors.accent,
    borderLeftWidth:1,
    height:'75%'
  },
  filterItem: {
    marginBottom: 5
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
  },
  errorContainer: {
    flex: 0.85,
    justifyContent: "center",
    alignItems: "center"
  },
  errorText: {
    fontSize: 22,
    color: global.CURRENT_THEME.colors.text_opacity5
  },
  tryAgainText: {
    color: global.CURRENT_THEME.colors.primary,
    fontSize: 18,
    marginTop: 5
  },
});

module.exports= LeftScreen