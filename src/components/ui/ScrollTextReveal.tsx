import React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";

interface ScrollRevealHeadingProps extends HTMLMotionProps<"h2"> {
  text: string;
  as?: "h1" | "h2" | "h3" | "h4";
  highlightWords?: string[];
  highlightClass?: string;
  className?: string;
  delay?: number;
  once?: boolean;
}

/**
 * Cinematic Scroll-Revealed Heading
 * Splits sentences into words that glide upwards through an invisible mask
 * as the user scrolls into view.
 */
export const ScrollRevealHeading: React.FC<ScrollRevealHeadingProps> = ({
  text,
  as = "h2",
  highlightWords = [],
  highlightClass = "text-[#e6b76c] bg-clip-text text-transparent bg-gradient-to-r from-[#e6b76c] via-[#ffd599] to-[#d4a04e]",
  className = "",
  delay = 0,
  once = false,
  ...props
}) => {
  const words = text.split(" ");
  const Tag = as as keyof typeof motion;
  const MotionTag = motion[Tag] as typeof motion.h2;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: delay,
      },
    },
  };

  const wordVariants = {
    hidden: {
      opacity: 0,
      y: "110%",
      rotateX: 25,
      filter: "blur(4px)",
    },
    visible: {
      opacity: 1,
      y: "0%",
      rotateX: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <MotionTag
      className={`inline-flex flex-wrap items-center justify-center gap-x-[0.3em] gap-y-1 ${className}`}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.2 }}
      {...props}
    >
      {words.map((word, i) => {
        const cleanWord = word.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "").toLowerCase();
        const isHighlight = highlightWords.some(
          (hw) => hw.toLowerCase() === cleanWord || cleanWord.includes(hw.toLowerCase())
        );

        return (
          <span key={i} className="inline-block overflow-hidden py-1">
            <motion.span
              variants={wordVariants}
              className={`inline-block will-change-transform ${
                isHighlight ? highlightClass : ""
              }`}
            >
              {word}
            </motion.span>
          </span>
        );
      })}
    </MotionTag>
  );
};

interface ScrollRevealSubtitleProps extends HTMLMotionProps<"p"> {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  once?: boolean;
}

/**
 * Luxurious Blur-to-Focus Subtitle
 * Ascends with subtle un-blur and gentle lift when scrolled into view
 */
export const ScrollRevealSubtitle: React.FC<ScrollRevealSubtitleProps> = ({
  children,
  className = "",
  delay = 0.15,
  once = false,
  ...props
}) => {
  return (
    <motion.p
      className={className}
      initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once, amount: 0.25 }}
      transition={{
        duration: 0.85,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      {...props}
    >
      {children}
    </motion.p>
  );
};

interface ScrollRevealBadgeProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  once?: boolean;
}

/**
 * Pill / Badge Pop-in with Ambient Gold Aura
 */
export const ScrollRevealBadge: React.FC<ScrollRevealBadgeProps> = ({
  children,
  className = "",
  delay = 0,
  once = false,
  ...props
}) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.84, y: 14 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once, amount: 0.2 }}
      transition={{
        duration: 0.65,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

interface ScrollRevealLineProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  direction?: "left" | "right" | "up" | "down";
  delay?: number;
  once?: boolean;
}

/**
 * Smooth Directional Text Reveal Item
 */
export const ScrollRevealLine: React.FC<ScrollRevealLineProps> = ({
  children,
  className = "",
  direction = "up",
  delay = 0,
  once = false,
  ...props
}) => {
  const getInitial = () => {
    switch (direction) {
      case "left":
        return { opacity: 0, x: -30 };
      case "right":
        return { opacity: 0, x: 30 };
      case "down":
        return { opacity: 0, y: -25 };
      case "up":
      default:
        return { opacity: 0, y: 25 };
    }
  };

  return (
    <motion.div
      className={className}
      initial={getInitial()}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, amount: 0.2 }}
      transition={{
        duration: 0.75,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};
