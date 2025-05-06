import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { SegmentedButtons, Text, Card } from "react-native-paper";
import { Calendar } from "react-native-calendars";
import { useConnectedUser } from "../../../utils/ConnectedUserContext";
import { VictoryPie } from "victory-native";
import { getUserJournal } from "../../../services/journal.service";
import { getEmotionCategories } from "../../../services/emotionCategories.service";
import { EmotionCategory } from "../../../utils/types/EmotionCategory";
import { JournalEntrys } from "../../../utils/types/JournalEntry.typeps";
import { IconButton } from "react-native-paper";
import {
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  addYears,
  subYears,
  format,
} from "date-fns";

const JournalScreen = () => {
  const [period, setPeriod] = useState<string>("week");
  const [emotionData, setEmotionData] = useState<any>([]);
  const [calendarMarks, setCalendarMarks] = useState({});
  const [title, setTitle] = useState("");
  const [categories, setCategories] = useState<EmotionCategory[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const { connectedUser } = useConnectedUser();
  console.log(emotionData);
  useEffect(() => {
    if (!connectedUser) return;
    fetchData();
  }, [connectedUser, period, selectedDate]);

  const fetchData = async () => {
    if (connectedUser) {
      try {
        const targetDateISO = selectedDate.toISOString();
        const [journalRes, categoriesRes] = await Promise.all([
          getUserJournal(connectedUser.id, period, targetDateISO),
          getEmotionCategories(),
        ]);

        console.log(journalRes);

        const entries = journalRes?.data?.entries || [];
        const allCategories = categoriesRes?.data || [];

        setCategories(allCategories);

        const grouped = groupByCategory(entries);
        setEmotionData(grouped.chartData);
        setCalendarMarks(grouped.markedDates);
        setTitle(getPeriodTitle(period, selectedDate));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const groupByCategory = (entries: JournalEntrys[]) => {
    const categoryCounts = {};
    const marked = {};

    entries.forEach((entry) => {
      const categoryName = entry.emotion.emotionCategory.name;
      const categoryColor = entry.emotion.emotionCategory.color;
      const date = entry.date;

      // comptage pour le camembert
      if (categoryCounts[categoryName]) {
        categoryCounts[categoryName].count += 1;
      } else {
        categoryCounts[categoryName] = {
          count: 1,
          color: categoryColor,
        };
      }

      // coloration du calendrier
      marked[date] = {
        marked: true,
        dotColor: categoryColor,
        selectedColor: categoryColor,
      };
    });

    const chartData = Object.entries(categoryCounts).map(
      ([categoryName, value]) => ({
        x: categoryName,
        y: value.count,
        color: value.color,
      }),
    );

    return {
      chartData,
      markedDates: marked,
    };
  };

  const handlePrev = () => {
    switch (period) {
      case "month":
        setSelectedDate(subMonths(selectedDate, 1));
        break;
      case "week":
        setSelectedDate(subWeeks(selectedDate, 1));
        break;
      case "year":
        setSelectedDate(subYears(selectedDate, 1));
        break;
    }
  };

  const handleNext = () => {
    switch (period) {
      case "month":
        setSelectedDate(addMonths(selectedDate, 1));
        break;
      case "week":
        setSelectedDate(addWeeks(selectedDate, 1));
        break;
      case "year":
        setSelectedDate(addYears(selectedDate, 1));
        break;
    }
  };

  const getPeriodTitle = (period: string, date: Date) => {
    switch (period) {
      case "week":
        return `Semaine du ${format(date, "dd MMM")} au ${format(addWeeks(date, 1), "dd MMM yyyy")}`;
      case "month":
        return format(date, "MMMM yyyy");
      case "year":
        return `Année ${format(date, "yyyy")}`;
      default:
        return "";
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text variant="titleMedium" style={styles.title}>
        Journal de bord
      </Text>

      <SegmentedButtons
        value={period}
        onValueChange={(v) => setPeriod(v)}
        buttons={[
          { value: "week", label: "Semaine" },
          { value: "month", label: "Mois" },
          { value: "year", label: "Année" },
        ]}
        style={styles.segment}
      />

      <View style={styles.navigationContainer}>
        <IconButton icon="chevron-left" size={20} onPress={handlePrev} />
        <Text style={styles.periodLabel}>{title}</Text>
        <IconButton icon="chevron-right" size={20} onPress={handleNext} />
      </View>

      <VictoryPie
        data={emotionData}
        colorScale={emotionData.map((item) => item.color)}
        innerRadius={70}
        labelRadius={100}
        style={{
          labels: { fill: "black", fontSize: 12, fontWeight: "bold" },
        }}
      />

      <View style={styles.legend}>
        {emotionData.map((item) => (
          <View key={item.x} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: item.color }]} />
            <Text>{item.x}</Text>
          </View>
        ))}
      </View>

      <Card style={styles.calendarCard}>
        <Card.Title title="Mon tracker d’émotions" />
        <Card.Content>
          <Calendar
            markedDates={calendarMarks}
            markingType={"dot"}
            theme={{
              selectedDayBackgroundColor: "#E0E0E0",
              todayTextColor: "#4CAF50",
            }}
          />
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontWeight: "bold", marginBottom: 8 },
  segment: { marginBottom: 8 },
  periodLabel: { textAlign: "center", marginBottom: 12 },
  legend: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 10,
    justifyContent: "center",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 8,
    marginBottom: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  calendarCard: {
    marginTop: 12,
  },
  navigationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
});

export default JournalScreen;
