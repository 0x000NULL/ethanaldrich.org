import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Terminal from "./Terminal";

// Mock the desktop store
const mockOpenWindow = vi.fn();
const mockSetAppState = vi.fn();
const mockSetTerminalOpen = vi.fn();

vi.mock("@/store/desktop-store", () => ({
  useDesktopStore: () => ({
    openWindow: mockOpenWindow,
    setAppState: mockSetAppState,
    setTerminalOpen: mockSetTerminalOpen,
  }),
}));

describe("Terminal", () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // Helper to type a command and submit the form
  const typeCommand = (input: HTMLElement, command: string) => {
    fireEvent.change(input, { target: { value: command } });
    // Submit the form that contains the input
    const form = input.closest("form");
    if (form) {
      fireEvent.submit(form);
    }
  };

  describe("rendering", () => {
    it("should render terminal interface", () => {
      render(<Terminal onClose={mockOnClose} />);

      expect(screen.getByText("ALDRICH DOS Terminal")).toBeInTheDocument();
      expect(screen.getByText(/ALDRICH DOS v4.20/)).toBeInTheDocument();
    });

    it("should display initial welcome message", () => {
      render(<Terminal onClose={mockOnClose} />);

      expect(
        screen.getByText(/Copyright \(C\) 2026 Aldrich Systems/)
      ).toBeInTheDocument();
      expect(screen.getByText(/Type "HELP" for available commands/)).toBeInTheDocument();
    });

    it("should render input field", () => {
      render(<Terminal onClose={mockOnClose} />);

      const input = screen.getByRole("textbox");
      expect(input).toBeInTheDocument();
    });

    it("should render close button", () => {
      render(<Terminal onClose={mockOnClose} />);

      expect(screen.getByText("[X]")).toBeInTheDocument();
    });
  });

  describe("commands", () => {
    describe("DIR", () => {
      it("should display directory listing", () => {
        render(<Terminal onClose={mockOnClose} />);

        const input = screen.getByRole("textbox");
        typeCommand(input, "DIR");

        expect(screen.getByText(/Volume in drive C is ALDRICH_SYS/)).toBeInTheDocument();
        expect(screen.getByText(/Directory of C:\\ALDRICH/)).toBeInTheDocument();
      });

      it("should show file and directory counts", () => {
        render(<Terminal onClose={mockOnClose} />);

        const input = screen.getByRole("textbox");
        typeCommand(input, "DIR");

        expect(screen.getByText(/File\(s\)/)).toBeInTheDocument();
        expect(screen.getByText(/Dir\(s\)/)).toBeInTheDocument();
      });
    });

    describe("CLS", () => {
      it("should clear terminal history", () => {
        render(<Terminal onClose={mockOnClose} />);

        // Verify initial content exists
        expect(screen.getByText(/ALDRICH DOS v4.20/)).toBeInTheDocument();

        const input = screen.getByRole("textbox");
        typeCommand(input, "CLS");

        // History should be cleared
        expect(screen.queryByText(/ALDRICH DOS v4.20/)).not.toBeInTheDocument();
      });
    });

    describe("VER", () => {
      it("should display version information", () => {
        render(<Terminal onClose={mockOnClose} />);

        const input = screen.getByRole("textbox");
        typeCommand(input, "VER");

        expect(screen.getByText(/ALDRICH DOS Version 4.20/)).toBeInTheDocument();
      });
    });

    describe("HELP", () => {
      it("should display help text", () => {
        render(<Terminal onClose={mockOnClose} />);

        const input = screen.getByRole("textbox");
        typeCommand(input, "HELP");

        expect(screen.getByText(/Available commands:/)).toBeInTheDocument();
        expect(screen.getByText(/DIR/)).toBeInTheDocument();
      });

      it("should respond to ? alias", () => {
        render(<Terminal onClose={mockOnClose} />);

        const input = screen.getByRole("textbox");
        typeCommand(input, "?");

        expect(screen.getByText(/Available commands:/)).toBeInTheDocument();
      });
    });

    describe("RUN", () => {
      it("should show usage when no argument", () => {
        render(<Terminal onClose={mockOnClose} />);

        const input = screen.getByRole("textbox");
        typeCommand(input, "RUN");

        expect(screen.getByText(/Usage: RUN \[program\]/)).toBeInTheDocument();
      });

      it("should open window for valid programs", () => {
        render(<Terminal onClose={mockOnClose} />);

        const input = screen.getByRole("textbox");
        typeCommand(input, "RUN ABOUT.EXE");

        expect(screen.getByText(/Loading ABOUT.EXE/)).toBeInTheDocument();

        // Advance timers to trigger the setTimeout
        vi.advanceTimersByTime(300);

        expect(mockOpenWindow).toHaveBeenCalledWith("about");
        expect(mockSetTerminalOpen).toHaveBeenCalledWith(false);
      });

      it("should show error for invalid programs", () => {
        render(<Terminal onClose={mockOnClose} />);

        const input = screen.getByRole("textbox");
        typeCommand(input, "RUN INVALID.EXE");

        expect(screen.getByText(/Bad command or file name: INVALID.EXE/)).toBeInTheDocument();
      });
    });

    describe("TYPE", () => {
      it("should show usage when no argument", () => {
        render(<Terminal onClose={mockOnClose} />);

        const input = screen.getByRole("textbox");
        typeCommand(input, "TYPE");

        expect(screen.getByText(/Usage: TYPE \[filename\]/)).toBeInTheDocument();
      });

      it("should display file contents for valid files", () => {
        render(<Terminal onClose={mockOnClose} />);

        const input = screen.getByRole("textbox");
        typeCommand(input, "TYPE README.TXT");

        expect(screen.getByText(/ALDRICH PORTFOLIO SYSTEM/)).toBeInTheDocument();
      });

      it("should show error for invalid files", () => {
        render(<Terminal onClose={mockOnClose} />);

        const input = screen.getByRole("textbox");
        typeCommand(input, "TYPE NOTFOUND.TXT");

        expect(screen.getByText(/File not found: NOTFOUND.TXT/)).toBeInTheDocument();
      });
    });

    describe("CD", () => {
      it("should show current directory", () => {
        render(<Terminal onClose={mockOnClose} />);

        const input = screen.getByRole("textbox");
        typeCommand(input, "CD");

        expect(screen.getByText("C:\\ALDRICH")).toBeInTheDocument();
      });

      it("should show parent directory for ..", () => {
        render(<Terminal onClose={mockOnClose} />);

        const input = screen.getByRole("textbox");
        typeCommand(input, "CD ..");

        expect(screen.getByText("C:\\")).toBeInTheDocument();
      });

      it("should show error for invalid paths", () => {
        render(<Terminal onClose={mockOnClose} />);

        const input = screen.getByRole("textbox");
        typeCommand(input, "CD INVALID");

        expect(
          screen.getByText(/The system cannot find the path specified/)
        ).toBeInTheDocument();
      });
    });

    describe("CALC", () => {
      it("should show usage when no argument", () => {
        render(<Terminal onClose={mockOnClose} />);

        const input = screen.getByRole("textbox");
        typeCommand(input, "CALC");

        expect(screen.getByText(/Usage: CALC \[expression\]/)).toBeInTheDocument();
      });

      it("should evaluate valid expressions", () => {
        render(<Terminal onClose={mockOnClose} />);

        const input = screen.getByRole("textbox");
        typeCommand(input, "CALC 2+2");

        expect(screen.getByText(/2\+2 = 4/)).toBeInTheDocument();
      });

      it("should reject invalid characters", () => {
        render(<Terminal onClose={mockOnClose} />);

        const input = screen.getByRole("textbox");
        typeCommand(input, "CALC abc");

        expect(screen.getByText(/Syntax error in expression/)).toBeInTheDocument();
      });
    });

    describe("SHUTDOWN", () => {
      it("should set app state to shutdown", () => {
        render(<Terminal onClose={mockOnClose} />);

        const input = screen.getByRole("textbox");
        typeCommand(input, "SHUTDOWN");

        expect(screen.getByText(/Shutting down.../)).toBeInTheDocument();

        vi.advanceTimersByTime(500);

        expect(mockSetTerminalOpen).toHaveBeenCalledWith(false);
        expect(mockSetAppState).toHaveBeenCalledWith("shutdown");
      });
    });

    describe("EXIT", () => {
      it("should call onClose callback", () => {
        render(<Terminal onClose={mockOnClose} />);

        const input = screen.getByRole("textbox");
        typeCommand(input, "EXIT");

        expect(mockOnClose).toHaveBeenCalled();
      });
    });

    describe("unknown command", () => {
      it("should display error message", () => {
        render(<Terminal onClose={mockOnClose} />);

        const input = screen.getByRole("textbox");
        typeCommand(input, "INVALID");

        expect(screen.getByText(/Bad command or file name: INVALID/)).toBeInTheDocument();
      });
    });
  });

  describe("interactions", () => {
    it("should close on Escape key", () => {
      render(<Terminal onClose={mockOnClose} />);

      fireEvent.keyDown(window, { key: "Escape" });

      expect(mockOnClose).toHaveBeenCalled();
    });

    it("should close when clicking X button", () => {
      render(<Terminal onClose={mockOnClose} />);

      fireEvent.click(screen.getByText("[X]"));

      expect(mockOnClose).toHaveBeenCalled();
    });

    it("should handle case-insensitive commands", () => {
      render(<Terminal onClose={mockOnClose} />);

      const input = screen.getByRole("textbox");
      typeCommand(input, "ver");

      expect(screen.getByText(/ALDRICH DOS Version 4.20/)).toBeInTheDocument();
    });
  });
});
