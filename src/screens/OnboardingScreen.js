import React, {Component} from 'react';
import { View, Text, StyleSheet, Image} from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';
import { SplashScreen } from 'expo';
import { Ionicons } from '@expo/vector-icons';

const styles = StyleSheet.create({
  image: {
    width: 250,
    height: 250
  },
  title: {
    fontFamily: 'circularstd-book'
  },
  subtitle: {
    fontFamily: 'circularstd-book',
    fontSize: 20
  }
});

const onboardingPages = [
      {
        backgroundColor: global.LOGO_BLUE,
        image: <Image style={styles.image} resizeMode="contain" source={require('../../assets/images/onboarding_turbovote.png')} />,
        title: 'Sign up with TurboVote to play',
        subtitle: 'TurboVote helps you register, request absentee ballots, and get reminders about registration deadlines, upcoming elections, and where to vote.',
      },
      {
        backgroundColor: 'black',
        image: <Ionicons name="md-calendar" size={250} color={global.LOGO_BLUE} />,
        title: 'Play every night',
        subtitle: 'Choose the most popular answer to earn points!',
      },
      {
        backgroundColor: global.LOGO_RED,
        image: <Image style={styles.image} source={require('../../assets/images/onboarding_drop.png')} />,
        title: 'Race to the top to get the drop',
        subtitle: "Get on the podium at the end of the week by playing the game and inviting friends to win a gift card from the drop!",
      },
    ]


class OnboardingScreen extends Component {

	constructor(props) {
    super(props);

    this.advance = this.advance.bind(this);
  }

  componentDidMount() {
    SplashScreen.hide();
  }

  advance() {
    this.props.navigation.navigate('SignIn')
  }

	render() {
		return (
			<Onboarding
        pages={onboardingPages}
        transitionAnimationDuration={200}
        onDone={this.advance}
        onSkip={this.advance}
        titleStyles={styles.title}
        subTitleStyles={styles.subtitle}
      />
		);
	}
}

module.exports= OnboardingScreen