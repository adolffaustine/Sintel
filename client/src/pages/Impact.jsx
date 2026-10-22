import SdgSection from '../components/SdgSection.jsx';

// content.sdgSection already ships a standalone-ready title/subtitle
// ("Technology Mapped to the Global Goals" / "Every Sintel project is
// scoped, built and measured against specific UN SDGs"), so no redundant
// page-level intro copy is layered on top of it here.
export default function Impact() {
  return <SdgSection />;
}
