import { Tabs } from "expo-router";
import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { useCategoryStore } from "@/app/store/useCategoryStore";

export default function TabLayout() {
  const { setSelectedCategory } = useCategoryStore();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#4F46E5",
        tabBarInactiveTintColor: "#9CA3AF",
        headerShown: true,
        headerStyle: {
          backgroundColor: "#FFFFFF",
          elevation: 0,
          height: 50,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: "#E5E7EB",
        },
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: "600",
          color: "#1F2937",
        },
        headerTitleAlign: "center",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#E5E7EB",
          height: 90,
          paddingBottom: 20,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "400",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "",
          headerShown: true,
          tabBarIcon: ({ color }) => <TabBarIcon name="🏠" color={color} />,
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: "지도",
          tabBarIcon: ({ color }) => <TabBarIcon name="📍" color={color} />,
        }}
        listeners={{
          tabPress: () => {
            setSelectedCategory("");
          },
        }}
      />
      <Tabs.Screen
        name="coupons"
        options={{
          title: "쿠폰",
          tabBarIcon: ({ color }) => <TabBarIcon name="🎟️" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "마이",
          tabBarIcon: ({ color }) => <TabBarIcon name="👤" color={color} />,
        }}
      />
    </Tabs>
  );
}

// 간단한 아이콘 컴포넌트 (이모지 사용)
function TabBarIcon({ name, color }: { name: string; color: string }) {
  return <Text style={{ fontSize: 24 }}>{name}</Text>;
}
