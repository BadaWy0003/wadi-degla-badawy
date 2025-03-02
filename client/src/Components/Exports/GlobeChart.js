import React, { useEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

export default function GlobeChart({ selectedCountry }) {
  const chartRef = useRef(null);
  const polygonSeriesRef = useRef(null);
  const previousPolygonRef = useRef(null); // Store previously selected polygon

  useEffect(() => {
    let root = am5.Root.new("chartdiv");
  // 🚀 Remove amCharts watermark
  root._logo.dispose();

    root.setThemes([am5themes_Animated.new(root)]);

    let chart = root.container.children.push(
      am5map.MapChart.new(root, {
        panX: "rotateX",
        panY: "rotateY",
        projection: am5map.geoOrthographic(),
        paddingBottom: 20,
        paddingTop: 20,
        paddingLeft: 20,
        paddingRight: 20,
      })
    );

    let polygonSeries = chart.series.push(
      am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_worldLow,
      })
    );

    polygonSeries.mapPolygons.template.setAll({
        tooltipText: "{name}",
        toggleKey: "active",
        interactive: true,
        fill: am5.color("#ffffff"), // Default country color (gray)
        stroke: am5.color("#ffffff"), // Country border color (white)
        strokeWidth: 0.5, // Border thickness
      });
      
    polygonSeries.mapPolygons.template.states.create("hover", {
        fill: am5.color("#6a7b83"), //Hover color
    });

    polygonSeries.mapPolygons.template.states.create("active", {
        fill: am5.color("#ad9571"), // Highlight color
        stroke: am5.color("#ad9571"),
    });

    // Store references
    chartRef.current = chart;
    polygonSeriesRef.current = polygonSeries;

    return () => {
      root.dispose();
    };
  }, []);

  // Function to rotate the globe and highlight the selected country
  useEffect(() => {
    if (selectedCountry && polygonSeriesRef.current && chartRef.current) {
      const polygonSeries = polygonSeriesRef.current;
      const chart = chartRef.current;

      const dataItem = polygonSeries.getDataItemById(selectedCountry);
      if (!dataItem) {
        console.warn(`Country code ${selectedCountry} not found in map data.`);
        return;
      }

      const target = dataItem.get("mapPolygon");
      if (target) {
        const centroid = target.geoCentroid();
        if (centroid) {
          chart.animate({
            key: "rotationX",
            to: -centroid.longitude,
            duration: 1500,
            easing: am5.ease.inOut(am5.ease.cubic),
          });
          chart.animate({
            key: "rotationY",
            to: -centroid.latitude,
            duration: 1500,
            easing: am5.ease.inOut(am5.ease.cubic),
          });
        }

        // Remove previous highlight
        if (previousPolygonRef.current && previousPolygonRef.current !== target) {
          previousPolygonRef.current.set("active", false);
        }

        // Set new country as active (highlighted)
        target.set("active", true);
        previousPolygonRef.current = target;
      }
    }
  }, [selectedCountry]);

  return <div id="chartdiv" style={{ width: "100%", height: "500px", maxWidth: "100%" }}></div>;
}
