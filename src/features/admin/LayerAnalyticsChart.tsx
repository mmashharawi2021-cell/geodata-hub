import { useEffect, useMemo, useRef } from "react";
import {
  BarChart,
  PieChart,
  type BarSeriesOption,
  type PieSeriesOption,
} from "echarts/charts";
import {
  GridComponent,
  LegendComponent,
  TooltipComponent,
  type GridComponentOption,
  type LegendComponentOption,
  type TooltipComponentOption,
} from "echarts/components";
import * as echarts from "echarts/core";
import type { ComposeOption } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { useTheme } from "@/features/theme/ThemeProvider";
import type { LayerDetails, LayerLicense } from "@/types/layers";

type ChartOption = ComposeOption<
  | BarSeriesOption
  | GridComponentOption
  | LegendComponentOption
  | PieSeriesOption
  | TooltipComponentOption
>;

echarts.use([
  BarChart,
  CanvasRenderer,
  GridComponent,
  LegendComponent,
  PieChart,
  TooltipComponent,
]);

const licenseLabels: Record<LayerLicense, string> = {
  internal: "داخلية",
  open: "مفتوحة",
  private: "خاصة",
};

export function LayerAnalyticsChart({ layers }: { layers: LayerDetails[] }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { theme } = useTheme();

  const option = useMemo<ChartOption>(() => {
    const isDark = theme === "dark";
    const labelColor = isDark ? "#d8e6f2" : "#627181";
    const foregroundColor = isDark ? "#eef6ff" : "#16202b";
    const splitLineColor = isDark ? "rgba(255,255,255,0.1)" : "#e8eef2";

    const licenseCounts = layers.reduce<Record<LayerLicense, number>>(
      (accumulator, layer) => {
        accumulator[layer.license] += 1;
        return accumulator;
      },
      { internal: 0, open: 0, private: 0 },
    );

    return {
      color: ["#008f86", "#123d5a", "#38bdf8", "#f59e0b"],
      grid: {
        bottom: 38,
        left: 12,
        right: "42%",
        top: 30,
        containLabel: true,
      },
      legend: {
        bottom: 0,
        left: "center",
        textStyle: {
          color: labelColor,
          fontFamily: "Cairo Variable",
        },
      },
      series: [
        {
          barMaxWidth: 34,
          data: layers.map((layer) => layer.recordsCount),
          itemStyle: {
            borderRadius: [6, 6, 0, 0],
          },
          name: "السجلات",
          type: "bar",
        },
        {
          center: ["78%", "44%"],
          data: Object.entries(licenseCounts).map(([license, value]) => ({
            name: licenseLabels[license as LayerLicense],
            value,
          })),
          label: {
            color: foregroundColor,
            fontFamily: "Cairo Variable",
            formatter: "{b}",
          },
          name: "الترخيص",
          radius: ["42%", "64%"],
          type: "pie",
        },
      ],
      tooltip: {
        trigger: "item",
        textStyle: {
          fontFamily: "Cairo Variable",
        },
      },
      xAxis: {
        axisLabel: {
          color: labelColor,
          fontFamily: "Cairo Variable",
          interval: 0,
          rotate: 20,
        },
        axisLine: {
          lineStyle: {
            color: splitLineColor,
          },
        },
        data: layers.map((layer) => layer.name),
        type: "category",
      },
      yAxis: {
        axisLabel: {
          color: labelColor,
          fontFamily: "Cairo Variable",
        },
        splitLine: {
          lineStyle: {
            color: splitLineColor,
          },
        },
        type: "value",
      },
    };
  }, [layers, theme]);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const chart = echarts.init(containerRef.current, undefined, {
      renderer: "canvas",
    });
    chart.setOption(option);

    const resizeChart = () => chart.resize();
    window.addEventListener("resize", resizeChart);

    return () => {
      window.removeEventListener("resize", resizeChart);
      chart.dispose();
    };
  }, [option]);

  return (
    <div
      aria-label="تحليل الطبقات حسب عدد السجلات والترخيص"
      className="h-[320px] w-full"
      ref={containerRef}
      role="img"
    />
  );
}
