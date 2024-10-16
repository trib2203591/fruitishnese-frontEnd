import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, FlatList, ActivityIndicator, RefreshControl, StatusBar } from 'react-native';

import { getLeaderboard } from '../../lib/axiosAPI/score'; 

const LeaderboardScreen = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    setRefreshing(true);  
    try {
      const result = await getLeaderboard(); // Call to fetch leaderboard data
      setLeaderboard(result); // Assuming the API returns an array of user data
    } catch (error) {
      setError("Error fetching leaderboard");
      console.error("Error fetching leaderboard:", error);
    } finally {
      setRefreshing(false);
      setIsLoading(false);
    }
  };

  const renderItem = ({ item, index }) => {
    let rankColor;
    let backgroundColor;

    if (index === 0) {
      rankColor = 'text-yellow-500'; 
      backgroundColor = 'bg-yellow-200';
    } else if (index === 1) {
      rankColor = 'text-gray-300'; 
      backgroundColor = 'bg-gray-200'; 
    } else if (index === 2) {
      rankColor = 'text-orange-500';
      backgroundColor = 'bg-orange-200';
    } else {
      rankColor = 'text-gray-500';
      backgroundColor = 'bg-gray-100'; 
    }
    return (
    <View className={`${backgroundColor} w-full my-2 p-4 rounded-lg shadow`}>
      <View className="flex-row justify-between items-center">
        <Text className={`${rankColor} left-6 font-bold text-lg`}>{index + 1}</Text>
        <Text className={`${rankColor}text-base font-pmedium`}>{item.username}</Text>
        <Text className={`right-6 text-base font-bold ${item.score >= 0 ? "text-green-500" : "text-red-500"}`}>{item.score}</Text>
      </View>
    </View>
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView className="bg-primary justify-center items-center flex-1">
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="bg-primary justify-center items-center flex-1">
        <Text className="text-white text-3xl">{error}</Text>
      </SafeAreaView>
    );
  }

  const ListHeader = () => (
    <View className=" bg-primary rounded-lg shadow p-4 border-4 border-secondary">
            <Text className="text-3xl text-white font-bold text-center">Leaderboard</Text>
            <View className="flex-row justify-between mt-4 p-2 rounded-lg">
              <Text className="text-lg text-white font-bold">Rank</Text>
              <Text className="text-lg text-white font-bold">Username</Text>
              <Text className="text-lg text-white font-bold">Score</Text>
            </View>
          </View>
  )
    return (
      <SafeAreaView className="bg-primary h-full pb-[26px]">
        <View className="w-full justify-center items-center h-full px-4 my-6">
          

          <FlatList
          data={leaderboard}
          renderItem={renderItem}
          ListHeaderComponent={ListHeader}
          keyExtractor={(item) => item.user_id} 
          className = "w-full pt-[10px]"
          ListEmptyComponent={() => <Text className="text-center text-lg mt-4 text-gray-500">No leaderboard data available.</Text>}
          refreshControl={
            <RefreshControl
              refreshing={refreshing} 
              onRefresh={fetchLeaderboard} 
              tintColor="#0000ff" 
            />}
          />
        </View>
      
        <StatusBar backgroundColor='#161622'
            style='inverted'
        />
    </SafeAreaView>
    );
};


export default LeaderboardScreen;
