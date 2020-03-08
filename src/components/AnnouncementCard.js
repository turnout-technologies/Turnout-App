import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {Card} from 'react-native-paper';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {GlobalStyles} from '../Globals';

export default class AnnouncementCard extends Component {

	static propTypes = {
	    titleText: PropTypes.string,
	    bodyText: PropTypes.string,
	    buttonText: PropTypes.string,
	    buttonOnPress: PropTypes.func
  	}

	render() {
    	const { titleText, bodyText, buttonText, buttonOnPress } = this.props;
    	return (
    		<Card elevation={5} style={styles.announcementCard}>
	        	<Card.Content>
	            	<View style={styles.announcementTitleContainer}>
	              		<Text style={[GlobalStyles.titleText,styles.announcementTitleText]}>{titleText}</Text>
	              		<View style={styles.announcementButtonContainer}>
	                		<TouchableOpacity style={styles.announcementButton} onPress = {buttonOnPress}>
	                  			<Text style={[GlobalStyles.bodyText,styles.announcementButtonText]}>{buttonText}</Text>
	                		</TouchableOpacity>
	            		</View>
	            	</View>
	            	{bodyText && <Text style={[GlobalStyles.bodyText,styles.announcementBodyText]}>{bodyText}</Text>}
	          	</Card.Content>
	        </Card>
    	);
	}
}

const styles = StyleSheet.create({
	announcementCard: {
		backgroundColor: global.CURRENT_THEME.colors.background,
		marginHorizontal: 10,
		borderRadius: 20,
		marginBottom: 20,
	},
	announcementTitleContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginHorizontal: 0,
	},
	announcementTitleText: {
		fontSize: 16,
		alignSelf: "center"
	},
	announcementButtonContainer: {
	    minHeight: 34,
	    alignSelf:'center',
	},
	announcementButton: {
		flex: 1,
		paddingVertical: 5,
		paddingHorizontal: 10,
		justifyContent: "center",
	    backgroundColor: 'rgba(0, 0, 0, 0)',
	    borderRadius: global.CURRENT_THEME.roundness,
	    borderColor: global.CURRENT_THEME.colors.primary,
	    borderWidth: 1
	},
	announcementButtonText: {
	    color: global.CURRENT_THEME.colors.primary,
	    textAlign: "center",
	    fontSize: 16
	},
	announcementBodyText: {
		fontSize: 14,
		color: global.CURRENT_THEME.colors.text,
		marginTop: 25,
		marginBottom: 10
	},
});