import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  bootSequence,
  MEMORY_TARGET,
  MEMORY_STEP,
  MEMORY_INTERVAL,
  AUTO_BOOT_DELAY,
  getTimeBasedMessages,
} from "./boot-sequence";

describe("boot-sequence", () => {
  describe("constants", () => {
    it("should have correct memory target (1MB in KB)", () => {
      expect(MEMORY_TARGET).toBe(1048576);
    });

    it("should have correct memory step", () => {
      expect(MEMORY_STEP).toBe(16384);
    });

    it("should have correct memory interval", () => {
      expect(MEMORY_INTERVAL).toBe(20);
    });

    it("should have correct auto boot delay", () => {
      expect(AUTO_BOOT_DELAY).toBe(8000);
    });

    it("should complete memory test in reasonable time", () => {
      const iterations = MEMORY_TARGET / MEMORY_STEP;
      const totalTime = iterations * MEMORY_INTERVAL;
      // Should complete in about 1.28 seconds
      expect(totalTime).toBeLessThan(2000);
      expect(totalTime).toBeGreaterThan(1000);
    });
  });

  describe("bootSequence", () => {
    it("should have expected number of boot lines", () => {
      expect(bootSequence.length).toBeGreaterThan(10);
    });

    it("should start with header type", () => {
      expect(bootSequence[0].type).toBe("header");
    });

    it("should have a memory test line", () => {
      const memoryLine = bootSequence.find((line) => line.type === "memory");
      expect(memoryLine).toBeDefined();
      expect(memoryLine?.text).toContain("Memory Test");
    });

    it("should end with prompt type", () => {
      const lastLine = bootSequence[bootSequence.length - 1];
      expect(lastLine.type).toBe("prompt");
      expect(lastLine.text).toContain("Press DEL");
    });

    it("should have detection lines with highlight text", () => {
      const detectionLines = bootSequence.filter(
        (line) => line.type === "detection"
      );
      expect(detectionLines.length).toBeGreaterThan(0);
      detectionLines.forEach((line) => {
        expect(line.highlightText).toBeDefined();
      });
    });

    it("should have status lines with OK or Detected", () => {
      const statusLines = bootSequence.filter((line) => line.type === "status");
      expect(statusLines.length).toBeGreaterThan(0);
      statusLines.forEach((line) => {
        expect(["OK", "Detected"]).toContain(line.highlightText);
      });
    });

    it("should have all required line types", () => {
      const types = new Set(bootSequence.map((line) => line.type));
      expect(types.has("header")).toBe(true);
      expect(types.has("normal")).toBe(true);
      expect(types.has("memory")).toBe(true);
      expect(types.has("detection")).toBe(true);
      expect(types.has("status")).toBe(true);
      expect(types.has("prompt")).toBe(true);
    });

    it("should have non-negative delays", () => {
      bootSequence.forEach((line) => {
        expect(line.delay).toBeGreaterThanOrEqual(0);
      });
    });
  });

  describe("getTimeBasedMessages", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("should return morning message between 6 AM and 12 PM", () => {
      vi.setSystemTime(new Date(2026, 1, 28, 8, 0, 0)); // 8 AM

      const messages = getTimeBasedMessages();

      const morningMessage = messages.find((m) =>
        m.text.includes("coffee protocols")
      );
      expect(morningMessage).toBeDefined();
      expect(morningMessage?.highlightText).toBe("Brewing");
    });

    it("should return night owl message between 9 PM and 2 AM", () => {
      vi.setSystemTime(new Date(2026, 1, 28, 22, 0, 0)); // 10 PM

      const messages = getTimeBasedMessages();

      const nightMessage = messages.find((m) =>
        m.text.includes("Night owl mode")
      );
      expect(nightMessage).toBeDefined();
      expect(nightMessage?.highlightText).toBe("Active");
    });

    it("should return late night message between 2 AM and 6 AM", () => {
      vi.setSystemTime(new Date(2026, 1, 28, 3, 0, 0)); // 3 AM

      const messages = getTimeBasedMessages();

      const lateMessage = messages.find((m) =>
        m.text.includes("Extremely late session")
      );
      expect(lateMessage).toBeDefined();
      expect(lateMessage?.highlightText).toBe("Sleep?");
    });

    it("should return weekend message on Saturday", () => {
      vi.setSystemTime(new Date(2026, 1, 28, 12, 0, 0)); // Saturday noon

      const messages = getTimeBasedMessages();

      const weekendMessage = messages.find((m) =>
        m.text.includes("productivity drivers")
      );
      expect(weekendMessage).toBeDefined();
      expect(weekendMessage?.highlightText).toBe("Optional");
    });

    it("should return weekend message on Sunday", () => {
      vi.setSystemTime(new Date(2026, 2, 1, 12, 0, 0)); // Sunday noon

      const messages = getTimeBasedMessages();

      const weekendMessage = messages.find((m) =>
        m.text.includes("productivity drivers")
      );
      expect(weekendMessage).toBeDefined();
    });

    it("should return Monday message on Monday", () => {
      vi.setSystemTime(new Date(2026, 2, 2, 12, 0, 0)); // Monday noon

      const messages = getTimeBasedMessages();

      const mondayMessage = messages.find((m) =>
        m.text.includes("motivation.dll")
      );
      expect(mondayMessage).toBeDefined();
      expect(mondayMessage?.highlightText).toBe("Failed");
    });

    it("should return Friday message on Friday", () => {
      vi.setSystemTime(new Date(2026, 2, 6, 12, 0, 0)); // Friday noon

      const messages = getTimeBasedMessages();

      const fridayMessage = messages.find((m) =>
        m.text.includes("Friday detected")
      );
      expect(fridayMessage).toBeDefined();
      expect(fridayMessage?.highlightText).toBe("TGIF!");
    });

    it("should return Halloween message on October 31", () => {
      vi.setSystemTime(new Date(2026, 9, 31, 12, 0, 0)); // Oct 31

      const messages = getTimeBasedMessages();

      const halloweenMessage = messages.find((m) =>
        m.text.includes("Spooky mode")
      );
      expect(halloweenMessage).toBeDefined();
      expect(halloweenMessage?.highlightText).toBe("BOO!");
    });

    it("should return Christmas message on December 24-26", () => {
      vi.setSystemTime(new Date(2026, 11, 25, 12, 0, 0)); // Dec 25

      const messages = getTimeBasedMessages();

      const christmasMessage = messages.find((m) =>
        m.text.includes("Holiday cheer")
      );
      expect(christmasMessage).toBeDefined();
      expect(christmasMessage?.highlightText).toBe("Loaded");
    });

    it("should return New Year message on January 1", () => {
      vi.setSystemTime(new Date(2026, 0, 1, 12, 0, 0)); // Jan 1

      const messages = getTimeBasedMessages();

      const newYearMessage = messages.find((m) =>
        m.text.includes("Happy New Year")
      );
      expect(newYearMessage).toBeDefined();
      expect(newYearMessage?.highlightText).toBe("2026");
    });

    it("should return multiple messages when conditions overlap", () => {
      // Friday morning (should get both morning and Friday messages)
      vi.setSystemTime(new Date(2026, 2, 6, 8, 0, 0)); // Friday 8 AM

      const messages = getTimeBasedMessages();

      const morningMessage = messages.find((m) =>
        m.text.includes("coffee protocols")
      );
      const fridayMessage = messages.find((m) =>
        m.text.includes("Friday detected")
      );

      expect(morningMessage).toBeDefined();
      expect(fridayMessage).toBeDefined();
      expect(messages.length).toBeGreaterThanOrEqual(2);
    });

    it("should return empty array during regular afternoon hours on weekday", () => {
      // Tuesday 2 PM (no special messages)
      vi.setSystemTime(new Date(2026, 2, 3, 14, 0, 0));

      const messages = getTimeBasedMessages();

      expect(messages.length).toBe(0);
    });

    it("should return all messages with status type", () => {
      vi.setSystemTime(new Date(2026, 9, 31, 8, 0, 0)); // Halloween morning

      const messages = getTimeBasedMessages();

      messages.forEach((msg) => {
        expect(msg.type).toBe("status");
      });
    });
  });
});
