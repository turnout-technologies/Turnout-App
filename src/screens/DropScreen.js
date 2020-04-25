import React, {Component} from 'react';
import { View, SafeAreaView, Text, StyleSheet, ScrollView, Image, ActivityIndicator, TouchableOpacity, FlatList, AppState} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
var moment = require('moment-timezone');

import {GlobalStyles} from '../Globals';
import Countdown from '../components/Countdown';
import * as API from '../APIClient';
import StatusBarBackground from '../components/StatusBarBackground';
import {getDrop, setDrop} from '../AsyncStorage';

const LIST_ITEM_IMAGE_SIZE = 60;
const INACTIVE_COLOR = "#C0C0C0";

class DropScreen extends Component {

	constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      drop: null,
      appState: AppState.currentState,
      dropActive: false,
      gameStarted: false
    };

    this.fetchDrop = this.fetchDrop.bind(this);
    this.onTimerExpired = this.onTimerExpired.bind(this);
  }

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
    this.checkIfGameStarted();
    this.fetchDrop();
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = (nextAppState) => {
    this.checkIfGameStarted();
    this.setState({appState: nextAppState});
  }

  checkIfGameStarted() {
   this.setState({gameStarted: moment() > global.GAME_START_DATE});
  }

  async fetchDrop() {
    this.setState({isLoading: true});
    try {
      var drop = JSON.parse(await getDrop());
      if (!drop || moment() >= moment.unix(drop.endDate)) {
        drop = (await API.getLiveDrop()).data.drop;
        setDrop(drop);
      }
      drop = this.processWinnersList(drop);
      global.drop = drop;
      const dropActive = (moment() <= moment.unix(drop.endDate)) || drop.active;
      this.setState({drop: drop, isLoading: false, dropActive});
      this.updateHeader(drop.active)
    } catch (error) {
      this.setState({isLoading: false});
      console.log(error);
    }
  }

  static navigationOptions = ({navigation}) => {
    if (navigation.state.params != undefined) {
      return {
        headerStyle: {
          backgroundColor: navigation.state.params.headerBackground,
          elevation: 0,
        },
        headerTintColor: global.CURRENT_THEME.colors.accent,
        title: null
      }
    } else {
      return {
        title: null,
        headerStyle: GlobalStyles.headerStyle,
        headerTintColor: global.CURRENT_THEME.colors.accent,
      }
    }
  }

  updateHeader(active) {
    this.props.navigation.setParams({
      headerBackground: active ? global.CURRENT_THEME.colors.primary : INACTIVE_COLOR
    });
  }

  onTimerExpired() {
    this.fetchDrop();
  }

  getCircleBackgroundColor(position) {
    switch(position) {
      case 1:
        return "#F3B50A";
      case 2:
        return "#BCBDBF";
      case 3:
        return "#B53F25";
    }
  }

  getFullName(user) {
    return user.firstName + " " + user.lastName;
  }

  processWinnersList(drop) {
    if (drop.active || drop.winners.length == 0) {
      return drop;
    }
    drop.winners[0].name = this.getFullName(drop.winners[0]);
    drop.winners[0].position = 1;
    var prevPoints = -1;
    var curPosition = 1;
    for (var i = 1; i < drop.winners.length; i++) {
      drop.winners[i].name = this.getFullName(drop.winners[i]);
      if (drop.winners[i].points == drop.winners[i-1].points) {
        drop.winners[i].position = curPosition;
      } else {
        drop.winners[i].position = i+1;
        curPosition = i+1;
      }
    }
    return drop;
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
        <Text style={[GlobalStyles.bodyText, styles.currentDropTitle]}>Last Drop</Text>
        <Image
          style={styles.currentDropImage}
          source={{uri: "http://pngimg.com/uploads/amazon/amazon_PNG24.png"}}
        />
        <Text style={[GlobalStyles.titleText, styles.settingHeaderText]}>Winners</Text>
        {this.renderSeparator()}
      </View>
    );
  }

	render() {
    if (!this.state.gameStarted) {
      return (
        <SafeAreaView style={[GlobalStyles.backLayerContainer, {backgroundColor: INACTIVE_COLOR}]}>
          <StatusBarBackground/>
          <View style={styles.countdownContainer}>
            <Text style={[GlobalStyles.bodyText,styles.dropStartsInText]}>Stay tuned for{"\n"}the first drop...</Text>
          </View>
          <View style={GlobalStyles.frontLayerContainer}>
            <View style={styles.loadingSpinnerContainer}>
              <Text style={[GlobalStyles.titleText,styles.pollStatusText]}>Game starts on {global.GAME_START_DATE.format("M/D")}</Text>
              <Ionicons
                name="md-stopwatch"
                size={100}
                style={{ alignSelf: "center", marginVertical: 10 }}
                color={global.CURRENT_THEME.colors.primary}
              />
              <Text style={[GlobalStyles.bodyText,styles.pollStatusText]}>In the meantime, invite your friends to start earning power-ups!</Text>
            </View>
          </View>
        </SafeAreaView>
      );
    } else if (this.state.isLoading) {
      return (
        <View style={styles.loadingSpinnerContainer}>
          <ActivityIndicator size={60} color={global.CURRENT_THEME.colors.primary}/>
        </View>
      );
    } else if (!this.state.drop) {
      return (
        <View style={styles.errorContainer}>
          <Ionicons name="md-warning" size={75} color={global.CURRENT_THEME.colors.accent} />
          <Text style={[GlobalStyles.bodyText, styles.errorText]}>Error getting drop data</Text>
          <TouchableOpacity onPress={this.fetchDrop}>
            <Text style={[GlobalStyles.bodyText,styles.tryAgainText]}>TRY AGAIN</Text>
          </TouchableOpacity>
        </View>
      );
    } else if (this.state.dropActive) {
      //active drop
  		return (
  			<SafeAreaView style={GlobalStyles.backLayerContainer}>
          <StatusBarBackground/>
          <View style={styles.countdownContainer}>
            <Text style={[GlobalStyles.bodyText,styles.dropEndsInText]}>Drop ends in:</Text>
            <Countdown endTime={this.state.drop.endDate} color="white" onTimerExpired={this.onTimerExpired} appState={this.state.appState}/>
          </View>
          <ScrollView style={GlobalStyles.frontLayerContainer} showsVerticalScrollIndicator={false}>
            <Text style={[GlobalStyles.bodyText, styles.currentDropTitle]}>Current Drop</Text>
            <Image
              style={styles.currentDropImage}
              source={{uri: "http://pngimg.com/uploads/amazon/amazon_PNG24.png"}}
            />
            <Text style={[GlobalStyles.titleText, styles.settingHeaderText]}>Prizes</Text>
            {this.renderSeparator()}
            <View style={styles.prizeContainer}>
              <View style={[styles.placeCircle,{backgroundColor: this.getCircleBackgroundColor(1)}]}>
                <Text style={[GlobalStyles.titleText, styles.placeCircleText]}>1st{"\n"}Place</Text>
              </View>
              <Text style={[GlobalStyles.bodyText,styles.prizeTitleText]}>$100 Gift Card</Text>
            </View>
            <View style={styles.prizeContainer}>
              <View style={[styles.placeCircle,{backgroundColor: this.getCircleBackgroundColor(2)}]}>
                <Text style={[GlobalStyles.titleText, styles.placeCircleText]}>2nd{"\n"}Place</Text>
              </View>
              <Text style={[GlobalStyles.bodyText,styles.prizeTitleText]}>$50 Gift Card</Text>
            </View>
            <View style={styles.prizeContainer}>
              <View style={[styles.placeCircle,{backgroundColor: this.getCircleBackgroundColor(3)}]}>
                <Text style={[GlobalStyles.titleText, styles.placeCircleText]}>3rd{"\n"}Place</Text>
              </View>
              <Text style={[GlobalStyles.bodyText,styles.prizeTitleText]}>$25 Gift Card</Text>
            </View>
          </ScrollView>
        </SafeAreaView>
  		);
    } else if (!this.state.dropActive) {
      //dead drop
      return (
        <SafeAreaView style={[GlobalStyles.backLayerContainer, {backgroundColor: INACTIVE_COLOR}]}>
          <StatusBarBackground/>
          <View style={styles.countdownContainer}>
            <Text style={[GlobalStyles.bodyText,styles.dropStartsInText]}>Stay tuned for{"\n"}the next drop...</Text>
          </View>
          <View style={GlobalStyles.frontLayerContainer}>
            <FlatList
              showsVerticalScrollIndicator={false}
              ListHeaderComponent = { this.FlatListHeader }
              data={this.state.drop.winners}
              renderItem={({ item, index, separators }) => (
                <View style={[styles.listItemContainer, {backgroundColor: item.id == global.user.id ? global.CURRENT_THEME.colors.primary_75 : null}]}>
                  <View style={styles.listItemsLeftAlignContainer}>
                    <Image
                      style={[styles.listItemImage, {borderColor: this.getCircleBackgroundColor(item.position)}]}
                      source={!!item.avatarURL ? {uri: item.avatarURL.replace("=s96", "=s"+LIST_ITEM_IMAGE_SIZE).replace("/thumb", "/med")} : null}
                      defaultSource={require('../../assets/images/md-contact.png')}
                    />
                    <View style={styles.listItemTitlesContainer}>
                      <Text style={[GlobalStyles.bodyText, styles.listItemTitle]}>{item.name}{item.id == global.user.id ? " 🥳🏆" : null}</Text>
                      {/*<Text style={[GlobalStyles.bodyText, styles.listItemSubtitle]}>{item.schoolName}</Text>*/}
                    </View>
                  </View>
                  <Text style={[GlobalStyles.bodyText, styles.listItemTitle, {textAlign: 'right'}]}>{item.prize}</Text>
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
              ItemSeparatorComponent={this.renderSeparator}
            />
          </View>
        </SafeAreaView>
      );
    }
	}
}

const styles = StyleSheet.create({
  countdownContainer: {
    height: 150,
    marginHorizontal: 25,
    justifyContent: "center",
  },
  currentDropTitle: {
    marginTop: 20,
    fontSize: 22,
    textAlign: "center",
    marginBottom: 10
  },
  currentDropImage: {
    height: 80,
    resizeMode: "contain"
  },
  dropEndsInText: {
    textAlign: "center",
    fontSize: 20,
    color: global.CURRENT_THEME.colors.accent
  },
  prizeContainer: {
    flexDirection: "row",
    marginHorizontal: 25,
    alignItems: "center",
    marginVertical: 5
  },
  prizeTitleText: {
    textAlign: "center",
    fontSize: 20,
    marginLeft: 20,
  },
  placeCircle: {
    justifyContent: "center",
    alignItems: "center",
    width: LIST_ITEM_IMAGE_SIZE,
    height: LIST_ITEM_IMAGE_SIZE,
    borderRadius: LIST_ITEM_IMAGE_SIZE/2,
  },
  placeCircleText: {
    color: "white",
    fontSize: 16,
    textAlign: "center"
  },
  loadingSpinnerContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: global.CURRENT_THEME.colors.backgroundColor
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: global.CURRENT_THEME.colors.primary
  },
  errorText: {
    fontSize: 22,
    color: global.CURRENT_THEME.colors.accent
  },
  tryAgainText: {
    color: global.CURRENT_THEME.colors.accent,
    fontSize: 18,
    marginTop: 5
  },
  dropStartsInText: {
    textAlign: "center",
    fontSize: 30,
    color: global.CURRENT_THEME.colors.accent,
  },
  listItemContainer: {
    paddingHorizontal: 25,
    height: 80,
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
    fontSize: 20
  },
  listItemSubtitle: {
    color: global.CURRENT_THEME.colors.text_opacity5,
    fontSize: 12
  },
  listItemImage: {
    width: LIST_ITEM_IMAGE_SIZE,
    height: LIST_ITEM_IMAGE_SIZE,
    borderRadius: LIST_ITEM_IMAGE_SIZE/2,
    borderWidth: 3
  },
  settingHeaderText: {
    marginLeft: 20,
    marginTop: 15,
    marginBottom: 10,
    fontSize: 16
  },
  pollStatusText: {
    textAlign: "center",
    fontSize: 20,
    marginHorizontal: 25
  }
});

module.exports= DropScreen