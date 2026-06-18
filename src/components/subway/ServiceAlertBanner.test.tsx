import { describe, it, expect, beforeEach } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import ServiceAlertBanner from "./ServiceAlertBanner";
import { useNavStore } from "@/store/nav-store";
import { IDENTITY } from "@/lib/subway/viewport";
import { ALERTS } from "@/data/subway";

beforeEach(() => {
  useNavStore.setState({
    dismissedAlerts: [],
    transform: IDENTITY,
    selectedStationCode: null,
    panelOpen: false,
  });
});

describe("ServiceAlertBanner", () => {
  it("renders the active alerts", () => {
    const { getAllByRole } = render(<ServiceAlertBanner />);
    expect(getAllByRole("status").length).toBe(ALERTS.length);
  });

  it("hides dismissed alerts and the whole banner when all are gone", () => {
    useNavStore.setState({ dismissedAlerts: ALERTS.map((a) => a.id) });
    const { container } = render(<ServiceAlertBanner />);
    expect(container.querySelector('[role="status"]')).toBeNull();
  });

  it("dismisses a dismissible alert", () => {
    const { getAllByRole, queryAllByRole } = render(<ServiceAlertBanner />);
    const before = getAllByRole("status").length;
    fireEvent.click(getAllByRole("button", { name: /dismiss alert/i })[0]);
    expect(useNavStore.getState().dismissedAlerts.length).toBe(1);
    expect(queryAllByRole("status").length).toBe(before - 1);
  });

  it("clicking an alert frames and selects its station", () => {
    const { getByText } = render(<ServiceAlertBanner />);
    fireEvent.click(getByText(/Fimil running express/i));
    expect(useNavStore.getState().selectedStationCode).toBe("C-02");
    expect(useNavStore.getState().transform).not.toEqual(IDENTITY);
  });
});
