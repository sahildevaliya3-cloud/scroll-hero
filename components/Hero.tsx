"use client";

import React, { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Stat from "./Stat";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const HEADLINE_CHARS = [
  "W",
  "E",
  "L",
  "C",
  "O",
  "M",
  "E",
  "\u00A0",
  "I",
  "T",
  "Z",
  "F",
  "I",
  "Z",
  "Z",
];

const STATS_DATA = [
  {
    id: "box1",
    value: "58%",
    label: "Increase in pick up point use",
    style: { top: "5%", right: "30%" },
  },
  {
    id: "box2",
    value: "23%",
    label: "Decreased in customer phone calls",
    style: { bottom: "5%", right: "35%" },
  },
  {
    id: "box3",
    value: "27%",
    label: "Increase in pick up point use",
    style: { top: "5%", right: "10%" },
  },
  {
    id: "box4",
    value: "40%",
    label: "Decreased in customer phone calls",
    style: { bottom: "5%", right: "12.5%" },
  },
];

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const carRef = useRef<HTMLImageElement>(null);
  const roadRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const valueTextRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      if (!carRef.current || !roadRef.current || !containerRef.current || !trailRef.current) return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          isNormal: "(prefers-reduced-motion: no-preference)",
          isReduced: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { isReduced } = context.conditions as { isReduced: boolean };

          if (isReduced) {
            gsap.set(".text-box, .car", { opacity: 1, y: 0, scale: 1 });
            return;
          }

          const isScrolledMidway = typeof window !== "undefined" && window.scrollY > 30;

          // Page Load Intro Timeline
          const introTl = gsap.timeline({
            defaults: { ease: "power3.out" },
          });

          // Subtle car entrance to starting position (animating opacity + scale so no conflict with x)
          introTl.from(carRef.current, {
            opacity: 0,
            scale: 0.92,
            duration: 0.9,
            ease: "power2.out",
          });

          // Stat cards entering one by one
          introTl.from(
            ".text-box",
            {
              opacity: 0,
              y: 25,
              duration: 0.7,
              stagger: 0.15,
            },
            "-=0.5"
          );

          // Count percentages up from 0 during entrance
          const statBoxes = gsap.utils.toArray<HTMLElement>(".text-box", containerRef.current);
          statBoxes.forEach((box, index) => {
            const numEl = box.querySelector<HTMLElement>(".num-box");
            if (numEl) {
              const rawTarget = numEl.dataset.target || numEl.innerText || "";
              const numericVal = parseInt(rawTarget, 10);
              const suffix = rawTarget.replace(/\d+/g, "") || "%";

              if (!isNaN(numericVal)) {
                if (!isScrolledMidway) {
                  numEl.textContent = `0${suffix}`;
                  const counter = { val: 0 };
                  introTl.to(
                    counter,
                    {
                      val: numericVal,
                      duration: 0.8,
                      ease: "power2.out",
                      onUpdate: () => {
                        numEl.textContent = `${Math.round(counter.val)}${suffix}`;
                      },
                    },
                    `<+${index === 0 ? 0 : 0.15}`
                  );
                } else {
                  numEl.textContent = `${numericVal}${suffix}`;
                }
              }
            }
          });

          if (isScrolledMidway) {
            introTl.progress(1);
          }
        }
      );

      let letterElements: HTMLElement[] = [];
      let letterPositions: number[] = [];

      const updateLetterPositions = () => {
        if (!roadRef.current) return;
        letterElements = gsap.utils.toArray<HTMLElement>(".value-letter", containerRef.current);
        const roadRect = roadRef.current.getBoundingClientRect();
        letterPositions = letterElements.map((letter) => {
          const rect = letter.getBoundingClientRect();
          return rect.left - roadRect.left;
        });
      };

      updateLetterPositions();

      gsap.to(carRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
          pin: ".track",
          invalidateOnRefresh: true,
          onRefresh: updateLetterPositions,
        },
        x: () => {
          const roadWidth = roadRef.current ? roadRef.current.clientWidth : window.innerWidth;
          const carWidth = carRef.current ? carRef.current.offsetWidth : 440;
          return roadWidth - carWidth;
        },
        ease: "none",
        onUpdate: function () {
          if (!carRef.current || !trailRef.current) return;
          const carWidth = carRef.current.offsetWidth || 440;
          const carX = (gsap.getProperty(carRef.current, "x") as number) + carWidth * 0.45;
          gsap.set(trailRef.current, { width: carX });

          for (let i = 0; i < letterElements.length; i++) {
            const letter = letterElements[i];
            const letterX = letterPositions[i];
            if (letter !== undefined && letterX !== undefined) {
              letter.style.opacity = carX >= letterX ? "1" : "0";
            }
          }
        },
      });

      return () => mm.revert();
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="section relative w-full h-[200vh] bg-[var(--color-page-bg)]"
    >
      {/* Pinned / Sticky Viewport Canvas Track */}
      <div className="track sticky top-0 h-screen w-full flex items-center justify-center bg-[var(--color-hero-bg)] overflow-hidden">
        {/* Subtle Ambient Radial Glow on Hero Canvas */}
        <div className="absolute inset-0 pointer-events-none [background:radial-gradient(ellipse_75%_50%_at_50%_50%,rgba(255,255,255,0.03),transparent_70%)]" />

        {/* Horizontal Road Strip - Scaled to comfortably house the larger car */}
        <div
          ref={roadRef}
          id="road"
          className="road relative w-screen h-[155px] sm:h-[200px] md:h-[250px] bg-[var(--color-road-bg)] overflow-hidden border-y border-[var(--color-stat-card-border)]"
        >
          {/* Subtle Road Lane Markings */}
          <div className="road-lane absolute inset-x-0 top-1/2 -translate-y-1/2 h-[2px] w-full [background:repeating-linear-gradient(90deg,var(--color-road-lane)_0,var(--color-road-lane)_28px,transparent_28px,transparent_52px)] pointer-events-none z-0" />

          {/* Subtle Static Radial Glow on Road Surface */}
          <div className="absolute inset-0 pointer-events-none [background:radial-gradient(ellipse_60%_80%_at_30%_50%,rgba(255,255,255,0.035),transparent_75%)] z-0" />

          {/* Top-down Porsche 911 Asset (Sized ~25-30% larger, contour drop-shadow) */}
          <Image
            ref={carRef}
            id="car"
            src="/car.png"
            alt="Silver Porsche 911, top view"
            width={1469}
            height={683}
            priority
            className="car absolute inset-y-0 my-auto left-0 h-[125px] sm:h-[165px] md:h-[205px] w-auto z-10 select-none pointer-events-none drop-shadow-[0_18px_22px_rgba(0,0,0,0.55)] [will-change:transform]"
          />

          {/* Green Trail with Luminous Accent Glow */}
          <div
            ref={trailRef}
            id="trail"
            className="trail absolute top-0 left-0 h-full w-0 bg-[var(--color-trail)] shadow-[0_0_30px_var(--color-trail-glow)] drop-shadow-[0_0_15px_var(--color-trail-glow)] z-[1]"
          />

          {/* Value Text / Headline */}
          <h1
            ref={valueTextRef}
            id="valueText"
            aria-label="WELCOME ITZFIZZ"
            className="value-add absolute left-[5%] top-[15%] z-[5] flex items-center gap-[0.2rem] sm:gap-[0.3rem] text-[clamp(2.5rem,7.5vw,8rem)] font-bold leading-none select-none pointer-events-none text-[var(--color-headline)] [text-shadow:0_2px_14px_rgba(0,0,0,0.85)]"
            style={{ top: "15%" }}
          >
            {HEADLINE_CHARS.map((char, index) => (
              <span
                key={index}
                aria-hidden="true"
                className="value-letter inline-block text-[var(--color-headline)] opacity-0 [text-shadow:0_2px_14px_rgba(0,0,0,0.85)]"
              >
                {char}
              </span>
            ))}
          </h1>
        </div>

        {/* Floating Stat Badges */}
        {STATS_DATA.map((box) => (
          <Stat
            key={box.id}
            id={box.id}
            value={box.value}
            label={box.label}
            style={box.style}
          />
        ))}
      </div>
    </div>
  );
}





