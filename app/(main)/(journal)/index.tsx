import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { SegmentedButtons, Text, Card, useTheme } from "react-native-paper";
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
  startOfWeek,
  endOfWeek,
} from "date-fns";
import { fr } from "date-fns/locale";
import { checkCanGoNext } from "../../../utils/functions/datesFunction";
import { formatDateKey } from "../../../utils/functions/calendarFunctions";

const JournalScreen = () => {
  const theme = useTheme();
  const [period, setPeriod] = useState<string>("week");
  const [emotionData, setEmotionData] = useState<any>([]);
  const [calendarMarks, setCalendarMarks] = useState({});
  const [title, setTitle] = useState("");
  const [categories, setCategories] = useState<EmotionCategory[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [canGoNext, setCanGoNext] = useState(true);
  const [calendarDate, setCalendarDate] = useState(new Date());

  console.log("calendarMarks", calendarMarks);

  const updateCanGoNext = useCallback(() => {
    const result = checkCanGoNext(selectedDate, period);
    setCanGoNext(result);
  }, [period, selectedDate]);

  const { connectedUser } = useConnectedUser();
  console.log(emotionData);
  useEffect(() => {
    if (!connectedUser) return;
    fetchData();
    updateCanGoNext();
  }, [connectedUser, period, selectedDate, updateCanGoNext]);

  useEffect(() => {
    // Quand on passe à la période "month", synchronise aussi le mois affiché
    if (period === "month") {
      setCalendarDate(selectedDate);
    }
  }, [period, selectedDate]);

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

        const formattedMarks = Object.fromEntries(
          Object.entries(grouped.markedDates).map(([dateKey, value]) => [
            formatDateKey(dateKey),
            value,
          ]),
        );

        setCalendarMarks(formattedMarks);
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

      // marquage calendrier
      marked[date] = {
        marked: true,
        dotColor: categoryColor,
      };
    });

    let chartData = Object.entries(categoryCounts).map(
      ([categoryName, value]) => ({
        x: categoryName,
        y: value.count,
        color: value.color,
      }),
    );

    // fallback si aucune donnée
    if (chartData.length === 0) {
      chartData = [
        {
          x: "Aucune donnée",
          y: 1,
          color: "#b4b4b4",
        },
      ];
    }

    return {
      chartData,
      markedDates: marked,
    };
  };

  const getCategoryCount = (categoryName: string) => {
    const found = emotionData.find((item) => item.x === categoryName);
    return found ? found.y : 0;
  };

  const handleNext = () => {
    let newDate;

    if (period === "week") {
      newDate = addWeeks(selectedDate, 1);
    } else if (period === "month") {
      newDate = addMonths(selectedDate, 1);
    } else {
      newDate = addYears(selectedDate, 1);
    }

    setSelectedDate(newDate);
    setCanGoNext(checkCanGoNext(newDate, period));
  };

  const handlePrev = () => {
    let newDate;

    if (period === "week") {
      newDate = addWeeks(selectedDate, -1);
    } else if (period === "month") {
      newDate = addMonths(selectedDate, -1);
    } else {
      newDate = addYears(selectedDate, -1);
    }

    setSelectedDate(newDate);
    setCanGoNext(checkCanGoNext(newDate, period));
  };

  const getPeriodTitle = (period: string, date: Date) => {
    switch (period) {
      case "week": {
        const start = startOfWeek(date, { weekStartsOn: 1 }); // lundi
        const end = endOfWeek(date, { weekStartsOn: 1 }); // dimanche
        return `Semaine du ${format(start, "dd MMM", { locale: fr })} au ${format(end, "dd MMM yyyy", { locale: fr })}`;
      }
      case "month":
        return format(date, "MMMM yyyy", { locale: fr });
      case "year":
        return `Année ${format(date, "yyyy")}`;
      default:
        return "";
    }
  };

  const isFallbackData =
    emotionData.length === 1 && emotionData[0].x === "Aucune donnée";

  const totalEntries = isFallbackData
    ? 0
    : emotionData.reduce((sum, item) => sum + item.y, 0);

  //TODO séparer les appels du calendrier et du chart (car sinon en mode semaine, le calendrier affiche que la semaine en cours... pas top)

  return (
    <ScrollView style={styles.container}>
      <Text variant="titleMedium" style={styles.title}>
        Journal de bord
      </Text>

      <SegmentedButtons
        value={period}
        onValueChange={(v) => {
          setPeriod(v);
          if (v === "month") {
            setCalendarDate(selectedDate);
          }
        }}
        buttons={[
          { value: "week", label: "Semaine" },
          { value: "month", label: "Mois" },
          { value: "year", label: "Année" },
        ]}
        style={styles.segment}
      />

      <View style={styles.navigationContainer}>
        <IconButton icon="chevron-left" onPress={handlePrev} />
        <Text style={styles.periodLabel}>{title}</Text>
        <IconButton
          icon="chevron-right"
          onPress={handleNext}
          disabled={!canGoNext}
          style={{ opacity: canGoNext ? 1 : 0.3 }}
        />
      </View>

      <View style={styles.pieContainer}>
        <VictoryPie
          data={emotionData}
          colorScale={emotionData.map((item) => item.color)}
          innerRadius={100}
          labels={({ datum }) => {
            return isFallbackData ? null : `${datum.y}`;
          }}
          labelRadius={81}
          style={{
            labels: { fill: "white", fontSize: 14, fontWeight: "bold" },
          }}
          width={250}
          height={250}
        />
        <View style={styles.pieCenterText}>
          <Text variant="headlineLarge" style={{ color: theme.colors.primary }}>
            {totalEntries}
          </Text>
          <Text variant="titleMedium" style={{ color: theme.colors.primary }}>
            Emotions
          </Text>
        </View>
      </View>

      <View style={styles.emotionsBox}>
        <View style={styles.emotionRow}>
          {categories.map((cat) => (
            <View key={cat.id} style={styles.emotionItem}>
              <IconButton
                icon={cat.smiley}
                size={32}
                iconColor={cat.color}
                style={{ margin: 0, padding: 0 }}
              />
              <Text
                variant="labelSmall"
                style={[styles.emotionLabel, { color: cat.color }]}
              >
                {cat.name}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <Card style={styles.calendarCard}>
        <Card.Title title="Mon tracker d’émotions" />
        <Card.Content>
          <Calendar
            markedDates={calendarMarks}
            markingType={"dot"}
            theme={{
              arrowColor: theme.colors.primary,
              selectedDayBackgroundColor: "#E0E0E0",
              todayTextColor: "#4CAF50",
              dotStyle: {
                marginTop: -30,
                height: 40,
                width: 40,
                borderRadius: 20,
                zIndex: 0,
              },
              textDayStyle: { zIndex: 3 },

              textDayFontWeight: "800",
              //     Day of week text (mon tue...)
              textSectionTitleColor: "#000000",
              textDayHeaderFontWeight: "700",
              textDayHeaderFontSize: 14,

              //     Today
              todayBackgroundColor: "white",

              //     textSectionTitleDisabledColor: 'black',
              selectedDayTextColor: "#ffffff",
            }}
            onMonthChange={(month) => {
              const newDate = new Date(month.year, month.month - 1, 1);
              setCalendarDate(newDate);
              if (period !== "month") {
                setPeriod("month");
              }
              setSelectedDate(newDate);
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
  periodLabel: { textAlign: "center" },
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
    marginBottom: 50,
  },
  navigationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  pieContainer: {
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  pieCenterText: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  emotionsBox: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  emotionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
  emotionItem: {
    alignItems: "center",
    justifyContent: "space-around",
    marginVertical: 6,
  },
  emotionLabel: {
    fontSize: 11,
    marginTop: 4,
    fontWeight: "700",
    textAlign: "center",
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default JournalScreen;
