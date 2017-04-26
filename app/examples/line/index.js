import { msft } from '../util/datasets';
import showComponent from '../util/showComponent';
import LineChart from '../../../components/LineChart';

window.onload = () => {
  showComponent(LineChart, {
    data: msft,
    x: 'date',
    y: ['price'],
    width: 735,
    height: 535,
    hoverSize: 50,
    padding: {
      top: 20,
      bottom: 45,
      left: 45,
      right: 20
    },
    renderer: 'svg'
  });
};
