import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {Card} from 'react-native-paper';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import SkeletonContent from "react-native-skeleton-content";

import {GlobalStyles} from '../Globals';

export default class AnnouncementCard extends Component {

	static propTypes = {
	    titleText: PropTypes.string,
	    bodyText: PropTypes.string,
	    buttonText: PropTypes.string,
	    buttonOnPress: PropTypes.func,
	    isLoading: PropTypes.bool
  	}

	render() {
    	const { titleText, bodyText, buttonText, buttonOnPress, isLoading } = this.props;
    	return (
    		<Card elevation={5} style={styles.announcementCard}>
	        	<Card.Content>
	        		<SkeletonContent
		              containerStyle={styles.announcementTitleContainer}
		              isLoading={isLoading}
		              layout={[
		              { width: 100, height: 25,},
		              { width: 75, height: 34, marginBottom: 6, borderRadius: global.CURRENT_THEME.roundness },
		              ]}
		            >
		          		<Text style={[GlobalStyles.titleText,styles.announcementTitleText]}>{titleText}</Text>
		          		<View style={styles.announcementButtonContainer}>
		            		<TouchableOpacity style={styles.announcementButton} onPress = {buttonOnPress}>
		              			<Text style={[GlobalStyles.bodyText,styles.announcementButtonText]}>{buttonText}</Text>
		            		</TouchableOpacity>
		        		</View>
		            </SkeletonContent>
		            <SkeletonContent
		              containerStyle={styles.skeletonContainer}
		              isLoading={isLoading}
		              layout={[
		              { width: 300, height: 20, marginBottom: 6},
		              { width: 250, height: 20, marginBottom: 6 },
		              ]}
		            >
		            	{bodyText && <Text style={[GlobalStyles.bodyText,styles.announcementBodyText]}>{bodyText}</Text>}
		            </SkeletonContent>
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
		marginBottom: 25,
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
		fontSize: 16,
		color: global.CURRENT_THEME.colors.text,
		marginBottom: 10
	},
	skeletonContainer: {
    	flex: 1
  	}
});