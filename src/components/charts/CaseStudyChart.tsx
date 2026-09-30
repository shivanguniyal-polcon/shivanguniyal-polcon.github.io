import PMJAYChart from './PMJAYChart';
import PMJAYCalibration from './PMJAYCalibration';
import EVMChart from './EVMChart';
import EVMEventStudy from './EVMEventStudy';
import MineralsPolicyToggle from './MineralsPolicyToggle';
import WEFEFunnel from './WEFEFunnel';
import WEFEScenarios from './WEFEScenarios';
import DroneScenarios from './DroneScenarios';
import TaxonomyChart from './TaxonomyChart';

export default function CaseStudyChart({ chart }: { chart: string }) {
  switch (chart) {
    case 'pmjay':
      return <PMJAYChart />;
    case 'pmjayCal':
      return <PMJAYCalibration />;
    case 'evm':
      return <EVMChart />;
    case 'evmEvent':
      return <EVMEventStudy />;
    case 'minerals':
      return <MineralsPolicyToggle />;
    case 'wefe':
      return <WEFEFunnel />;
    case 'wefeScenarios':
      return <WEFEScenarios />;
    case 'taxonomy':
      return <TaxonomyChart />;
    case 'drone':
      return <DroneScenarios />;
    default:
      return null;
  }
}
