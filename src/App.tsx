import { Navbar } from "./components/Navbar";
import { HeroSection } from "./components/HeroSection";
import { ProblemAndSteps } from "./components/ProblemAndSteps";
import { CisternSimulator } from "./components/CisternSimulator";
import { HardwareRevealSection } from "./components/HardwareRevealSection";
import { DeviceAndAudience } from "./components/DeviceAndAudience";
import { ContactAndFooter } from "./components/ContactAndFooter";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-[#041122] text-[#e8f1f8]">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <ProblemAndSteps />
        <CisternSimulator />
        <HardwareRevealSection />
        <DeviceAndAudience />
      </main>
      <ContactAndFooter />
    </div>
  );
}
