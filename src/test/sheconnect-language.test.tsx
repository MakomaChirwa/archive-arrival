import { fireEvent, render, screen, cleanup } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { LanguageProvider, useLanguage, LANGUAGE_STORAGE_KEY } from "@/lib/sheconnect-language";

function Controls() {
  const { language, setLanguage } = useLanguage();
  return <><button onClick={() => setLanguage("Sepedi")}>Choose Sepedi</button><button onClick={() => setLanguage("English")}>Choose English</button><select aria-label="Preference" value={language} onChange={e => setLanguage(e.target.value === "Sepedi" ? "Sepedi" : "English")}><option>English</option><option>Sepedi</option></select></>;
}

describe("Shared language preference", () => {
  beforeEach(() => localStorage.clear());
  afterEach(cleanup);
  it("synchronizes Sepedi across controls and marks the document as Northern Sotho", () => {
    render(<LanguageProvider><Controls /></LanguageProvider>);
    fireEvent.click(screen.getByText("Choose Sepedi"));
    expect((screen.getByLabelText("Preference") as HTMLSelectElement).value).toBe("Sepedi");
    expect(document.documentElement.lang).toBe("nso");
    expect(localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe("Sepedi");
  });
  it("restores the language after remounting and can switch back to English", () => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, "Sepedi");
    render(<LanguageProvider><Controls /></LanguageProvider>);
    expect((screen.getByLabelText("Preference") as HTMLSelectElement).value).toBe("Sepedi");
    fireEvent.click(screen.getByText("Choose English"));
    expect(document.documentElement.lang).toBe("en");
    expect(localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe("English");
  });
});