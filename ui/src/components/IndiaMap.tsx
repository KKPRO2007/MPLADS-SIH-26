"use client";

import React, { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { INDIA_MAP_DATA } from "../config/mapData";
import { useAccessibility } from "../context/AccessibilityContext";

export type StateData = {
  name: string;
  total: number;
  dominant: "low" | "medium" | "high";
};

export type IndiaMapProps = {
  onSelectState?: (stateName: string) => void;
  selectedState?: string;
  selectedRisk?: string;
  stateData?: StateData[];
};

/* ── Proper Indian National Flag (SVG) ──────────────────────────── */
const IndianFlag: React.FC<{ width?: number }> = ({ width = 60 }) => {
  const h = (width * 2) / 3;
  const bandH = h / 3;
  const cx = width / 2;
  const cy = h / 2;
  const r = bandH * 0.38;

  const spokes = Array.from({ length: 24 }).map((_, i) => {
    const angle = (i * 15 * Math.PI) / 180;
    return (
      <line
        key={i}
        x1={cx + r * 0.22 * Math.cos(angle)}
        y1={cy + r * 0.22 * Math.sin(angle)}
        x2={cx + r * Math.cos(angle)}
        y2={cy + r * Math.sin(angle)}
        stroke="#000080"
        strokeWidth={width * 0.005}
      />
    );
  });

  const dots = Array.from({ length: 24 }).map((_, i) => {
    const angle = (i * 15 * Math.PI) / 180;
    return (
      <circle
        key={`d${i}`}
        cx={cx + r * 1.05 * Math.cos(angle)}
        cy={cy + r * 1.05 * Math.sin(angle)}
        r={width * 0.005}
        fill="#000080"
      />
    );
  });

  return (
    <svg
      width={width}
      height={h}
      viewBox={`0 0 ${width} ${h}`}
      aria-label="Flag of India"
      role="img"
      className="flex-shrink-0 rounded-sm shadow-md"
      style={{ border: "1px solid #e2e8f0" }}
    >
      <rect x="0" y="0" width={width} height={bandH} fill="#FF9933" />
      <rect x="0" y={bandH} width={width} height={bandH} fill="#FFFFFF" />
      <rect x="0" y={bandH * 2} width={width} height={bandH} fill="#138808" />
      <circle cx={cx} cy={cy} r={r} stroke="#000080" strokeWidth={width * 0.012} fill="none" />
      <circle cx={cx} cy={cy} r={r * 0.18} fill="#000080" />
      {spokes}
      {dots}
    </svg>
  );
};

/**
 * @component IndiaMap
 * @description Interactive SVG map of India — clean white fill with black outlines.
 * Same interactive structure: click to select states, hover tooltips, keyboard nav.
 */
const IndiaMap: React.FC<IndiaMapProps> = ({
  onSelectState,
  selectedState = "All States",
  selectedRisk = "All",
  stateData = [],
}) => {
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const { reduceMotion } = useAccessibility();

  const dataByName = useMemo(() => {
    const map: Record<string, StateData> = {};
    for (const d of stateData) {
      map[d.name] = d;
    }
    return map;
  }, [stateData]);

  const handleSelect = useCallback(
    (stateName: string) => {
      if (onSelectState) {
        onSelectState(stateName === selectedState ? "All States" : stateName);
      }
    },
    [onSelectState, selectedState]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, stateName: string) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleSelect(stateName);
      }
    },
    [handleSelect]
  );

  // ── Simple black & white fill ──────────────────────────────────
  const getFillColor = useCallback(
    (locName: string, isSelected: boolean, isHovered: boolean) => {
      if (isSelected) return "#1e1e1e";     // dark fill for selected
      if (isHovered) return "#f0f0f0";      // light grey on hover
      return "#ffffff";                      // white default
    },
    []
  );

  const paths = useMemo(() => {
    return INDIA_MAP_DATA.locations.map((loc) => {
      const isSelected = selectedState === loc.name;
      const isHovered = hoveredState === loc.name;

      const fill = getFillColor(loc.name, isSelected, isHovered);
      const stroke = isSelected ? "#ffffff" : "#333333";
      const strokeWidth = isSelected ? "1.5" : "0.8";

      return (
        <motion.path
          key={loc.id}
          d={loc.path}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
          tabIndex={0}
          role="button"
          aria-label={`Select ${loc.name}`}
          aria-pressed={isSelected}
          onMouseEnter={() => setHoveredState(loc.name)}
          onMouseLeave={() => setHoveredState(null)}
          onClick={() => handleSelect(loc.name)}
          onKeyDown={(e) => handleKeyDown(e, loc.name)}
          initial={false}
          animate={{
            fill,
            scale: isHovered || isSelected ? 1.02 : 1,
            zIndex: isHovered || isSelected ? 10 : 1,
          }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.2 }}
          className="cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
          style={{
            filter: isHovered ? "drop-shadow(2px 3px 4px rgba(0,0,0,0.15))" : "none",
          }}
        />
      );
    });
  }, [selectedState, hoveredState, handleSelect, handleKeyDown, reduceMotion, getFillColor]);

  const hoveredData = hoveredState ? dataByName[hoveredState] : null;

  return (
    <div className="relative w-full rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-xl backdrop-blur-md">
      <header className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <IndianFlag width={52} />
          <div>
            <h3 className="text-xl font-black tracking-tight text-slate-900">
              Voter &amp; Project Impact Map
            </h3>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Select region for local insights
            </p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {hoveredState && (
            <motion.div
              key={hoveredState}
              initial={{ opacity: 0, x: 20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.9 }}
              className="flex items-center gap-2 rounded-full border border-slate-300 bg-slate-900 px-4 py-1.5 text-xs font-black text-white shadow-lg"
            >
              <span>{hoveredState}</span>
              {hoveredData && (
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px]">
                  {hoveredData.total} works ({hoveredData.dominant} risk)
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <div className="relative flex justify-center">
        <svg
          viewBox={INDIA_MAP_DATA.viewBox}
          className="h-auto max-h-[500px] w-full"
          aria-label="Interactive map of India"
          role="group"
          style={{ filter: "drop-shadow(3px 5px 6px rgba(0,0,0,0.18))" }}
        >
          {paths}
        </svg>
      </div>

      <footer className="mt-8 flex items-center justify-between border-t border-slate-100 pt-4">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full border border-slate-300 bg-white" />
            <span className="text-[10px] font-bold uppercase text-slate-500">
              Default
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-gray-100 border border-slate-300" />
            <span className="text-[10px] font-bold uppercase text-slate-500">
              Hovered
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-slate-900" />
            <span className="text-[10px] font-bold uppercase text-slate-500">
              Selected
            </span>
          </div>
        </div>

        <p className="text-[10px] italic text-slate-400">
          Use Tab keys to navigate regions
        </p>
      </footer>
    </div>
  );
};

export default IndiaMap;
